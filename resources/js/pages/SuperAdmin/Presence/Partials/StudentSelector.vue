<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    users: Array<{ id: number; name: string; email: string }>;
    modelValue: number | null;
    error?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const value = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
});
</script>

<template>
    <div class="space-y-4 rounded-lg bg-muted p-4">
        <h3 class="font-medium text-foreground">Informations étudiant</h3>

        <div>
            <label class="mb-1 block text-sm font-medium text-foreground">Étudiant</label>
            <select
                v-model="value"
                name="user_id"
                class="w-full rounded-lg border px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary"
                :class="{ 'border-destructive': error }"
            >
                <option :value="null" disabled>Sélectionnez un étudiant</option>
                <option v-for="user in props.users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                </option>
            </select>
            <p v-if="error" class="mt-1 text-sm text-destructive">
                {{ error }}
            </p>
        </div>
    </div>
</template>
