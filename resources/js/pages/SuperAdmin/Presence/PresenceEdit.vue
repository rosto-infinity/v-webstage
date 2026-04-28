<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import * as presenceRoutes from '@/routes/presences';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';

interface PresenceData {
    id: number;
    user_id: number;
    date: string;
    heure_arrivee: string | null;
    heure_depart: string | null;
    minutes_retard: number;
    absent: boolean;
    en_retard: boolean;
    absence_reason_id?: number | null;
}

interface User {
    id: number;
    name: string;
    email: string;
}

const { props } = usePage<{
    presence: PresenceData;
    users: User[];
}>();

// ✅ Initialisation correcte du formulaire
const form = useForm<Omit<PresenceData, 'id'>>({
    user_id: props.presence.user_id,
    date: props.presence.date,
    heure_arrivee: props.presence.heure_arrivee,
    heure_depart: props.presence.heure_depart,
    minutes_retard: props.presence.minutes_retard ?? 0,
    absent: props.presence.absent,
    en_retard: props.presence.en_retard,
    absence_reason_id: props.presence.absence_reason_id,
});

// ✅ Logique : Si absent, réinitialiser les champs
watch(
    () => form.absent,
    (isAbsent) => {
        if (isAbsent) {
            form.heure_arrivee = null;
            form.heure_depart = null;
            form.minutes_retard = 0;
            form.en_retard = false;
        }
    },
);

// ✅ Calcul automatique du retard basé sur l'heure d'arrivée
watch(
    () => form.heure_arrivee,
    (newValue) => {
        if (!newValue || form.absent) {
            form.minutes_retard = 0;
            form.en_retard = false;
            return;
        }

        const normalTime = new Date(`1970-01-01T08:00:00`);
        const arrivalTime = new Date(`1970-01-01T${newValue}:00`);
        const delay = Math.floor((arrivalTime.getTime() - normalTime.getTime()) / (1000 * 60));

        if (delay > 0) {
            form.minutes_retard = delay;
            form.en_retard = true;
        } else {
            form.minutes_retard = 0;
            form.en_retard = false;
        }
    },
);

// ✅ Soumission avec PATCH (update)
const submit = () => {
    form.patch(presenceRoutes.update(props.presence.id).url, {
        preserveScroll: true,
        onSuccess: () => {
            // Ne pas reset le formulaire en mode édition
            console.log('✅ Présence mise à jour avec succès');
        },
        onError: (errors) => {
            console.error('❌ Erreurs de validation:', errors);
        },
    });
};

// Configuration UI
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Présences Sup_Admin', href: presenceRoutes.users().url },
    { title: `Édition Présence #${props.presence.id}`, href: presenceRoutes.edit(props.presence.id).url },
];
</script>

