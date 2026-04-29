<template>
    <Head title="Années de Formation" />
    <AppLayout>
        <div class="mb-6 flex items-center justify-between">
            <h1 class="text-3xl font-bold">Années de Formation</h1>
            <Button @click="goToCreate">Ajouter</Button>
        </div>

        <div v-if="flash?.success" class="mb-4 rounded-md bg-green-50 p-4 text-green-700">
            {{ flash.success }}
        </div>
        <div v-if="flash?.error" class="mb-4 rounded-md bg-red-50 p-4 text-red-700">
            {{ flash.error }}
        </div>

        <div class="overflow-x-auto rounded-lg border bg-white shadow">
            <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Libellé</th>
                        <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Début</th>
                        <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Fin</th>
                        <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Statut</th>
                        <th class="px-6 py-3 text-left font-medium uppercase tracking-wider text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="yt in yearTrainings.data" :key="yt.id">
                        <td class="whitespace-nowrap px-6 py-4">{{ yt.label }}</td>
                        <td class="whitespace-nowrap px-6 py-4">{{ yt.start_date }}</td>
                        <td class="whitespace-nowrap px-6 py-4">{{ yt.end_date }}</td>
                        <td class="whitespace-nowrap px-6 py-4">
                            <span v-if="yt.is_active" class="inline-flex rounded-full bg-green-100 px-2 font-semibold text-green-800">
                                Active
                            </span>
                            <span v-else class="inline-flex rounded-full bg-gray-100 px-2 font-semibold text-gray-800">
                                Inactive
                            </span>
                        </td>
                        <td class="whitespace-nowrap px-6 py-4 font-medium">
                            <button @click="goToEdit(yt.id)" class="text-indigo-600 hover:text-indigo-900 mr-4">Éditer</button>
                            <button @click="handleDestroy(yt.id)" class="text-red-600 hover:text-red-900">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import Button from '@/components/ui/button/Button.vue';
import { Head, router } from '@inertiajs/vue3';

import { 
    create as createRoute,
    edit as editRoute,
    destroy as destroyRouteItem
} from '@/routes/year-trainings';

const props = defineProps<{
    yearTrainings: { data: any[] };
    flash?: { success?: string; error?: string };
}>();

function goToCreate() {
    router.get(createRoute().url);
}

function goToEdit(id: number) {
    router.get(editRoute({ year_training: id }).url);
}

function handleDestroy(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette année de formation ?')) {
        const route = destroyRouteItem({ year_training: id });
        router.delete(route.url);
    }
}
</script>
