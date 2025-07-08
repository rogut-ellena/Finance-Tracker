<script setup>
import { z } from 'zod'
import { transactionViewOptions } from '~/constants'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref({
    transactionView: user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]

})
const schema = z.object({
    transactionView: z.enum(transactionViewOptions.map(option => option.value))
})

//console.log(user.value.user_metadata)

const saveSettings = async () => {
    pending.value = true

    try {
        const { error } = await supabase.auth.updateUser({
            data: {
                transaction_view: state.value.transactionView,
            } // The data goes here
        })
        if (error) throw error
        toastSuccess({
            title: 'Settings updated',
        })
    } catch (error) {
        toastError({
            title: 'Error updating settings',
            description: error.message,
        })
    } finally {
        pending.value = false
    }
}
</script>

<template>
    <UForm :state="state" :schema="schema" @submit.prevent="saveSettings">
        <UFormField label="Transaction View" class="mb-4" help="Choose how you would like to view transactions">
            <USelect v-model="state.transactionView" class="w-full" :items="transactionViewOptions" />
        </UFormField>

        <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="pending" :disabled="pending" />
    </UForm>
</template>
