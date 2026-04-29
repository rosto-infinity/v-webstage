<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import YearTrainingForm from './Partials/YearTrainingForm.vue';
import { store as storeRouteItem, index as indexRoute } from '@/routes/year-trainings';
import Button from '@/components/ui/button/Button.vue';

const props = defineProps<{
    errors?: Record<string, string>;
}>();

const formData = ref({
    label: '',
    start_date: '',
    end_date: '',
    is_active: false,
});

const storeRoute = storeRouteItem.form;

function goBack() {
    router.get(indexRoute().url);
}
</script>

<template>
    <Head title="Ajouter une année de formation" />
    <AppLayout>
        <div class="mb-6">
            <h1 class="text-3xl font-bold">Ajouter une année de formation</h1>
        </div>

        <div class="rounded-lg border bg-card p-6 shadow">
            <YearTrainingForm 
                :action="storeRoute().action" 
                :method="storeRoute().method" 
                :initialData="formData"
                :errors="errors"
            >
                <template #actions>
                    <Button type="button" variant="outline" @click="goBack">Annuler</Button>
                </template>
            </YearTrainingForm>
        </div>
    </AppLayout>
</template>
