<script setup lang="ts">
import { UDropdownMenu } from '#components';
import type { DropdownMenuItem } from '@nuxt/ui';
const { toastSuccess, toastError } = useAppToast()

interface Transaction {
    id: string
    amount: number
    type: string
    description: string
    category?: string
    created_at?: string
}

const props = defineProps<{
    transaction: Transaction
}>()

const { currency } = useCurrency(props.transaction.amount)

const isLoading = ref(false);
const supabase = useSupabaseClient();
const emit = defineEmits(['deleted', 'edited'])
const open = ref(false);

const deleteTransaction = async () => {
    isLoading.value = true;
    try {
        await supabase.from('transactions')
            .delete()
            .eq('id', props.transaction.id)
        toastSuccess({
            title: 'Transaction deleted successfully'
        });
        emit('deleted', props.transaction.id);
    } catch (error) {
        toastError({
            title: 'Failed to delete transaction'
        });
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}
const items: DropdownMenuItem[][] = [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-20-solid',
            onClick: () => open.value = true
        },
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            onClick: deleteTransaction
        }
    ]
]



const isIncome = computed(() => props.transaction.type === 'Income');
const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-right');

const iconColor = computed(() => isIncome.value ? 'text-green-600' : 'text-red-600');


</script>
<template>
    <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">

        <div class="flex items-center justify-between space-x-4 col-span-2">
            <div class="flex items-center space-x-1">
                <UIcon :name="icon" :class="[iconColor]" />
                <div>{{ transaction.description }}</div>
            </div>
            <div>
                <UBadge color="neutral" v-if="transaction.category">{{ transaction.category }}</UBadge>
            </div>
        </div>

        <div class="flex items-center justify-end space-x-2">
            <div>{{ currency }}</div>
            <UDropdownMenu :items="items">
                <UButton label="" color="neutral" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal"
                    :loading="isLoading" />
                <TransactionModal v-if="open" v-model:open="open" :transaction="props.transaction"
                    @saved="$emit('edited')" />
            </UDropdownMenu>
        </div>

    </div>
</template>