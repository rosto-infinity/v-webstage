<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import Button from '@/components/ui/button/Button.vue';

const props = defineProps<{
    action: string;
    method: string;
    initialData: {
        label: string;
        start_date: string;
        end_date: string;
        is_active: boolean;
    };
    errors?: Record<string, string>;
}>();

const emit = defineEmits(['success']);
</script>

<template>
    <Form 
        :action="action" 
        :method="method" 
        class="flex flex-col gap-4"
        @success="emit('success')"
    >
        <div class="grid gap-4 md:grid-cols-2">
            <div>
                <label class="mb-1 block text-sm font-medium">Libellé</label>
                <input type="text" name="label" v-model="initialData.label" class="input w-full" placeholder="Ex: 2024-2025" />
                <span v-if="errors?.label" class="text-sm text-red-500">{{ errors.label }}</span>
            </div>

            <div class="flex items-center gap-2 pt-6">
                <input type="checkbox" name="is_active" v-model="initialData.is_active" :value="1" class="h-4 w-4" />
                <label class="text-sm font-medium">Définir comme année active</label>
                <input type="hidden" name="is_active" value="0" v-if="!initialData.is_active" />
            </div>

            <div>
                <label class="mb-1 block text-sm font-medium">Date de début</label>
                <input type="date" name="start_date" v-model="initialData.start_date" class="input w-full" />
                <span v-if="errors?.start_date" class="text-sm text-red-500">{{ errors.start_date }}</span>
            </div>

            <div>
                <label class="mb-1 block text-sm font-medium">Date de fin</label>
                <input type="date" name="end_date" v-model="initialData.end_date" class="input w-full" />
                <span v-if="errors?.end_date" class="text-sm text-red-500">{{ errors.end_date }}</span>
            </div>
        </div>

        <div class="mt-4 flex gap-2">
            <Button type="submit">Sauvegarder</Button>
            <slot name="actions"></slot>
        </div>
    </Form>
</template>
