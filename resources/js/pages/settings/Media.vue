<script setup lang="ts">
import { type BreadcrumbItem } from '@/types';

import SocialMediaController from '@/actions/App/Http/Controllers/Settings/SocialMediaController';

import { Form, Head, router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
// Import des routes Wayfinder
import * as userMedia from '@/routes/media';

declare module '@inertiajs/vue3' {
    interface PageProps {
        flash?: {
            success?: string;
            error?: string;
            warning?: string;
            info?: string;
        };
    }
}

interface SocialMedia {
    id: number;
    platform: string;
    url: string;
    display_name: string | null;
}

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Paramètres média',
        href: userMedia.store().url,
    },
];

const { socialMedias } = defineProps<{
    socialMedias: SocialMedia[];
}>();

const page = usePage();
const flash = computed(() => page.props.flash);

const editingId = ref<number | null>(null);
const selectedPlatform = ref('github');
const editSelectedPlatform = ref('');

const platforms = [
    { value: 'github', label: 'GitHub' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'other', label: 'Autre' },
];

const edit = (media: SocialMedia) => {
    editingId.value = media.id;
    editSelectedPlatform.value = media.platform;
};

const cancelEdit = () => {
    editingId.value = null;
    editSelectedPlatform.value = '';
};

const destroy = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
        router.delete(userMedia.destroy(id).url, {
            preserveScroll: true,
        });
    }
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Paramètres média" />

        <SettingsLayout>
            <div class="flex max-w-4xl flex-col space-y-6">
                <HeadingSmall 
                    title="Liens des réseaux sociaux" 
                    description="Gérez vos profils et liens de réseaux sociaux" 
                />

                <!-- Messages flash -->
                <Transition
                    enter-active-class="transition ease-in-out duration-300"
                    enter-from-class="opacity-0 transform -translate-y-2"
                    leave-active-class="transition ease-in-out duration-300"
                    leave-to-class="opacity-0"
                >
                    <div 
                        v-if="flash?.success" 
                        class="rounded-lg border border-green-400 bg-green-50 px-4 py-3 text-sm text-green-700"
                    >
                        {{ flash.success }}
                    </div>
                </Transition>

                <!-- Formulaire d'ajout avec Form Component -->
                <Form
                    v-bind="SocialMediaController.store.form()"
                    class="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
                    v-slot="{ errors, processing, recentlySuccessful }"
                >
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div class="space-y-2">
                            <Label for="platform">Plateforme</Label>
                            <input type="hidden" name="platform" :value="selectedPlatform" />
                            <Select v-model="selectedPlatform">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem 
                                        v-for="platform in platforms" 
                                        :key="platform.value"
                                        :value="platform.value"
                                    >
                                        {{ platform.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p v-if="errors.platform" class="text-xs text-destructive">
                                {{ errors.platform }}
                            </p>
                        </div>

                        <div class="space-y-2 md:col-span-2">
                            <Label for="url">URL</Label>
                            <Input
                                id="url"
                                name="url"
                                type="url"
                                :placeholder="`URL ${selectedPlatform} (ex: https://${selectedPlatform}.com/votreprofil)`"
                            />
                            <p v-if="errors.url" class="text-xs text-destructive">
                                {{ errors.url }}
                            </p>
                        </div>

                        <div class="flex items-end space-y-2">
                            <Button 
                                type="submit" 
                                :disabled="processing"
                                class="w-full"
                            >
                                Ajouter
                            </Button>
                        </div>
                    </div>

                    <Transition
                        enter-active-class="transition ease-in-out"
                        enter-from-class="opacity-0"
                        leave-active-class="transition ease-in-out"
                        leave-to-class="opacity-0"
                    >
                        <p v-if="recentlySuccessful" class="text-sm text-green-600">
                            Média social ajouté avec succès !
                        </p>
                    </Transition>
                </Form>

                <!-- Liste des médias -->
                <div class="space-y-3">
                    <h3 class="text-sm font-medium text-muted-foreground">Vos liens sociaux</h3>
                    
                    <div 
                        v-for="media in socialMedias" 
                        :key="media.id" 
                        class="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <!-- Mode affichage -->
                        <div v-if="editingId !== media.id">
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium capitalize text-foreground">
                                            {{ media.platform }}
                                        </span>
                                        <span v-if="media.display_name" class="text-sm text-muted-foreground">
                                            - {{ media.display_name }}
                                        </span>
                                    </div>
                                    <a 
                                        :href="media.url" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        class="mt-1 block truncate text-sm text-primary hover:underline"
                                    >
                                        {{ media.url }}
                                    </a>
                                </div>
                                <div class="flex gap-2">
                                    <Button 
                                        @click="edit(media)" 
                                        variant="outline"
                                        size="sm"
                                    >
                                        Modifier
                                    </Button>
                                    <Button 
                                        @click="destroy(media.id)" 
                                        variant="destructive"
                                        size="sm"
                                    >
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <!-- Mode édition avec Form Component -->
                        <Form
                            v-else
                            v-bind="SocialMediaController.update.form({ id: media.id })"
                            class="space-y-4"
                            v-slot="{ errors, processing }"
                            @success="cancelEdit"
                        >
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div class="space-y-2">
                                    <Label :for="`platform-${media.id}`">Plateforme</Label>
                                    <input type="hidden" name="platform" :value="editSelectedPlatform" />
                                    <Select v-model="editSelectedPlatform">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem 
                                                v-for="platform in platforms" 
                                                :key="platform.value"
                                                :value="platform.value"
                                            >
                                                {{ platform.label }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p v-if="errors.platform" class="text-xs text-destructive">
                                        {{ errors.platform }}
                                    </p>
                                </div>

                                <div class="space-y-2 md:col-span-2">
                                    <Label :for="`url-${media.id}`">URL</Label>
                                    <Input
                                        :id="`url-${media.id}`"
                                        name="url"
                                        type="url"
                                        :default-value="media.url"
                                        :placeholder="`URL ${editSelectedPlatform}`"
                                    />
                                    <p v-if="errors.url" class="text-xs text-destructive">
                                        {{ errors.url }}
                                    </p>
                                </div>

                                <div class="flex items-end gap-2">
                                    <Button 
                                        type="submit" 
                                        :disabled="processing"
                                        size="sm"
                                    >
                                        Enregistrer
                                    </Button>
                                    <Button 
                                        type="button"
                                        @click="cancelEdit"
                                        variant="outline"
                                        size="sm"
                                    >
                                        Annuler
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>

                    <div 
                        v-if="socialMedias.length === 0" 
                        class="rounded-lg border border-dashed p-8 text-center text-muted-foreground"
                    >
                        <p>Aucun lien social ajouté pour le moment.</p>
                        <p class="mt-1 text-sm">Ajoutez votre premier lien ci-dessus !</p>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>