<script setup>
import { categories, types } from '~/constants'
import { z } from 'zod'
const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false
  }
})
const isEditing = computed(() => !!props.transaction)

const { toastSuccess, toastError } = useAppToast()
const emit = defineEmits(['update:modelValue', 'saved'])

//console.log("Mounted")

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
}

const state = ref(isEditing.value ? {
  type: props.transaction.type,
  amount: props.transaction.amount,
  created_at: props.transaction.created_at.split('T')[0], // Format date to YYYY-MM-DD
  description: props.transaction.description,
  category: props.transaction.category
} : { ...initialState })

const defaultSchema = z.object({
  amount: z.number().positive('Amount must be more than 0'),
  created_at: z.string().min(1, 'Transaction date is required'),
  description: z.string().optional(),
})

const incomeSchema = z.object({
  type: z.literal('Income'),

})

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum([
    'Food',
    'Housing',
    'Car',
    'Entertainment',
    'Health',
    'Clothing'
  ])
})

const investmentSchema = z.object({
  type: z.literal('Investment')
})

const savingSchema = z.object({
  type: z.literal('Saving')
})

const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, investmentSchema, savingSchema]),
  defaultSchema
)

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const form = ref()

const isLoading = ref(false)

const supabase = useSupabaseClient()

const save = async () => {
  if (form.value.errors.length) return
  isLoading.value = true

  try {
    const { error } = await supabase
      .from('transactions')
      .upsert({ ...state.value, id: props.transaction?.id })

    if (!error) {
      toastSuccess({
        title: 'Transaction saved successfully',
      })
      open.value = false
      emit('saved')
      return
    }

    throw error
  } catch (error) {
    toastError({
      title: 'Failed to save transaction',
      description: error.message || 'An error occurred while saving the transaction.',

    })
  } finally {
    isLoading.value = false
    resetForm()
  }
}

const resetForm = () => {
  Object.assign(state.value, initialState)
  form.value.clear()
}

</script>

<template>
  <UModal v-model:open="open" title="titlu" description="descriere" width="md">

    <template #title>
      {{ isEditing ? 'Edit' : 'Add' }} Transaction.
    </template>

    <template #description>
      {{ isEditing ? 'Edit the existing transaction.' : 'Fill out the form to add a new transaction.' }}
    </template>

    <template #body>
      <UForm :state="state" :schema="schema" ref="form" @submit="save" class="space-y-4" :validate-on="[]">

        <UFormField :required="true" label="Transaction type" name="type" class="mb-4">
          <USelect :disabled="isEditing" placeholder="Select the transaction type" :items="types"
            v-model="state.type" />
        </UFormField>

        <UFormField label="Amount" name="amount" required>
          <UInput type="number" placeholder="Amount" v-model.number="state.amount" />
        </UFormField>

        <UFormField label="Transaction date" :required="true" name="created_at" class="mb-4">
          <UInput type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at" />
        </UFormField>

        <UFormField label="Description" hint="Optional" name="description" class="mb-4">
          <UInput placeholder="Description" v-model="state.description" />
        </UFormField>

        <UFormField :required="true" label="Category" name="category" class="mb-4" v-if="state.type === 'Expense'">
          <USelect placeholder="Category" :items="categories" v-model="state.category" />
        </UFormField>

        <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="isLoading" />

      </UForm>
    </template>

  </UModal>
</template>