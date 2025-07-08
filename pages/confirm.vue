<script setup lang="ts">
import { useRedirectIfAuthenticated } from '~/composables/useRedirectIfAuthenticated';

useRedirectIfAuthenticated()
</script>

<template>
    <UCard>
        <template #header>
            Sign-in to Finance Tracker
        </template>

        Wait a moment while we sign you in...


    </UCard>
</template>