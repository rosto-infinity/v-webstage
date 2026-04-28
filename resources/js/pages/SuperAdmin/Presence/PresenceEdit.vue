<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { update as updatePresence, users as usersPresence, edit as editPresenceRoute } from '@/routes/presences';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { ArrowLeft } from 'lucide-vue-next';

import StudentSelector from './Partials/StudentSelector.vue';
import PresenceFormDetails from './Partials/PresenceFormDetails.vue';

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
    presence: { data: PresenceData };
    users: { data: User[] };
    absenceReasons: Array<{ id: number; name: string }>;
}>();

const presence = props.presence.data;
const users = props.users.data;

const form = useForm<Omit<PresenceData, 'id'>>({
    user_id: presence.user_id,
    date: presence.date,
    heure_arrivee: presence.heure_arrivee || '',
    heure_depart: presence.heure_depart || '',
    minutes_retard: presence.minutes_retard ?? null,
    absent: presence.absent,
    en_retard: presence.en_retard,
    absence_reason_id: presence.absence_reason_id ?? null,
});

const submit = () => {
    form.patch(updatePresence(presence.id).url, {
        preserveScroll: true,
    });
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Présences Sup_Admin', href: usersPresence().url },
    { title: `Édition Présence #${presence.id}`, href: editPresenceRoute(presence.id).url },
];
</script>

<template>
    <Head :title="`Modifier Présence #${presence.id}`" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="p-6">
            <Link
                :href="usersPresence().url"
                prefetch
                class="mb-6 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-foreground transition-colors hover:bg-muted/80"
            >
                <ArrowLeft class="h-4 w-4" />
                Retour à la liste
            </Link>

            <div class="rounded-xl border bg-card p-6 shadow-sm">
                <h2 class="mb-6 border-b pb-4 text-2xl font-bold text-foreground">Modifier la fiche de présence #{{ presence.id }}</h2>

                <form @submit.prevent="submit">
                    <div class="space-y-6">
                        <StudentSelector 
                            v-model="form.user_id" 
                            :users="users" 
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
                                <span v-else>Enregistrer les modifications</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
