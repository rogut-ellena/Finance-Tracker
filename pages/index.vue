<script setup lang="ts">
import { transactionViewOptions, type TransactionViewOption } from '~/constants'
import { useFetchTransactions } from '~/composables/useFetchTransactions'

const user = useSupabaseUser()
const open = ref(false)

const selectedView = ref(user.value?.user_metadata?.transaction_view ?? transactionViewOptions[1]) // Monthly

const currentViewValue = computed(() => selectedView.value.value ?? selectedView.value)

const { current, previous } = useSelectedTimePeriod(currentViewValue)

const { pending, refresh, transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: {
        byDate
    }
} } = useFetchTransactions(current)

await refresh()

const { refresh: refreshPrevious, transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
} } = useFetchTransactions(previous)

await refreshPrevious()
console.log("grouped: ", byDate, "currentViewValue: ", currentViewValue, "current:", current, "previous:", previous)


//await Promise.all([refresh(), refreshPrevious()])

</script>

<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>
        <div>
            <USelectMenu :items="transactionViewOptions" v-model="selectedView" />
        </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
        <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="prevIncomeTotal" :loading="pending" />
        <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="prevExpenseTotal" :loading="pending" />
        <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="pending" />
        <Trend color="red" title="Saving" :amount="4000" :last-amount="4000" :loading="pending" />
    </section>

    <section class="flex justify-between mb-10">
        <div>
            <h2 class="text-2xl font-extrabold">
                Transactions
            </h2>
            <div class="text-gray-500 dark:text-gray-400">
                You have {{ incomeCount }} income transactions and {{ expenseCount }} expenses this period
            </div>

        </div>
        <div>
            <TransactionModal v-model="open" @saved="refresh" />
            <UButton icon="i-heroicons-plus-circle" color="neutral" variant="solid" label="Add" @click="open = true" />
        </div>
    </section>

    <section v-if="!pending">
        <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">

            <div class="grid grid-cols-1 gap-4">
                <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
                <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction"
                    @deleted="refresh()" @edited="refresh()" />
            </div>
        </div>
    </section>
    <section v-else>
        <USkeleton class="w-full h-8 mb-2" v-for="i in 4" :key="i" />
    </section>
</template>
