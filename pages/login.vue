<script setup lang="ts">
import { useRedirectIfAuthenticated } from '~/composables/useRedirectIfAuthenticated'

const success = ref(false)
const email = ref('')
const pending = ref(false)
//const password = ref('')
const { toastSuccess, toastError } = useAppToast()
const supabase = useSupabaseClient()
const redirectUrl = useRuntimeConfig().public.baseUrl

useRedirectIfAuthenticated()

const handleLogin = async () => {
    pending.value = true

    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: `${redirectUrl}/confirm`
            }
        })
        if (error) {
            toastError({
                title: 'Error authenticating',
                description: error.message,
            })
        } else {
            success.value = true
        }
    } finally {
        pending.value = false
    }
}

</script>


<template>
    <UCard v-if="!success">
        <template #header>
            Sign-in to Finance Tracker
        </template>

        <form @submit.prevent="handleLogin">
            <UFormField label="Email" name="email" class="mb-4" :required="true"
                help="You will receive an email with the confirmation link">
                <UInput type="email" name="email" placeholder="Enter your email" required v-model="email" />
            </UFormField>

            <!-- <UFormField label="Password" name="password" class="mb-4" required>
                <UInput type="password" name="password" placeholder="Enter your password" />
            </UFormField> -->

            <UButton type="submit" color="neutral" variant="solid" label="Sign In" :loading="pending"
                :disabled="pending" />
        </form>
    </UCard>
    <UCard v-else>
        <template #header>
            Email has been sent
        </template>

        <div class="text-center">
            <p class="mb-4">We have sent an email to <strong>{{ email }}</strong> with a link to sign in.</p>
            <p>
                <strong>Please check your email to complete the login process.</strong>
            </p>

        </div>
    </UCard>
</template>