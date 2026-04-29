<script setup lang="ts">
import { Users, Calendar, Clock } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
    presenceCount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    presences: any[];
}>();

const absentsSansMotif = computed(() => {
    return props.presences.filter((p) => p.absent && !p.absence_reason).length;
});

const moyenneRetard = computed(() => {
    if (props.lateCount === 0) return 0;
    const totalMinutes = props.presences.reduce((acc, p) => acc + (p.late_minutes || 0), 0);
    return Math.round(totalMinutes / props.lateCount);
});
</script>

<template>
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
                <p class="text-success text-xs" v-if="presenceCount > 0">
                    ({{ Math.round((presentCount / presenceCount) * 100) }}%)
                </p>
            </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
            <Users class="h-6 w-6 text-destructive" />
            <div>
                <p class="text-sm text-muted-foreground">Absents</p>
                <p class="text-2xl font-bold">{{ absentCount }}</p>
                <p v-if="absentCount > 0" class="text-xs text-destructive">
                    {{ absentsSansMotif }} sans motif
                </p>
            </div>
        </div>
        <div class="flex items-center gap-3 rounded-xl border bg-card p-5">
            <Clock class="text-warning h-6 w-6" />
            <div>
                <p class="text-sm text-muted-foreground">Retards</p>
                <p class="text-2xl font-bold">{{ lateCount }}</p>
                <p v-if="lateCount > 0" class="text-warning text-xs">
                    Moyenne: {{ moyenneRetard }}min
                </p>
            </div>
        </div>
    </div>
</template>
