<template>
    <Head title="Présences" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <!-- Message flash -->
        <div v-if="showFlash" :class="[
            'fixed top-4 right-4 z-50 max-w-md rounded-lg p-4 shadow-lg transition-all duration-300',
            flashType === 'success'
                ? 'bg-success/10 border-success text-success-foreground'
                : 'border-destructive bg-destructive/10 text-destructive-foreground',
        ]">
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                    <h3 class="font-medium">{{ flashType === 'success' ? 'Succès' : 'Erreur' }}</h3>
                    <p class="mt-1 text-sm">{{ flashMessage }}</p>
                </div>
                <button @click="showFlash = false" class="text-muted-foreground hover:text-foreground">
                    <X class="h-5 w-5" />
                </button>
            </div>
        </div>

        <!-- Statistiques -->
        <PresenceStats 
            :presenceCount="presenceCount"
            :presentCount="presentCount"
            :absentCount="absentCount"
            :lateCount="lateCount"
            :presences="data"
        />

        <div class="p-4">
            <!-- Actions -->
            <PresenceActions 
                :addRoute="addPresenceRoute().url"
                :pdfAllRoute="pdfPresenceRoute().url"
                :zipAllRoute="zipPresenceRoute().url"
                :excelRoute="excelPresenceRoute().url"
                :selectedUserForExport="selectedUserForExport"
                :filterDateFrom="filterDateFrom"
                :filterDateTo="filterDateTo"
                @export-user-pdf="exportUserPdf"
                @export-user-pdf-period="exportUserPdfWithPeriod"
            />

            <!-- Filtres -->
            <PresenceFilters 
                v-model:searchTerm="searchTerm"
                v-model:filterStatus="filterStatus"
                v-model:filterDateFrom="filterDateFrom"
                v-model:filterDateTo="filterDateTo"
                v-model:selectedUser="selectedUser"
                :usersWithIds="usersWithIds"
                @update:selectedUser="handleUserChange"
                @reset-page="setCurrentPage(1)"
            />

            <!-- Info utilisateur sélectionné -->
            <div v-if="selectedUserForExport" class="mb-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <UserCircle class="h-8 w-8 text-primary" />
                        <div>
                            <p class="text-lg font-semibold">{{ selectedUserForExport.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ selectedUserForExport.email }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <Badge type="success"> {{ filteredAndSortedData.length }} présence(s) </Badge>
                        <Button @click="clearUserSelection" variant="ghost" size="sm">
                            <X class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Tableau -->
            <PresenceTable 
                :paginatedData="paginatedData"
                :sortField="sortField"
                :sortDirection="sortDirection"
                :currentPage="currentPage"
                :totalPages="totalPages"
                :itemsPerPage="itemsPerPage"
                :totalFilteredItems="filteredAndSortedData.length"
                @sort="handleSort"
                @delete="deletePresence"
                @edit-route="goToEdit"
                @update:currentPage="setCurrentPage"
                @update:itemsPerPage="updateItemsPerPage"
            />
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import Badge from '@/components/Badge.vue';
import Button from '@/components/ui/button/Button.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/vue3';
import { UserCircle, X } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

// Partials
import PresenceStats from './Partials/PresenceStats.vue';
import PresenceActions from './Partials/PresenceActions.vue';
import PresenceFilters from './Partials/PresenceFilters.vue';
import PresenceTable from './Partials/PresenceTable.vue';

// Routes
import { index as usersIndexRoute } from '@/routes/users';
import { 
    add as addPresenceRoute,
    edit as editPresenceRoute, 
    destroy as deletePresenceRoute, 
    excel as excelPresenceRoute,
    downloadAll as pdfPresenceRoute
} from '@/routes/presences';
import { pdf as userPdfPresenceRoute } from '@/routes/presences/user';
import { period as userPdfPeriodPresenceRoute } from '@/routes/presences/user/pdf';
import { zip as zipPresenceRoute } from '@/routes/presences/users/pdf';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Presence {
    id: number;
    date: string;
    heure_arrivee: string | null;
    heure_depart: string | null;
    minutes_retard: number;
    absent: boolean;
    en_retard: boolean;
    user: User;
    absence_reason: string | null;
}

const props = defineProps<{
    presenceCount: number;
    allUsers: { data: User[] };
    presences: { data: any[] };
}>();

// Messages flash
const flash = computed(() => usePage().props.flash as { success?: string; error?: string; warning?: string });
const showFlash = ref(false);
const flashMessage = ref('');
const flashType = ref<'success' | 'error' | 'warning'>('success');

watch(flash, (newVal) => {
    const hasMessage = newVal?.success || newVal?.error || newVal?.warning;
    if (hasMessage) {
        showFlash.value = true;
        flashMessage.value = newVal.success || newVal.error || newVal.warning || '';
        flashType.value = newVal.success ? 'success' : newVal.error ? 'error' : 'warning';
        setTimeout(() => (showFlash.value = false), 5000);
    }
}, { immediate: true });

// Initialisation des données (directement depuis la ressource)
const data = ref<Presence[]>(props.presences.data);

// Filtres et tris
const searchTerm = ref('');
const filterStatus = ref<'all' | 'present' | 'absent' | 'late'>('all');
const filterDateFrom = ref<string | null>(null);
const filterDateTo = ref<string | null>(null);
const selectedUser = ref('');
const selectedUserForExport = ref<User | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortField = ref<keyof Presence>('date');
const sortDirection = ref<'asc' | 'desc'>('desc');

const usersWithIds = computed(() => props.allUsers.data);

// Méthodes utilisateur
function handleUserChange(userName: string) {
    selectedUser.value = userName;
    if (userName) {
        const user = usersWithIds.value.find((u) => u.name === userName);
        selectedUserForExport.value = user || null;
    } else {
        selectedUserForExport.value = null;
    }
    setCurrentPage(1);
}

function clearUserSelection() {
    selectedUser.value = '';
    selectedUserForExport.value = null;
    setCurrentPage(1);
}

// Exports
function exportUserPdf() {
    if (!selectedUserForExport.value) return alert('Veuillez sélectionner un utilisateur');
    window.open(userPdfPresenceRoute({ user: selectedUserForExport.value.id }).url, '_blank');
}

function exportUserPdfWithPeriod() {
    if (!selectedUserForExport.value || !filterDateFrom.value || !filterDateTo.value) {
        return alert('Veuillez sélectionner un utilisateur et une période (Date de et Date à)');
    }
    window.open(userPdfPeriodPresenceRoute({
        user: selectedUserForExport.value.id,
        startDate: filterDateFrom.value,
        endDate: filterDateTo.value,
    }).url, '_blank');
}

// Données filtrées et triées
const filteredAndSortedData = computed(() => {
    return [...data.value]
        .filter((r) => {
            const term = searchTerm.value.toLowerCase();
            const matchName = r.user.name.toLowerCase().includes(term);
            const dateFilter = (!filterDateFrom.value || r.date >= filterDateFrom.value) && (!filterDateTo.value || r.date <= filterDateTo.value);
            const userFilter = selectedUser.value === '' || r.user.name === selectedUser.value;
            return (
                matchName &&
                dateFilter &&
                userFilter &&
                (filterStatus.value === 'all' ||
                    (filterStatus.value === 'present' && !r.absent && !r.en_retard) ||
                    (filterStatus.value === 'absent' && r.absent) ||
                    (filterStatus.value === 'late' && r.en_retard))
            );
        })
        .sort((a, b) => {
            let aVal: any = a[sortField.value];
            let bVal: any = b[sortField.value];
            
            // Nested sorting for user properties
            if (sortField.value as string === 'user') {
                aVal = a.user.name;
                bVal = b.user.name;
            }

            if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1;
            return 0;
        });
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredAndSortedData.value.length / itemsPerPage.value));
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredAndSortedData.value.slice(start, start + itemsPerPage.value);
});

// Stats issues de l'Action
const presentCount = computed(() => data.value.filter((r) => !r.absent).length);
const absentCount = computed(() => data.value.filter((r) => r.absent).length);
const lateCount = computed(() => data.value.filter((r) => r.en_retard).length);

// Méthodes du tableau
function handleSort(field: keyof Presence) {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortField.value = field;
        sortDirection.value = 'asc';
    }
    currentPage.value = 1;
}

function setCurrentPage(n: number) {
    currentPage.value = n;
}

function updateItemsPerPage(n: number) {
    itemsPerPage.value = n;
    currentPage.value = 1;
}

function goToEdit(id: number) {
    router.get(editPresenceRoute(id).url);
}

function deletePresence(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette présence ?')) {
        router.delete(deletePresenceRoute({ presence: id }).url, {
            onSuccess: () => {
                data.value = data.value.filter((p) => p.id !== id);
            },
        });
    }
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Présences : Sup_Admin', href: usersIndexRoute().url }];
</script>
