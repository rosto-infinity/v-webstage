<script setup lang="ts">
import { Clock } from 'lucide-vue-next';
import { computed, watch } from 'vue';

const props = defineProps<{
    form: any;
    absenceReasons: Array<{ id: number; name: string }>;
}>();

// Fonction pour calculer le retard
function calculateDelay(arrivalTime: string): number {
    if (!arrivalTime) return 0;
    const normalStartTime = '08:00';
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };
    const normalStartMinutes = timeToMinutes(normalStartTime);
    const arrivalMinutes = timeToMinutes(arrivalTime);
    const delayMinutes = arrivalMinutes - normalStartMinutes;
    return delayMinutes > 0 ? delayMinutes : 0;
}

// Fonction pour formater l'affichage du retard
function formatDelay(minutes: number): string {
    if (minutes === 0) return '0 min';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}min` : `${remainingMinutes}min`;
}

const calculatedDelay = computed(() => calculateDelay(props.form.heure_arrivee));

watch(
    () => props.form.heure_arrivee,
    (newArrivalTime) => {
        if (newArrivalTime && !props.form.absent) {
            const delay = calculateDelay(newArrivalTime);
            props.form.minutes_retard = delay;
            props.form.en_retard = delay > 0;
        } else {
            props.form.minutes_retard = null;
            props.form.en_retard = false;
        }
    }
);

watch(
    () => props.form.absent,
    (newVal) => {
        if (newVal) {
            props.form.heure_arrivee = '';
            props.form.heure_depart = '';
            props.form.en_retard = false;
            props.form.minutes_retard = null;
        } else {
            props.form.absence_reason_id = null;
        }
    }
);
</script>

<template>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <!-- Section Horaires -->
        <div class="space-y-4 rounded-lg bg-muted p-4">
            <h3 class="font-medium text-foreground">Horaires</h3>
            
            <div>
                <label class="mb-1 block text-sm font-medium text-foreground">Date</label>
                <input
                    v-model="form.date"
                    name="date"
                    type="date"
                    class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary"
                    :class="{ 'border-destructive': form.errors.date }"
                />
                <p v-if="form.errors.date" class="mt-1 text-sm text-destructive">{{ form.errors.date }}</p>
            </div>

            <div>
                <label class="mb-1 block text-sm font-medium text-foreground">Arrivée</label>
                <input
                    v-model="form.heure_arrivee"
                    name="heure_arrivee"
                    type="time"
                    step="1"
                    :disabled="form.absent"
                    class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary"
                    :class="{ 'border-destructive': form.errors.heure_arrivee, 'bg-muted/50': form.absent }"
                />
                <p v-if="form.errors.heure_arrivee" class="mt-1 text-sm text-destructive">{{ form.errors.heure_arrivee }}</p>
            </div>

            <div>
                <label class="mb-1 block text-sm font-medium text-foreground">Départ</label>
                <input
                    v-model="form.heure_depart"
                    name="heure_depart"
                    type="time"
                    step="1"
                    :disabled="form.absent"
                    :min="form.heure_arrivee"
                    class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary"
                    :class="{ 'border-destructive': form.errors.heure_depart, 'bg-muted/50': form.absent }"
                />
                <p v-if="form.errors.heure_depart" class="mt-1 text-sm text-destructive">{{ form.errors.heure_depart }}</p>
            </div>
        </div>

        <!-- Section Statut -->
        <div class="space-y-4 rounded-lg bg-muted p-4">
            <h3 class="font-medium text-foreground">Statut</h3>
            <div class="space-y-4">
                <label class="flex items-center gap-2 text-sm font-medium text-foreground">
                    <input v-model="form.absent" name="absent" type="checkbox" class="rounded border-primary text-primary focus:ring-primary" />
                    Absent(e)
                </label>

                <div v-if="form.absent">
                    <label class="mb-1 block text-sm font-medium text-foreground">Motif d'absence</label>
                    <select
                        v-model="form.absence_reason_id"
                        name="absence_reason_id"
                        class="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-primary"
                        :class="{ 'border-destructive': form.errors.absence_reason_id }"
                    >
                        <option :value="null" disabled>Sélectionnez un motif</option>
                        <option v-for="reason in props.absenceReasons" :key="reason.id" :value="reason.id">
                            {{ reason.name }}
                        </option>
                    </select>
                    <p v-if="form.errors.absence_reason_id" class="mt-1 text-sm text-destructive">{{ form.errors.absence_reason_id }}</p>
                </div>

                <label class="flex items-center gap-2 text-sm font-medium text-foreground">
                    <input
                        v-model="form.en_retard"
                        name="en_retard"
                        type="checkbox"
                        :disabled="form.absent"
                        class="rounded border-primary text-primary focus:ring-primary"
                        :class="{ 'opacity-50': form.absent }"
                    />
                    En retard
                </label>
            </div>
        </div>

        <!-- Section Détails -->
        <div class="space-y-4 rounded-lg bg-muted p-4">
            <h3 class="font-medium text-foreground">Détails</h3>
            <div v-if="form.en_retard && !form.absent">
                <label class="mb-1 block text-sm font-medium text-foreground">Minutes de retard</label>
                <input
                    v-model.number="form.minutes_retard"
                    name="minutes_retard"
                    type="number"
                    readonly
                    class="w-full cursor-not-allowed rounded-lg border bg-muted/50 px-4 py-2 text-muted-foreground"
                />
            </div>

            <div v-if="form.heure_arrivee && !form.absent" class="mt-4 rounded-lg border border-primary bg-primary/10 p-3">
                <div class="mb-2 flex items-center gap-2">
                    <Clock class="h-4 w-4 text-primary" />
                    <span class="text-sm font-medium text-primary">Calcul du retard</span>
                </div>
                <div class="space-y-1 text-sm text-primary">
                    <div>Normale: <strong>8h00</strong></div>
                    <div>Arrivée: <strong>{{ form.heure_arrivee }}</strong></div>
                    <div>Retard: <strong>{{ formatDelay(calculatedDelay) }}</strong></div>
                </div>
            </div>
        </div>
    </div>
</template>
