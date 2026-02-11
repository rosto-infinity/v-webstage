<script setup lang="ts">
import StageController from '@/actions/App/Http/Controllers/Settings/StageController';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import * as userStages from '@/routes/stages';
// comment
declare module '@inertiajs/vue3' {
    interface PageProps {
        flash?: {
            success?: string;
            error?: string;
        };
    }
}

interface Stage {
    id: number;
    titre: string;
    url_github: string | null;
    images: string[];
    diplome: string;
    diplome_label: string;
    created_at: string;
}

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Mes stages',
        href: '/settings/stages',
    },
];

const { stages, diplomes } = defineProps<{
    stages: Stage[];
    diplomes: Record<string, string>;
}>();

const page = usePage();
const flash = computed(() => page.props.flash);

const editingId = ref<number | null>(null);
const selectedDiplome = ref('BTS');
const editSelectedDiplome = ref('');
const imageFiles = ref<File[]>([]);
const editImageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const editImagePreviews = ref<string[]>([]);

const diplomeOptions = computed(() => Object.entries(diplomes).map(([value, label]) => ({ value, label })));

const handleImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    if (files.length < 3 || files.length > 5) {
        alert('Vous devez sélectionner entre 3 et 5 images');
        target.value = '';
        return;
    }

    imageFiles.value = files;

    // Créer les previews
    imagePreviews.value = [];
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviews.value.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    });
};

const handleEditImageChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    if (files.length > 0 && (files.length < 3 || files.length > 5)) {
        alert('Vous devez sélectionner entre 3 et 5 images');
        target.value = '';
        return;
    }

    editImageFiles.value = files;

    if (files.length > 0) {
        editImagePreviews.value = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                editImagePreviews.value.push(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        });
    }
};

const edit = (stage: Stage) => {
    editingId.value = stage.id;
    editSelectedDiplome.value = stage.diplome;
    editImageFiles.value = [];
    editImagePreviews.value = [];
};

const cancelEdit = () => {
    editingId.value = null;
    editSelectedDiplome.value = '';
    editImageFiles.value = [];
    editImagePreviews.value = [];
};

