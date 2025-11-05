<template>
    <Head title="Présences" />
    <AppLayout :breadcrumbs="breadcrumbs">
        <!-- Message flash -->
        <div
            v-if="showFlash"
            :class="[
                'fixed top-4 right-4 z-50 max-w-md rounded-lg p-4 shadow-lg transition-all duration-300',
                flashType === 'success'
                    ? 'bg-success/10 border-success text-success-foreground'
                    : 'border-destructive bg-destructive/10 text-destructive-foreground',
            ]"
        >
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
        <div class="mb-8 grid grid-cols-1 gap-4 p-2 md:grid-cols-2 xl:grid-cols-4">
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <Users class="h-6 w-6 text-primary" />
                <div>
                    <p class="text-sm text-muted-foreground">Total</p>
                    <p class="text-2xl font-bold">{{ presenceCount }}</p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <Calendar class="text-success h-6 w-6" />
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
                    <p v-if="absentCount > 0" class="text-xs text-destructive">
                        {{ data.filter((p) => p.absent && !p.absence_reason).length }} sans motif
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
                <Clock class="text-warning h-6 w-6" />
                <div>
                    <p class="text-sm text-muted-foreground">Retards</p>
                    <p class="text-2xl font-bold">{{ lateCount }}</p>
                    <p v-if="lateCount > 0" class="text-warning text-xs">
                        Moyenne: {{ Math.round(data.reduce((a, b) => a + b.late_minutes, 0) / lateCount) }}min
                    </p>
                </div>
            </div>
        </div>

        <div class="p-4">
            <!-- Actions -->
            <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 class="text-3xl font-bold">Tableau de présence</h1>
                    <p class="text-muted-foreground">BTS 2 Génie Logiciel / DQP</p>
                </div>
                <div class="flex flex-wrap gap-2">
                    <Button>
                        <Link :href="route('presences.add')" class="flex gap-1">
                            <Pen class="h-5 w-5" />
                            Ajouter
                        </Link>
                    </Button>
                    
                    <!-- Export PDF Global -->
                    <a :href="route('presences.downloadAll')">
                        <Button class="cursor-pointer">
                            <Download class="h-5 w-5" />
                            PDF Tous
                        </Button>
                    </a>
                    
                    <!-- Export PDF par Utilisateur (avec filtres) -->
                    <Button 
                        @click="exportUserPdf" 
                        :disabled="!selectedUserForExport"
                        class="cursor-pointer"
                        variant="secondary"
                    >
                        <FileText class="h-5 w-5" />
                        PDF Utilisateur
                    </Button>
                    
                    <!-- Export PDF avec Période -->
                    <Button 
                        @click="exportUserPdfWithPeriod" 
                        :disabled="!selectedUserForExport || !filterDateFrom || !filterDateTo"
                        class="cursor-pointer"
                        variant="outline"
                    >
                        <CalendarRange class="h-5 w-5" />
                        PDF Période
                    </Button>
                    
                    <!-- Export ZIP tous les utilisateurs -->
                    <a :href="route('presences.users.pdf.zip')">
                        <Button class="cursor-pointer" variant="outline">
                            <Archive class="h-5 w-5" />
                            ZIP Tous
                        </Button>
                    </a>
                    
                    <!-- Export Excel -->
                    <a :href="route('presences.excel')">
                        <Button class="cursor-pointer">
                            <Download class="h-5 w-5" />
                            Excel
                        </Button>
                    </a>
                </div>
            </div>

            <!-- Filtres -->
            <div class="mb-4 flex flex-col gap-4 md:flex-row">
                <div class="relative flex-1">
                    <div class="flex">
                        <input
                            v-model="searchTerm"
                            @input="setCurrentPage(1)"
                            placeholder="Rechercher nom/email"
                            class="input w-full rounded-md border-1 border-violet-400 pl-10"
                        />
                        <Search class="mx-2 h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
                
                <select 
                    v-model="filterStatus" 
                    @change="setCurrentPage(1)" 
                    class="input rounded-md bg-violet-200 p-1"
                >
                    <option value="all">Tous</option>
                    <option value="present">Présents</option>
                    <option value="absent">Absents</option>
                    <option value="late">Retard</option>
                </select>
                
                <label class="flex items-center gap-2">
                    De : 
                    <input 
                        type="date" 
                        v-model="filterDateFrom" 
                        class="input rounded-md p-1" 
                    />
                </label>
                
                <label class="flex items-center gap-2">
                    À : 
                    <input 
                        type="date" 
                        v-model="filterDateTo" 
                        class="input rounded-md p-1" 
                    />
                </label>
                
                <select 
                    v-model="selectedUser" 
                    @change="handleUserChange" 
                    class="input rounded-md bg-violet-200 p-1"
                >
                    <option value="">Tous les utilisateurs</option>
                    <option 
                        v-for="user in usersWithIds" 
                        :key="user.id" 
                        :value="user.name"
                    >
                        {{ user.name }}
                    </option>
                </select>
            </div>

            <!-- Info utilisateur sélectionné -->
            <div 
                v-if="selectedUserForExport" 
                class="mb-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-4"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <UserCircle class="h-8 w-8 text-primary" />
                        <div>
                            <p class="font-semibold text-lg">{{ selectedUserForExport.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ selectedUserForExport.email }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <Badge type="success">
                            {{ filteredAndSortedData.length }} présence(s)
                        </Badge>
                        <Button 
                            @click="clearUserSelection" 
                            variant="ghost" 
                            size="sm"
                        >
                            <X class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Tableau -->
            <div class="overflow-x-auto">
                <table class="min-w-full table-auto rounded-xl border bg-card text-left text-sm">
                    <thead class="bg-muted">
                        <tr>
                            <th @click="handleSort('date')" class="th-sort px-4 py-2">
                                Date 
                                <SortIcon 
                                    field="date" 
                                    :sortField="sortField" 
                                    :direction="sortDirection" 
                                />
                            </th>
                            <th class="px-4 py-2">Nom</th>
                            <th class="px-4 py-2">E‑mail</th>
                            <th @click="handleSort('arrival_time')" class="th-sort px-4 py-2">
                                Arrivée 
                                <SortIcon 
                                    field="arrival_time" 
                                    :sortField="sortField" 
                                    :direction="sortDirection" 
                                />
                            </th>
                            <th @click="handleSort('departure_time')" class="th-sort px-4 py-2">
                                Départ 
                                <SortIcon 
                                    field="departure_time" 
                                    :sortField="sortField" 
                                    :direction="sortDirection" 
                                />
                            </th>
                            <th @click="handleSort('late_minutes')" class="th-sort px-4 py-2">
                                Retard 
                                <SortIcon 
                                    field="late_minutes" 
                                    :sortField="sortField" 
                                    :direction="sortDirection" 
                                />
                            </th>
                            <th class="px-4 py-2">Statut</th>
                            <th class="px-4 py-2">Motif</th>
                            <th colspan="2" class="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="r in paginatedData" 
                            :key="r.id" 
                            class="border-t hover:bg-muted/50"
                        >
                            <td class="px-4 py-2">
                                {{ new Date(r.date).toLocaleDateString('fr-FR') }}
                            </td>
                            <td class="px-4 py-2">{{ r.user.name }}</td>
                            <td class="px-4 py-2">{{ r.user.email }}</td>
                            <td class="px-4 py-2">{{ r.arrival_time ?? '-' }}</td>
                            <td class="px-4 py-2">{{ r.departure_time ?? '-' }}</td>
                            <td class="px-4 py-2">
                                <Badge :type="r.late_minutes > 0 ? 'warning' : 'success'">
                                    {{ r.late_minutes }} min
                                </Badge>
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
                                <Badge v-else-if="r.absent" type="destructive">
                                    Sans motif
                                </Badge>
                                <span v-else>-</span>
                            </td>
                            <td class="px-4 py-2">
                                <Link 
                                    :href="route('presences.edit', { id: r.id })" 
                                    class="text-primary hover:underline"
                                >
                                    <Pen class="inline h-4 w-4" /> Editer
                                </Link>
                            </td>
                            <td class="px-4 py-2">
                                <button 
                                    @click="deletePresence(r.id)" 
                                    class="text-destructive hover:underline"
                                >
                                    <Trash2 class="inline h-4 w-4" /> Suppr
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between py-4">
                <div>
                    <span class="text-muted-foreground">Afficher</span>
                    <select 
                        v-model="itemsPerPage" 
                        @change="setCurrentPage(1)" 
                        class="input mx-2"
                    >
                        <option v-for="n of [5, 10, 20, 50]" :key="n">{{ n }}</option>
                    </select>
                    <span class="text-muted-foreground">
                        sur {{ filteredAndSortedData.length }}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <button 
                        :disabled="currentPage === 1" 
                        @click="setCurrentPage(currentPage - 1)" 
                        class="btn btn-outline disabled:opacity-50"
                    >
                        <ChevronLeft class="h-4 w-4" />
                    </button>
                    <span class="text-muted-foreground">
                        Page {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button
                        :disabled="currentPage === totalPages"
                        @click="setCurrentPage(currentPage + 1)"
                        class="btn btn-outline disabled:opacity-50"
                    >
                        <ChevronRight class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup lang="ts">
import Badge from '@/components/Badge.vue';
import SortIcon from '@/components/SortIcon.vue';
import Button from '@/components/ui/button/Button.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import {
    Archive,
    Calendar,
    CalendarRange,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    FileText,
    Pen,
    Search,
    Trash2,
    UserCircle,
    Users,
    X,
} from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

// Import des routes Wayfinder
import * as userRoutes from '@/routes/users';

// Typage amélioré
interface User {
    id: number;
    name: string;
    email: string;
}

interface Presence {
    id: number;
    date: string;
    arrival_time: string | null;
    departure_time: string | null;
    late_minutes: number;
    absent: boolean;
    late: boolean;
    user: User;
    absence_reason: string | null;
}

// ✅ CORRECTION : Ajouter allUsers dans les props
const props = defineProps<{
    presenceCount: number;
    allUsers: User[];  // ✅ AJOUT
}>();

// Messages flash
const flash = computed(() => usePage().props.flash as { success?: string; error?: string; warning?: string });
const showFlash = ref(false);
const flashMessage = ref('');
const flashType = ref<'success' | 'error' | 'warning'>('success');

watch(
    flash,
    (newVal) => {
        const hasMessage = newVal.success || newVal.error || newVal.warning;
        if (hasMessage) {
            showFlash.value = true;
            flashMessage.value = newVal.success || newVal.error || newVal.warning || '';
            flashType.value = newVal.success ? 'success' : newVal.error ? 'error' : 'warning';
            setTimeout(() => (showFlash.value = false), 5000);
        }
    },
    { immediate: true },
);

// Initialisation des données
const page = usePage();
const rawPresences = (page.props as any).presences as Omit<Presence, 'late_minutes' | 'late'>[];
const data = ref<Presence[]>(
    rawPresences.map((r) => ({
        ...r,
        late_minutes: calculerMinutesRetard(r.arrival_time),
        late: calculerMinutesRetard(r.arrival_time) > 0,
        absence_reason: (r as any).absence_reason || null,
    })),
);

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

// ✅ CORRECTION : Utiliser allUsers depuis les props
const usersWithIds = computed(() => props.allUsers);

// Liste des noms d'utilisateurs (pour compatibilité)
const users = computed(() => usersWithIds.value.map((u) => u.name));

// Gérer la sélection d'utilisateur
function handleUserChange() {
    if (selectedUser.value) {
        const user = usersWithIds.value.find((u) => u.name === selectedUser.value);
        selectedUserForExport.value = user || null;
    } else {
        selectedUserForExport.value = null;
    }
    setCurrentPage(1);
}

// Effacer la sélection d'utilisateur
function clearUserSelection() {
    selectedUser.value = '';
    selectedUserForExport.value = null;
    setCurrentPage(1);
}

// Export PDF pour un utilisateur
function exportUserPdf() {
    if (!selectedUserForExport.value) {
        alert('Veuillez sélectionner un utilisateur');
        return;
    }
    
    const url = route('presences.user.pdf', { user: selectedUserForExport.value.id });
    window.open(url, '_blank');
}

// Export PDF pour un utilisateur avec période
function exportUserPdfWithPeriod() {
    if (!selectedUserForExport.value) {
        alert('Veuillez sélectionner un utilisateur');
        return;
    }
    
    if (!filterDateFrom.value || !filterDateTo.value) {
        alert('Veuillez sélectionner une période (Date de et Date à)');
        return;
    }
    
    const url = route('presences.user.pdf.period', {
        user: selectedUserForExport.value.id,
        startDate: filterDateFrom.value,
        endDate: filterDateTo.value,
    });
    window.open(url, '_blank');
}

// Données filtrées et triées
const filteredAndSortedData = computed(() => {
    return [...data.value]
        .filter((r) => {
            const term = searchTerm.value.toLowerCase();
            const matchName = r.user.name.toLowerCase().includes(term);
            const dateFilter =
                (!filterDateFrom.value || r.date >= filterDateFrom.value) &&
                (!filterDateTo.value || r.date <= filterDateTo.value);
            const userFilter = selectedUser.value === '' || r.user.name === selectedUser.value;
            return (
                matchName &&
                dateFilter &&
                userFilter &&
                (filterStatus.value === 'all' ||
                    (filterStatus.value === 'present' && !r.absent && !r.late) ||
                    (filterStatus.value === 'absent' && r.absent) ||
                    (filterStatus.value === 'late' && r.late))
            );
        })
        .sort((a, b) => {
            const aVal: any = a[sortField.value];
            const bVal: any = b[sortField.value];
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

// Statistiques
const presentCount = computed(() => data.value.filter((r) => !r.absent).length);
const absentCount = computed(() => data.value.filter((r) => r.absent).length);
const lateCount = computed(() => data.value.filter((r) => r.late).length);

// Méthodes
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

function deletePresence(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette présence ?')) {
        router.delete(route('presences.destroy', { presence: id }), {
            onSuccess: () => {
                data.value = data.value.filter((p) => p.id !== id);
            },
        });
    }
}

function calculerMinutesRetard(arrivee: string | null, normale = '08:00'): number {
    if (!arrivee) return 0;
    const [hArr, mArr] = arrivee.split(':').map(Number);
    const [hNorm, mNorm] = normale.split(':').map(Number);
    const diffMin = hArr * 60 + mArr - (hNorm * 60 + mNorm);
    return diffMin > 0 ? diffMin : 0;
}

// Breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Présences : Sup_Admin', href: userRoutes.index().url },
];
</script>
<style scoped>
.th-sort {
    cursor: pointer;
}
</style>