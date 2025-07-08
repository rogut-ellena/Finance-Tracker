// composables/useAvatarUrl.ts
export const useAvatarUrl = () => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()
    const url = ref('')

    watchEffect(async () => {
        const path = user.value?.user_metadata?.avatar_url
        if (path) {
            const { data } = supabase.storage.from('avatars').getPublicUrl(path)
            url.value = data.publicUrl
        }
    })

    return { url }
}