const destroy = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stage ?')) {
        router.delete(userStages.destroy(id).url, {
            preserveScroll: true,
        });
    }
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Mes stages" />

        <SettingsLayout>
            <div class="flex max-w-4xl flex-col space-y-6">
                <HeadingSmall title="Mes stages" description="Gérez vos rapports de stage et projets académiques" />

                <!-- Messages flash -->
                <Transition
                    enter-active-class="transition ease-in-out duration-300"
                    enter-from-class="opacity-0 transform -translate-y-2"
                    leave-active-class="transition ease-in-out duration-300"
                    leave-to-class="opacity-0"
                >
                    <div v-if="flash?.success" class="rounded-lg border border-green-400 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {{ flash.success }}
                    </div>
                </Transition>

                <!-- Formulaire d'ajout -->
                <Form
                    v-bind="StageController.store.form()"
                    class="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
                    v-slot="{ errors, processing, recentlySuccessful }"
                >
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div class="space-y-2">
                                <Label for="titre">Titre du rapport</Label>
                                <Input id="titre" name="titre" type="text" placeholder="Ex: Développement d'une application web" />
                                <p v-if="errors.titre" class="text-xs text-destructive">
                                    {{ errors.titre }}
                                </p>
                            </div>

                            <div class="space-y-2">
                                <Label for="diplome">Diplôme</Label>
                                <input type="hidden" name="diplome" :value="selectedDiplome" />
                                <Select v-model="selectedDiplome">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un diplôme..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem v-for="option in diplomeOptions" :key="option.value" :value="option.value">
                                            {{ option.label }}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <p v-if="errors.diplome" class="text-xs text-destructive">
                                    {{ errors.diplome }}
                                </p>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <Label for="url_github">Lien GitHub (optionnel)</Label>
                            <Input id="url_github" name="url_github" type="url" placeholder="https://github.com/votre-repo/projet" />
                            <p v-if="errors.url_github" class="text-xs text-destructive">
                                {{ errors.url_github }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <Label for="images">Images du projet (3 à 5 images)</Label>
                            <Input id="images" name="images" type="file" multiple accept="image/*" @change="handleImageChange" />
                            <p class="text-xs text-muted-foreground">Formats acceptés : JPEG, PNG, GIF, WebP (max 2MB par image)</p>
                            <p v-if="errors.images" class="text-xs text-destructive">
                                {{ errors.images }}
                            </p>

                            <!-- Prévisualisations -->
                            <div v-if="imagePreviews.length > 0" class="mt-4 grid grid-cols-3 gap-2">
                                <img
                                    v-for="(preview, index) in imagePreviews"
                                    :key="index"
                                    :src="preview"
                                    class="h-24 w-full rounded-lg border object-cover"
                                    alt="Prévisualisation"
                                />
                            </div>
                        </div>

                        <Button type="submit" :disabled="processing" class="w-full"> Ajouter le stage </Button>

                        <Transition
                            enter-active-class="transition ease-in-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition ease-in-out"
                            leave-to-class="opacity-0"
                        >
                            <p v-if="recentlySuccessful" class="text-sm text-green-600">Stage ajouté avec succès !</p>
                        </Transition>
                    </div>
                </Form>

                <!-- Liste des stages -->
                <div class="space-y-3">
                    <h3 class="text-sm font-medium text-muted-foreground">Vos stages</h3>

                    <div v-for="stage in stages" :key="stage.id" class="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                        <!-- Mode affichage -->
                        <div v-if="editingId !== stage.id">
                            <div class="space-y-4">
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <h4 class="text-lg font-semibold text-foreground">
                                            {{ stage.titre }}
                                        </h4>
                                        <p class="text-sm text-muted-foreground">{{ stage.diplome_label }} • {{ stage.created_at }}</p>
                                        <a
                                            v-if="stage.url_github"
                                            :href="stage.url_github"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="mt-2 inline-block text-sm text-primary hover:underline"
                                        >
                                            Voir sur GitHub →
                                        </a>
                                    </div>
                                    <div class="flex gap-2">
                                        <Button @click="edit(stage)" variant="outline" size="sm"> Modifier </Button>
                                        <Button @click="destroy(stage.id)" variant="destructive" size="sm"> Supprimer </Button>
                                    </div>
                                </div>

                                <!-- Galerie d'images -->
                                <div class="grid grid-cols-3 gap-2 md:grid-cols-5">
                                    <img
                                        v-for="(image, index) in stage.images"
                                        :key="index"
                                        :src="`/storage/${image}`"
                                        class="h-24 w-full rounded-lg border object-cover"
                                        :alt="`Image ${index + 1}`"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Mode édition -->
                        <Form
                            v-else
                            v-bind="StageController.update.form({ id: stage.id })"
                            class="space-y-4"
                            v-slot="{ errors, processing }"
                            @success="cancelEdit"
                        >
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div class="space-y-2">
                                    <Label :for="`titre-${stage.id}`">Titre</Label>
                                    <Input :id="`titre-${stage.id}`" name="titre" type="text" :default-value="stage.titre" />
                                    <p v-if="errors.titre" class="text-xs text-destructive">
                                        {{ errors.titre }}
                                    </p>
                                </div>

                                <div class="space-y-2">
                                    <Label :for="`diplome-${stage.id}`">Diplôme</Label>
                                    <input type="hidden" name="diplome" :value="editSelectedDiplome" />
                                    <Select v-model="editSelectedDiplome">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="option in diplomeOptions" :key="option.value" :value="option.value">
                                                {{ option.label }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p v-if="errors.diplome" class="text-xs text-destructive">
                                        {{ errors.diplome }}
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <Label :for="`url_github-${stage.id}`">Lien GitHub</Label>
                                <Input :id="`url_github-${stage.id}`" name="url_github" type="url" :default-value="stage.url_github" />
                                <p v-if="errors.url_github" class="text-xs text-destructive">
                                    {{ errors.url_github }}
                                </p>
                            </div>

                            <div class="space-y-2">
                                <Label :for="`images-${stage.id}`"> Nouvelles images (optionnel - 3 à 5 images) </Label>
                                <Input
                                    :id="`images-${stage.id}`"
                                    name="images"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    @change="handleEditImageChange"
                                />
                                <p v-if="errors.images" class="text-xs text-destructive">
                                    {{ errors.images }}
                                </p>

                                <!-- Images actuelles -->
                                <div class="grid grid-cols-3 gap-2 md:grid-cols-5">
                                    <img
                                        v-for="(image, index) in stage.images"
                                        :key="index"
                                        :src="`/storage/${image}`"
                                        class="h-16 w-full rounded border object-cover opacity-60"
                                        alt="Image actuelle"
                                    />
                                </div>

                                <!-- Nouvelles prévisualisations -->
                                <div v-if="editImagePreviews.length > 0" class="grid grid-cols-3 gap-2">
                                    <img
                                        v-for="(preview, index) in editImagePreviews"
                                        :key="index"
                                        :src="preview"
                                        class="h-16 w-full rounded-lg border object-cover"
                                        alt="Nouvelle image"
                                    />
                                </div>
                            </div>

                            <div class="flex gap-2">
                                <Button type="submit" :disabled="processing"> Enregistrer </Button>
                                <Button type="button" @click="cancelEdit" variant="outline"> Annuler </Button>
                            </div>
                        </Form>
                    </div>

                    <div v-if="stages.length === 0" class="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        <p>Aucun stage ajouté pour le moment.</p>
                        <p class="mt-1 text-sm">Ajoutez votre premier stage ci-dessus !</p>
                    </div>
                </div>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
