import { computed, isRef } from 'vue'

/**
 * Format a number or reactive ref as EUR currency.
 * @param amount - a number or Ref<number>
 * @returns A computed Ref<string> with formatted currency
 */
export const useCurrency = (amount: number | Ref<number>) => {
  const currency = computed(() => {
    const value = isRef(amount) ? amount.value : amount
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  })

  return { currency }
}
