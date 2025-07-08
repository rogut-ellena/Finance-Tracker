<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { url } = useAvatarUrl()

const items = ref<DropdownMenuItem[][]>([
    [{
        slot: 'account',
        disabled: true
    }],
    [{
        label: 'Settings',
        icon: 'i-heroicons-cog-8-tooth',
        onClick: () => navigateTo('/settings/profile')
    },
    {
        label: 'Sign out',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        onClick: () => {
            supabase.auth.signOut()
            return navigateTo('/login')
        }
    }]
])
</script>

<template>
    <header class="flex justify-between items-center mt-10">
        <NuxtLink to="/" class="text-xl font-bold">
            Finance tracker
        </NuxtLink>
        <div>
            <UDropdownMenu :items="items" :ui="{ content: 'w-64' }" v-if="user">
                <UAvatar :src="url" alt="Avatar" />

                <template #account="{ item }: { item: DropdownMenuItem }">
                    <div class="text-left">
                        <p>
                            Signed in as
                        </p>
                        <p class="font-medium text-gray-900 dark:text-white">
                            {{ user.email }}
                        </p>
                    </div>
                </template>

                <template #item="{ item }: { item: DropdownMenuItem }">
                    <span class="truncate">{{ item.label }}</span>

                    <UIcon :name="item.icon ?? 'i-heroicons-question-mark-circle'"
                        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
                </template>
            </UDropdownMenu>

        </div>
    </header>
</template>