<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Pen, Download, FileText, CalendarRange, Archive } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';

const props = defineProps<{
    addRoute: string;
    pdfAllRoute: string;
    zipAllRoute: string;
    excelRoute: string;
    selectedUserForExport: any | null;
    filterDateFrom: string | null;
    filterDateTo: string | null;
}>();

const emit = defineEmits(['export-user-pdf', 'export-user-pdf-period']);
</script>

<template>
    <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
            <h1 class="text-3xl font-bold">Tableau de présence</h1>
            <p class="text-muted-foreground">BTS 2 Génie Logiciel / DQP</p>
        </div>
        <div class="flex flex-wrap gap-2">
            <Button>
                <Link :href="addRoute" class="flex gap-1">
                    <Pen class="h-5 w-5" />
                    Ajouter
                </Link>
            </Button>

            <!-- Export PDF Global -->
            <a :href="pdfAllRoute">
                <Button class="cursor-pointer">
                    <Download class="h-5 w-5" />
                    PDF Tous
                </Button>
            </a>

            <!-- Export PDF par Utilisateur -->
            <Button 
                @click="emit('export-user-pdf')" 
                :disabled="!selectedUserForExport" 
                class="cursor-pointer"
                variant="secondary"
            >
                <FileText class="h-5 w-5" />
                PDF Utilisateur
            </Button>

            <!-- Export PDF avec Période -->
            <Button 
                @click="emit('export-user-pdf-period')"
                :disabled="!selectedUserForExport || !filterDateFrom || !filterDateTo" 
                class="cursor-pointer"
                variant="outline"
            >
                <CalendarRange class="h-5 w-5" />
                PDF Période
            </Button>

            <!-- Export ZIP tous les utilisateurs -->
            <a :href="zipAllRoute">
                <Button class="cursor-pointer" variant="outline">
                    <Archive class="h-5 w-5" />
                    ZIP Tous
                </Button>
            </a>

            <!-- Export Excel -->
            <a :href="excelRoute">
                <Button class="cursor-pointer">
                    <Download class="h-5 w-5" />
                    Excel
                </Button>
            </a>
        </div>
    </div>
</template>
