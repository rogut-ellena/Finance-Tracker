<script setup lang="ts">
import { computed } from 'vue'

// ✅ Rename this interface to avoid overriding native types
interface Transaction {
  id: string
  amount: number
  type: string
  description: string
  category?: string
  created_at?: string
}

// ✅ Correct plural name: you're passing multiple transactions
const props = defineProps<{
  date: string
  transactions: Transaction[]
}>()

// ✅ Loop over `props.transactions`, not `props.transaction`
const sum = computed(() => {
  return props.transactions.reduce((acc, transaction) => {
    return transaction.type === 'Income'
      ? acc + transaction.amount
      : acc - transaction.amount
  }, 0)
})

const { currency } = useCurrency(sum)

</script>

<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
    <div class="flex items-center justify-between">
      {{ date }}
    </div>
    <div class="flex items-center justify-end mr-10">
      {{ currency }}
    </div>
  </div>
</template>
