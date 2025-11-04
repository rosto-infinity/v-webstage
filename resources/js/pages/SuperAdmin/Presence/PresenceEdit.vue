<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { watch } from 'vue';
import * as presenceRoutes from '@/routes/presences';

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
    <Head title="Modifier la présence" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="mx-auto max-w-7xl p-6">
            <Link
                :href="presenceRoutes.users().url"
                prefetch
                class="mb-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-foreground transition-colors hover:bg-muted/80"
            >
                ← Retour à la liste
            </Link>

            <div class="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 class="mb-6 border-b border-border pb-4 text-2xl font-bold text-foreground">
                    Modifier la fiche de présence #{{ props.presence.id }}
                </h2>

                <form @submit.prevent="submit" class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <!-- Informations étudiant -->
                    <div class="space-y-4 rounded-lg bg-muted p-4 md:col-span-2">
                        <h3 class="font-medium text-foreground">Informations étudiant</h3>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-foreground">
                                Étudiant <span class="text-destructive">*</span>
                            </label>
                            <select
                                v-model="form.user_id"
                                class="w-full rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-ring"
                                :class="{ 'border-destructive': form.errors.user_id }"
                                required
                            >
                                <option value="" disabled>Sélectionnez un étudiant</option>
                                <option v-for="user in props.users" :key="user.id" :value="user.id">
                                    {{ user.name }} ({{ user.email }})
                                </option>
                            </select>
                            <p v-if="form.errors.user_id" class="mt-1 text-sm text-destructive">
                                {{ form.errors.user_id }}
                            </p>
                        </div>
                    </div>

                    <!-- Horaires -->
                    <div class="space-y-4 rounded-lg bg-muted p-4">
                        <h3 class="font-medium text-foreground">Horaires</h3>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-foreground">
                                Date <span class="text-destructive">*</span>
                            </label>
                            <input
                                v-model="form.date"
                                type="date"
                                class="w-full rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-ring"
                                :class="{ 'border-destructive': form.errors.date }"
                                required
                            />
                            <p v-if="form.errors.date" class="mt-1 text-sm text-destructive">
                                {{ form.errors.date }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-foreground">
                                Heure d'arrivée
                                <span v-if="!form.absent" class="text-destructive">*</span>
                            </label>
                            <input
                                v-model="form.heure_arrivee"
                                type="time"
                                :disabled="form.absent"
                                class="w-full rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                :class="{ 'border-destructive': form.errors.heure_arrivee }"
                            />
                            <p v-if="form.errors.heure_arrivee" class="mt-1 text-sm text-destructive">
                                {{ form.errors.heure_arrivee }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1 block text-sm font-medium text-foreground">
                                Heure de départ
                            </label>
                            <input
                                v-model="form.heure_depart"
                                type="time"
                                :disabled="form.absent"
                                class="w-full rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                :class="{ 'border-destructive': form.errors.heure_depart }"
                            />
                            <p v-if="form.errors.heure_depart" class="mt-1 text-sm text-destructive">
                                {{ form.errors.heure_depart }}
                            </p>
                        </div>
                    </div>

                    <!-- Statut -->
                    <div class="space-y-4 rounded-lg bg-muted p-4">
                        <h3 class="font-medium text-foreground">Statut</h3>

                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-foreground">
                                <input
                                    v-model="form.absent"
                                    type="checkbox"
                                    class="rounded border-input text-primary focus:ring-ring"
                                />
                                Absent(e)
                            </label>
                        </div>

                        <div v-if="!form.absent">
                            <label class="flex items-center gap-2 text-sm font-medium text-foreground">
                                <input
                                    v-model="form.en_retard"
                                    type="checkbox"
                                    class="rounded border-input text-primary focus:ring-ring"
                                />
                                En retard
                            </label>
                        </div>

                        <div v-if="form.en_retard && !form.absent">
                            <label class="mb-1 block text-sm font-medium text-foreground">
                                Minutes de retard <span class="text-destructive">*</span>
                            </label>
                            <input
                                v-model.number="form.minutes_retard"
                                type="number"
                                min="0"
                                max="300"
                                step="1"
                                class="w-full rounded-lg border border-input px-4 py-2 focus:ring-2 focus:ring-ring"
                                :class="{ 'border-destructive': form.errors.minutes_retard }"
                            />
                            <p v-if="form.errors.minutes_retard" class="mt-1 text-sm text-destructive">
                                {{ form.errors.minutes_retard }}
                            </p>
                            <p class="mt-1 text-xs text-muted-foreground">
                                Calculé automatiquement : {{ form.minutes_retard }} minutes
                            </p>
                        </div>
                    </div>

                    <!-- Boutons d'action -->
                    <div class="flex justify-end gap-4 border-t border-border pt-4 md:col-span-2">
                        <Link
                            :href="presenceRoutes.users().url"
                            class="rounded-lg border border-input px-6 py-2 text-foreground transition-colors hover:bg-muted"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            :disabled="form.processing"
                            class="rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span v-if="form.processing">Enregistrement...</span>
                            <span v-else>Enregistrer les modifications</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>