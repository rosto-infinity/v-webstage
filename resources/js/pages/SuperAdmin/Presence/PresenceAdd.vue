<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, Form } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';
import { store as storePresence, users as usersPresence, add as addPresenceRoute } from '@/routes/presences';
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

import StudentSelector from './Partials/StudentSelector.vue';
import PresenceFormDetails from './Partials/PresenceFormDetails.vue';
import { useForm } from '@inertiajs/vue3';

const props = defineProps<{
    users: { data: Array<{ id: number; name: string; email: string }> };
    absenceReasons: Array<{ id: number; name: string }>;
    allYearTrainings: { data: Array<{ id: number; label: string }> };
    selectedYearId: number | null;
}>();

const handleYearChange = (yearId: string | number) => {
    router.get(addPresenceRoute().url, { year_training_id: yearId }, {
        preserveState: true,
        preserveScroll: true,
        replace: true
    });
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Présences Sup_Admin', href: usersPresence().url },
    { title: 'Ajout Présences : Sup_Admin', href: addPresenceRoute().url },
];

const form = useForm({
    user_id: null as number | null,
    date: new Date().toISOString().split('T')[0],
    heure_arrivee: '',
    heure_depart: '17:00:00',
    minutes_retard: null as number | null,
    absent: false,
    en_retard: false,
    absence_reason_id: null as number | null,
});

const submit = () => {
    form.post(storePresence.url(), {
        preserveScroll: true,
    });
};
</script>

<template>
    <Head title="Ajouter une présence" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="  p-6">
            <Link
                :href="usersPresence().url"
                prefetch
                class="mb-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-foreground transition-colors hover:bg-muted/80"
            >
                <ArrowLeft class="h-4 w-4" />
                Retour à la liste
            </Link>

            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <h2 class="mb-6 border-b pb-4 text-2xl font-bold text-foreground">Nouvelle fiche de présence</h2>

                <form @submit.prevent="submit">
                    <div class="space-y-6">
                        <!-- Filtre par année de formation -->
                        <div class="space-y-2 rounded-lg border bg-muted/30 p-4">
                            <label for="year_training" class="block text-sm font-medium text-foreground">
                                Filtrer par année de formation
                            </label>
                            <select 
                                id="year_training"
                                :value="props.selectedYearId"
                                @change="handleYearChange(($event.target as HTMLSelectElement).value)"
                                class="w-full rounded-lg border border-violet-400 bg-background p-2 text-sm font-semibold transition-colors focus:ring-2 focus:ring-primary"
                            >
                                <option v-for="year in props.allYearTrainings.data" :key="year.id" :value="year.id">
                                    {{ year.label }}
                                </option>
                            </select>
                            <p class="text-xs text-muted-foreground">Sélectionnez une année pour mettre à jour la liste des étudiants ci-dessous.</p>
                        </div>

                        <StudentSelector 
                            v-model="form.user_id" 
                            :users="props.users.data" 
                            :error="form.errors.user_id" 
                        />

                        <PresenceFormDetails 
                            :form="form" 
                            :absence-reasons="props.absenceReasons" 
                        />

                        <div class="flex gap-4 border-t pt-4">
                            <Link :href="usersPresence().url" class="rounded-lg border px-6 py-2 text-foreground transition-colors hover:bg-muted">
                                Annuler
                            </Link>
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-primary/60"
                            >
                                <span v-if="form.processing">Enregistrement...</span>
                                <span v-else>Enregistrer</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
