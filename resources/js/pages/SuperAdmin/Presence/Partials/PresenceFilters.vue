<script setup lang="ts">
import { Search } from 'lucide-vue-next';

const props = defineProps<{
    searchTerm: string;
    filterStatus: 'all' | 'present' | 'absent' | 'late';
    filterDateFrom: string | null;
    filterDateTo: string | null;
    selectedUser: string;
    selectedYearId: number | null;
    usersWithIds: any[];
    allYearTrainings: { data: any[] };
}>();

const emit = defineEmits([
    'update:searchTerm',
    'update:filterStatus',
    'update:filterDateFrom',
    'update:filterDateTo',
    'update:selectedUser',
    'update:selectedYearId',
    'reset-page'
]);

function updateValue(event: Event, emitName: string) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    emit(emitName, target.value);
    emit('reset-page');
}
</script>

<template>
    <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
        <!-- Année de formation -->
        <div class="flex items-center gap-2">
            <span class="text-sm font-medium">Année :</span>
            <select 
                :value="selectedYearId" 
                @change="updateValue($event, 'update:selectedYearId')" 
                class="input rounded-md bg-violet-400/20 p-1 text-sm font-semibold border border-violet-400"
            >
                <template v-if="allYearTrainings?.data">
                    <option v-for="year in allYearTrainings.data" :key="year.id" :value="year.id">
                        {{ year.label }}
                    </option>
                </template>
            </select>
        </div>

        <div class="relative flex-1">
            <div class="flex">
                <input 
                    :value="searchTerm" 
                    @input="updateValue($event, 'update:searchTerm')" 
                    placeholder="Rechercher nom/email"
                    class="input w-full rounded-md border-1 border-violet-400 pl-10" 
                />
                <Search class="mx-2 h-5 w-5 text-muted-foreground absolute left-2 top-2.5" />
            </div>
        </div>

        <select 
            :value="filterStatus" 
            @change="updateValue($event, 'update:filterStatus')" 
            class="input rounded-md bg-violet-200 p-1"
        >
            <option value="all">Tous les statuts</option>
            <option value="present">Présents</option>
            <option value="absent">Absents</option>
            <option value="late">En retard</option>
        </select>

        <label class="flex items-center gap-2 whitespace-nowrap text-sm">
            De :
            <input 
                type="date" 
                :value="filterDateFrom" 
                @input="updateValue($event, 'update:filterDateFrom')" 
                class="input rounded-md p-1 border border-violet-200" 
            />
        </label>

        <label class="flex items-center gap-2 whitespace-nowrap text-sm">
            À :
            <input 
                type="date" 
                :value="filterDateTo" 
                @input="updateValue($event, 'update:filterDateTo')" 
                class="input rounded-md p-1 border border-violet-200" 
            />
        </label>

        <select 
            :value="selectedUser" 
            @change="updateValue($event, 'update:selectedUser')" 
            class="input rounded-md bg-violet-200 p-1"
        >
            <option value="">Tous les étudiants</option>
            <option v-for="user in usersWithIds" :key="user.id" :value="user.name">
                {{ user.name }}
            </option>
        </select>
    </div>
</template>
