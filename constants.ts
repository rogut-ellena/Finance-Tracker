export const transactionViewOptions = [
  { label: 'Yearly', value: 'Yearly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Daily', value: 'Daily' }
] satisfies { label: string; value: TransactionViewOption }[]
export type TransactionViewOption = 'Yearly' | 'Monthly' | 'Daily'

export const categories = [
  'Food',
  'Housing',
  'Car',
  'Entertainment',
  'Health',
  'Clothing'
] as const

export const types = ['Income', 'Expense', 'Saving', 'Investment'] as const

// Tipuri derivate
//export type TransactionViewOption = (typeof transactionViewOptions)[number]['value']
export type Category = typeof categories[number]
 