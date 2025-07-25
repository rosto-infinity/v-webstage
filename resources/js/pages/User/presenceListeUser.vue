<script setup lang="ts">
import Badge from '@/components/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import AppLayoutUser from '@/layouts/AppLayoutUser.vue';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/vue3';
import { Calendar, CalendarCheck, Clock, Download, Users } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

interface Presence {
    id: number;
    date: string;
    arrival_time: string | null;
    departure_time: string | null;
    late_minutes: number;
    absent: boolean;
    late: boolean;
    absence_reason: string | null;
}

defineProps<{
    presenceCount: number;
}>();

// Initialisation des données
const page = usePage();
const data = ref<Presence[]>((page.props as any).presences);

// Filtres
const filterDateFrom = ref<string | null>(null);
const filterDateTo = ref<string | null>(null);
const filterStatus = ref<'all' | 'present' | 'absent' | 'late'>('all');
const currentWeek = ref<number>(0); // 0 = semaine actuelle

// Fonction pour obtenir les dates de début/fin de semaine
const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1) + weekOffset * 7;
    const startDate = new Date(today.setDate(diff));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
    };
};

// Appliquer le filtre semaine quand currentWeek change
watch(currentWeek, (newWeek) => {
    const { start, end } = getWeekDates(newWeek);
    filterDateFrom.value = start;
    filterDateTo.value = end;
});

// Données filtrées
const filteredData = computed(() => {
    return data.value.filter((r) => {
        const dateFilter = (!filterDateFrom.value || r.date >= filterDateFrom.value) && (!filterDateTo.value || r.date <= filterDateTo.value);

        const statusFilter =
            filterStatus.value === 'all' ||
            (filterStatus.value === 'present' && !r.absent && !r.late) ||
            (filterStatus.value === 'absent' && r.absent) ||
            (filterStatus.value === 'late' && r.late);

        return dateFilter && statusFilter;
    });
});

// Statistiques
const presentCount = computed(() => data.value.filter((r) => !r.absent).length);
const absentCount = computed(() => data.value.filter((r) => r.absent).length);
const lateCount = computed(() => data.value.filter((r) => r.late).length);

const exportPdf = () => {
    window.location.href = route('downloadpdf.presence');
};
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mes Présences',
        href: '/dashboard/presence-list-user',
    },
];
</script>

<template>
    <Head title="Mes Présences" />

    <AppLayoutUser :breadcrumbs="breadcrumbs">
        <!-- Statistiques -->
        <div class="mb-8 grid grid-cols-1 gap-4 p-2 md:grid-cols-2 xl:grid-cols-4">
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <Calendar class="h-6 w-6 text-primary" />
                <div>
                    <p class="text-sm text-muted-foreground">Total</p>
                    <p class="text-2xl font-bold">{{ presenceCount }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <CalendarCheck class="text-success h-6 w-6" />
                <div>
                    <p class="text-sm text-muted-foreground">Présents</p>
                    <p class="text-2xl font-bold">{{ presentCount }}</p>
                    <p class="text-success text-xs">({{ Math.round((presentCount / presenceCount) * 100) }}%)</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <Users class="h-6 w-6 text-destructive" />
                <div>
                    <p class="text-sm text-muted-foreground">Absents</p>
                    <p class="text-2xl font-bold">{{ absentCount }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <Clock class="text-warning h-6 w-6" />
                <div>
                    <p class="text-sm text-muted-foreground">Retards</p>
                    <p class="text-2xl font-bold">{{ lateCount }}</p>
                </div>
            </div>
        </div>

        <!-- Tableau -->
        <div class="p-4">
            <h1 class="mb-4 text-3xl font-bold">Mes Présences</h1>

            <!-- Filtres unifiés -->
            <div class="mb-4 flex flex-col gap-4 md:flex-row">
                <!-- Contrôle de la semaine -->
                <div class="flex items-center gap-2">
                    <button
                        @click="currentWeek--"
                        class="rounded-md bg-gray-200 p-1 px-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        &lt;
                    </button>
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200"
                        >Semaine {{ currentWeek >= 0 ? `+${currentWeek}` : currentWeek }}</span
                    >
                    <button
                        @click="currentWeek++"
                        class="rounded-md bg-gray-200 p-1 px-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        &gt;
                    </button>
                </div>

                <!-- Sélecteurs de date -->
                <label class="text-gray-800 dark:text-gray-200"
                    >De :
                    <input
                        type="date"
                        v-model="filterDateFrom"
                        class="input rounded-md border border-gray-300 bg-white p-1 text-gray-800 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                /></label>
                <label class="text-gray-800 dark:text-gray-200"
                    >À :
                    <input
                        type="date"
                        v-model="filterDateTo"
                        class="input rounded-md border border-gray-300 bg-white p-1 text-gray-800 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                /></label>

                <!-- Sélecteur de statut -->
                <select
                    v-model="filterStatus"
                    class="input rounded-md border border-gray-300 bg-white p-1 text-gray-800 focus:border-violet-400 focus:ring-1 focus:ring-violet-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                >
                    <option value="all" class="bg-white dark:bg-gray-800">Tous</option>
                    <option value="present" class="bg-white dark:bg-gray-800">Présents</option>
                    <option value="absent" class="bg-white dark:bg-gray-800">Absents</option>
                    <option value="late" class="bg-white dark:bg-gray-800">Retards</option>
                </select>

                <!-- Bouton d'export PDF -->
                <a @click="exportPdf">
                    <Button
                        class="flex cursor-pointer items-center gap-1 bg-violet-600 text-white transition-colors duration-200 hover:bg-violet-700"
                    >
                        <Download class="h-5 w-5" />
                        <span>Exporter-Pdf</span>
                        <span class="ml-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">New</span>
                    </Button>
                </a>
            </div>

            <!-- Période affichée -->
            <div class="mb-4 text-sm text-muted-foreground">
                Affichage de la période :
                <span class="font-medium">
                    {{ new Date(filterDateFrom).toLocaleDateString('fr-FR') }}
                    au
                    {{ new Date(filterDateTo).toLocaleDateString('fr-FR') }}
                </span>
            </div>

            <!-- Tableau des présences -->
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto rounded-xl border bg-card text-left text-sm">
                    <thead class="bg-muted">
                        <tr>
                            <th class="px-4 py-2">Date</th>
                            <th class="px-4 py-2">Arrivée</th>
                            <th class="px-4 py-2">Départ</th>
                            <th class="px-4 py-2">Retard</th>
                            <th class="px-4 py-2">Statut</th>
                            <th class="px-4 py-2">Motif</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in filteredData" :key="r.id" class="border-t hover:bg-muted/50">
                            <td class="px-4 py-2">{{ new Date(r.date).toLocaleDateString('fr-FR') }}</td>
                            <td class="px-4 py-2">{{ r.arrival_time ?? '-' }}</td>
                            <td class="px-4 py-2">{{ r.departure_time ?? '-' }}</td>
                            <td class="px-4 py-2">
                                <Badge :type="r.late_minutes > 0 ? 'warning' : 'success'"> {{ r.late_minutes }} min </Badge>
                            </td>
                            <td class="px-4 py-2">
                                <Badge v-if="r.absent" type="destructive">Absent</Badge>
                                <Badge v-else-if="r.late" type="warning">En retard</Badge>
                                <Badge v-else type="success">Présent</Badge>
                            </td>
                            <td class="px-4 py-2">
                                <Badge v-if="r.absent && r.absence_reason" type="secondary">
                                    {{ r.absence_reason }}
                                </Badge>
                                <span v-else>-</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AppLayoutUser>
</template>
