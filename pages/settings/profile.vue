<script setup lang="ts">
import { LazyUFormField } from '#components'
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref({
    name: user.value?.user_metadata?.full_name || 'ooo',
    email: user.value?.email,
})

//console.log(user.value, 'user metadata full name')

const schema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email(),
})

const saveProfile = async () => {
    pending.value = true
    try {
        const data: any = {
            data: {
                full_name: state.value.name
            }
        }

        if (state.value.email !== user.value?.email) {
            data.email = state.value.email
        }


        const { error } = await supabase.auth.updateUser(data)
        if (error) {
            throw error
        }

        toastSuccess({
            title: 'Profile updated successfully',
            description: 'Your profile has been updated successfully.'

        })
    } catch (error) {
        toastError({
            title: 'Failed to update profile',
            description: String(error)
        })
    } finally {
        pending.value = false
    }
}

</script>
<template>
    <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
        <UFormField label="Full Name" name="name" class="mb-4">
            <UInput v-model="state.name" placeholder="Enter your full name" />
        </UFormField>
        <UFormField label="Email" name="email" class="mb-4"
            help="You will receive confirmation email on both the old an the new email address if you modify the email.">
            <UInput v-model="state.email" type="email" placeholder="Enter your email" />
        </UFormField>

        <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="pending" :disabled="pending" />

    </UForm>
</template>