<template>
    <Head :title="`Modifier Présence #${props.presence.id}`" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="w-full p-4 sm:p-6">
            <!-- Header avec bouton retour -->
            <div class="mb-6 flex items-center justify-between">
                <h1 class="text-2xl font-bold text-foreground">Modifier la fiche de présence #{{ props.presence.id }}</h1>
                <Link
                    :href="presenceRoutes.users().url"
                    class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-muted"
                >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour
                </Link>
            </div>

            <!-- Formulaire -->
            <form @submit.prevent="submit" class="w-full space-y-6">
                <!-- Informations étudiant -->
                <div class="rounded-lg border bg-card p-6">
                    <h3 class="mb-4 text-lg font-semibold">Informations étudiant</h3>
                    <div>
                        <label class="mb-2 block text-sm font-medium">Étudiant <span class="text-destructive">*</span></label>
                        <select
                            v-model="form.user_id"
                            class="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary"
                            :class="{ 'border-destructive': form.errors.user_id }"
                        >
                            <option value="" disabled>Sélectionnez un étudiant</option>
                            <option v-for="user in props.users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.email }})</option>
                        </select>
                        <p v-if="form.errors.user_id" class="mt-1 text-sm text-destructive">{{ form.errors.user_id }}</p>
                    </div>
                </div>

                <!-- Grille responsive: 1 colonne mobile, 2 colonnes tablette+ -->
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <!-- Horaires -->
                    <div class="rounded-lg border bg-card p-6">
                        <h3 class="mb-4 text-lg font-semibold">Horaires</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium">Date <span class="text-destructive">*</span></label>
                                <input
                                    v-model="form.date"
                                    type="date"
                                    class="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary"
                                    :class="{ 'border-destructive': form.errors.date }"
                                />
                                <p v-if="form.errors.date" class="mt-1 text-sm text-destructive">{{ form.errors.date }}</p>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium">
                                    Heure d'arrivée <span v-if="!form.absent" class="text-destructive">*</span>
                                </label>
                                <input
                                    v-model="form.heure_arrivee"
                                    type="time"
                                    :disabled="form.absent"
                                    class="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted/50"
                                    :class="{ 'border-destructive': form.errors.heure_arrivee }"
                                />
                                <p v-if="form.errors.heure_arrivee" class="mt-1 text-sm text-destructive">{{ form.errors.heure_arrivee }}</p>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium">Heure de départ</label>
                                <input
                                    v-model="form.heure_depart"
                                    type="time"
                                    :disabled="form.absent"
                                    :min="form.heure_arrivee || undefined"
                                    class="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-muted/50"
                                    :class="{ 'border-destructive': form.errors.heure_depart }"
                                />
                                <p v-if="form.errors.heure_depart" class="mt-1 text-sm text-destructive">{{ form.errors.heure_depart }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Statut -->
                    <div class="rounded-lg border bg-card p-6">
                        <h3 class="mb-4 text-lg font-semibold">Statut</h3>
                        <div class="space-y-4">
                            <!-- Absent -->
                            <label class="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted">
                                <input
                                    v-model="form.absent"
                                    type="checkbox"
                                    class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                                />
                                <div>
                                    <div class="font-medium">Absent</div>
                                    <div class="text-sm text-muted-foreground">L'étudiant était absent ce jour</div>
                                </div>
                            </label>

                            <!-- En retard -->
                            <label class="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted">
                                <input
                                    v-model="form.en_retard"
                                    type="checkbox"
                                    :disabled="form.absent"
                                    class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div>
                                    <div class="font-medium">En retard</div>
                                    <div class="text-sm text-muted-foreground">
                                        {{ form.minutes_retard > 0 ? form.minutes_retard + ' minutes' : 'Calculé automatiquement' }}
                                    </div>
                                </div>
                            </label>

                            <!-- Minutes de retard (readonly) -->
                            <div v-if="form.en_retard && !form.absent">
                                <label class="mb-2 block text-sm font-medium">Minutes de retard</label>
                                <input
                                    v-model="form.minutes_retard"
                                    type="number"
                                    readonly
                                    class="w-full cursor-not-allowed rounded-lg border bg-muted/50 px-4 py-2.5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Motif d'absence (pleine largeur si absent) -->
                <div v-if="form.absent" class="rounded-lg border border-orange-200 bg-orange-50 p-6 dark:border-orange-800 dark:bg-orange-950/20">
                    <h3 class="mb-4 text-lg font-semibold text-orange-900 dark:text-orange-100">Motif d'absence</h3>
                    <div>
                        <label class="mb-2 block text-sm font-medium">Raison <span class="text-destructive">*</span></label>
                        <select
                            v-model="form.absence_reason_id"
                            class="w-full rounded-lg border px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary"
                            :class="{ 'border-destructive': form.errors.absence_reason_id }"
                        >
                            <option value="" disabled>Sélectionnez un motif</option>
                            <option value="1">Maladie</option>
                            <option value="2">Rendez-vous médical</option>
                            <option value="3">Problème familial</option>
                            <option value="4">Autre</option>
                        </select>
                        <p v-if="form.errors.absence_reason_id" class="mt-1 text-sm text-destructive">{{ form.errors.absence_reason_id }}</p>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Link
                        :href="presenceRoutes.users().url"
                        class="inline-flex items-center justify-center rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <svg v-if="form.processing" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        {{ form.processing ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                    </button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
