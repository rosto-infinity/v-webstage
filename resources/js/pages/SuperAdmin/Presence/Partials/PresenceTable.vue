<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Pen, Trash2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import Badge from '@/components/Badge.vue';
import SortIcon from '@/components/SortIcon.vue';

const props = defineProps<{
    paginatedData: any[];
    sortField: string;
    sortDirection: 'asc' | 'desc';
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalFilteredItems: number;
}>();

const emit = defineEmits([
    'sort',
    'delete',
    'update:currentPage',
    'update:itemsPerPage',
    'edit-route'
]);
</script>

<template>
    <div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto rounded-xl border bg-card text-left text-sm">
                <thead class="bg-muted">
                    <tr>
                        <th @click="emit('sort', 'date')" class="th-sort px-4 py-2 cursor-pointer">
                            Date
                            <SortIcon field="date" :sortField="sortField" :direction="sortDirection" />
                        </th>
                        <th class="px-4 py-2">Nom</th>
                        <th class="px-4 py-2">E‑mail</th>
                        <th @click="emit('sort', 'heure_arrivee')" class="th-sort px-4 py-2 cursor-pointer">
                            Arrivée
                            <SortIcon field="heure_arrivee" :sortField="sortField" :direction="sortDirection" />
                        </th>
                        <th @click="emit('sort', 'heure_depart')" class="th-sort px-4 py-2 cursor-pointer">
                            Départ
                            <SortIcon field="heure_depart" :sortField="sortField" :direction="sortDirection" />
                        </th>
                        <th @click="emit('sort', 'minutes_retard')" class="th-sort px-4 py-2 cursor-pointer">
                            Retard
                            <SortIcon field="minutes_retard" :sortField="sortField" :direction="sortDirection" />
                        </th>
                        <th class="px-4 py-2">Statut</th>
                        <th class="px-4 py-2">Motif</th>
                        <th colspan="2" class="px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in paginatedData" :key="r.id" class="border-t hover:bg-muted/50">
                        <td class="px-4 py-2">
                            {{ new Date(r.date).toLocaleDateString('fr-FR') }}
                        </td>
                        <td class="px-4 py-2">{{ r.user?.name || '-' }}</td>
                        <td class="px-4 py-2">{{ r.user?.email || '-' }}</td>
                        <td class="px-4 py-2">{{ r.heure_arrivee ?? '-' }}</td>
                        <td class="px-4 py-2">{{ r.heure_depart ?? '-' }}</td>
                        <td class="px-4 py-2">
                            <Badge :type="r.minutes_retard > 0 ? 'warning' : 'success'"> {{ r.minutes_retard }} min
                            </Badge>
                        </td>
                        <td class="px-4 py-2">
                            <Badge v-if="r.absent" type="destructive">Absent</Badge>
                            <Badge v-else-if="r.en_retard" type="warning">En retard</Badge>
                            <Badge v-else type="success">Présent</Badge>
                        </td>
                        <td class="px-4 py-2">
                            <Badge v-if="r.absent && r.absence_reason" type="secondary">
                                {{ r.absence_reason }}
                            </Badge>
                            <Badge v-else-if="r.absent" type="destructive"> Sans motif </Badge>
                            <span v-else>-</span>
                        </td>
                        <td class="px-4 py-2">
                            <button @click="emit('edit-route', r.id)" class="text-primary hover:underline flex items-center gap-1">
                                <Pen class="h-4 w-4" /> Editer
                            </button>
                        </td>
                        <td class="px-4 py-2">
                            <button @click="emit('delete', r.id)" class="text-destructive hover:underline flex items-center gap-1">
                                <Trash2 class="h-4 w-4" /> Suppr
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
                    :value="itemsPerPage" 
                    @change="(e) => emit('update:itemsPerPage', parseInt((e.target as HTMLSelectElement).value))" 
                    class="input mx-2"
                >
                    <option v-for="n of [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
                </select>
                <span class="text-muted-foreground"> sur {{ totalFilteredItems }} </span>
            </div>
            <div class="flex items-center gap-2">
                <button :disabled="currentPage === 1" @click="emit('update:currentPage', currentPage - 1)"
                    class="btn btn-outline disabled:opacity-50">
                    <ChevronLeft class="h-4 w-4" />
                </button>
                <span class="text-muted-foreground"> Page {{ currentPage }} / {{ totalPages }} </span>
                <button :disabled="currentPage === totalPages || totalPages === 0" @click="emit('update:currentPage', currentPage + 1)"
                    class="btn btn-outline disabled:opacity-50">
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </div>
    </div>
</template>
