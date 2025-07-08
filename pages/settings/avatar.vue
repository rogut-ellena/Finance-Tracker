<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast()
const { url } = useAvatarUrl()

const uploading = ref(false)
const fileInput = ref() // Reference to an input with ref="fileInput" attribute

console.log(user.value, 'user metadata full name')

const saveAvatar = async () => {
    // 1. Get the uploaded file
    //    a) If no file uploaded, show toast error
    // 2. Generate the new filename

    const file = fileInput.value?.files[0] // Get the first file from the input

    const fileExt = file?.name.split('.').pop() || 'png' // Default to png if no extension

    const fileName = `${Math.floor(Math.random() * 1000000000)}.${fileExt}`

    if (!file) {
        toastError({
            title: 'No file selected',
            description: 'Please select an image file to upload.'
        })
        return
    }

    try {
        uploading.value = true
        // 1. Grab the current avatar URL
        const currentAvatarUrl = user.value?.user_metadata?.avatar_url
        // 2. Upload the image to avatars bucket
        const { data, error } = await supabase.storage.from('avatars').upload(fileName, file)
        // 3. Update the user metadata with the avatar URL
        await supabase.auth.updateUser({
            data: {
                avatar_url: fileName // Store the filename in user metadata
            }
        })
        // 4. (OPTIONALLY) remove the old avatar file
        if (currentAvatarUrl) {
            const { error } = await supabase.storage.from('avatars').remove([currentAvatarUrl])
            if (error) {
                throw error
            }
        }

        // 5. Reset the file input
        fileInput.value.value = null // Reset the file input

        toastSuccess({
            title: 'Avatar uploaded',
        })
    } catch (error) {
        toastError({
            title: 'Error uploading avatar',
            description: String(error)
        })
    } finally {
        uploading.value = false
    }
}
</script>

<template>
    <div>
        <div class="mb-4">
            <UFormField label="Current avatar" class="w-full" help="This would be blank by default">
                <UAvatar :src="url" size="3xl" />
            </UFormField>
        </div>

        <div class="mb-4">
            <UFormField label="New avatar" class="w-full" name="avatar"
                help="After choosing an image click Save to actually upload the new avatar">
                <input type="file" ref="fileInput" class="w-full border p-2 rounded border-gray-400 " />
            </UFormField>
        </div>

        <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="uploading" :disabled="uploading"
            @click="saveAvatar" />
    </div>
</template>
