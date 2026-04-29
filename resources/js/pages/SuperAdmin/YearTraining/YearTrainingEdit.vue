<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import YearTrainingForm from './Partials/YearTrainingForm.vue';
import { update as updateRouteItem, index as indexRoute } from '@/routes/year-trainings';
import Button from '@/components/ui/button/Button.vue';

const props = defineProps<{
    yearTraining: { data: any };
    errors?: Record<string, string>;
}>();

const formData = ref({
    label: props.yearTraining.data.label,
    start_date: props.yearTraining.data.start_date,
    end_date: props.yearTraining.data.end_date,
    is_active: props.yearTraining.data.is_active,
});

const updateRoute = (id: number) => updateRouteItem.form({ year_training: id });

function goBack() {
    router.get(indexRoute().url);
}
</script>

<template>
    <Head title="Éditer une année de formation" />
    <AppLayout>
        <div class="mb-6">
            <h1 class="text-3xl font-bold">Éditer l'année : {{ yearTraining.data.label }}</h1>
        </div>

        <div class="rounded-lg border bg-card p-6 shadow">
            <YearTrainingForm 
                :action="updateRoute(yearTraining.data.id).action" 
                :method="updateRoute(yearTraining.data.id).method" 
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
