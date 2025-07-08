<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const val = ref(0)

const items = ref<NavigationMenuItem[][]>([
    [


        {
            label: 'Profile',
            content: 'Manage your profile settings',
            icon: 'i-heroicons-user-solid',
            to: '/settings/profile',
        },
        {
            label: 'Avatar',
            icon: 'i-heroicons-camera-16-solid',
            to: '/settings/avatar',
        },
        {
            label: 'Settings',
            icon: 'i-heroicons-cog-8-tooth-20-solid',
            to: '/settings/settings'
        }
    ]
])
</script>

<template>
    <div class="grid grid-cols-6 gap-8">

        <UNavigationMenu orientation="vertical" :items="items" />
        <div class="col-span-4">
            <NuxtPage />
        </div>

    </div>
</template>