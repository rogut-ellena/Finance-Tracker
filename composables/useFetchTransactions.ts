import { ref, computed, watch, type Ref } from 'vue'
import { useSupabaseClient } from '#imports' // adaptabil în funcție de setup-ul tău Nuxt
import { useAsyncData } from '#app'

interface Transaction {
  id: string
  amount: number
  type: 'Income' | 'Expense' | 'Saving' | 'Investment'
  description: string
  category?: string
  created_at?: string
}

type Period = {
  from: Date
  to: Date
}

export const useFetchTransactions = (period: Ref<Period>) => {
  const supabase = useSupabaseClient()
  const pending = ref(false)
  const transactions = ref<Transaction[]>([])

 const fetchTransactions = async (): Promise<Transaction[]> => {
  pending.value = true

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', period.value.from.toISOString())
      .lte('created_at', period.value.to.toISOString())
      .order('created_at', { ascending: false })

    if (error || !data) return []

    transactions.value = data as Transaction[]
    return data
  } finally {
    pending.value = false
  }
}
 
  // const fetchTransactions = async (): Promise<Transaction[]> => {
  //   pending.value = true

  //   try {
  //     const { data } = await useAsyncData<Transaction[]>(
  //       `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
  //       async () => {
  //         const { data, error } = await supabase
  //           .from('transactions')
  //           .select('*')
  //           .gte('created_at', period.value.from.toISOString())
  //           .lte('created_at', period.value.to.toISOString())
  //           .order('created_at', { ascending: false })

  //         if (error || !data) return []
  //         return data as Transaction[]
  //       },
  //       {
  //         server: false // ca să ruleze doar pe client, altfel dublează apelul
  //       }
  //     )

  //     if (data.value) {
  //       transactions.value = data.value
  //     }

  //     return data.value ?? []
  //   } finally {
  //     pending.value = false
  //   }
  // }

  // Derivate
  const income = computed(() => transactions.value.filter(t => t.type === 'Income'))
  const expense = computed(() => transactions.value.filter(t => t.type === 'Expense'))
  const incomeCount = computed(() => income.value.length)
  const expenseCount = computed(() => expense.value.length)
  const incomeTotal = computed(() => income.value.reduce((sum, t) => sum + t.amount, 0))
  const expenseTotal = computed(() => expense.value.reduce((sum, t) => sum + t.amount, 0))

  const refresh = async () => {
    transactions.value = await fetchTransactions()
  }

  watch(period, async () => await refresh())

  onMounted(fetchTransactions)

  const transactionGroupedByDate = computed(() => {
    const grouped: Record<string, Transaction[]> = {}

    for (const t of transactions.value) {
      if (!t?.created_at) continue
      const date = t.created_at.split('T')[0]
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(t)
    }

    return grouped
  })

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionGroupedByDate
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    },
    refresh,
    pending
  }
}
