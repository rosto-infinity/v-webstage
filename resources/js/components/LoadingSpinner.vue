<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm dark:bg-background-dark/90">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMotion } from '@vueuse/motion';

const spinner = ref<HTMLElement>();

onMounted(() => {
    useMotion(spinner, {
        initial: { opacity: 0 },
        enter: { opacity: 1, transition: { duration: 300 } },
        leave: { opacity: 0, transition: { duration: 300 } },
    });
});
</script>

<style scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>
