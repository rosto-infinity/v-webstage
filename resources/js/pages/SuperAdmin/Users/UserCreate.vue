<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, LoaderCircle } from 'lucide-vue-next';

import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
import * as userRoutes from '@/routes/users';

const props = defineProps<{
    typeStages: Array<{ label: string, value: string }>;
    yearTrainings: Array<{ id: number, label: string }>;
    diplomes: Array<{ label: string, value: string }>;
}>();

// Configuration des breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilisateurs Sup_Admin', href: userRoutes.index().url },
    { title: 'Nouvel utilisateur', href: '' },
];
</script>

<template>
    <Head title="Création utilisateur" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 p-6">
            <header class="space-y-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Créer un nouvel utilisateur</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Remplissez les informations du stagiaire</p>
            </header>

            <Form
                v-bind="UserController.store.form()"
                class="space-y-6"
                resetOnSuccess
                setDefaultsOnSuccess
                disable-while-processing
                #default="{ errors, processing, isDirty }"
            >
                <Card class="p-6">
                    <div class="grid gap-6 md:grid-cols-2">
                        <!-- Champ Nom -->
                        <div class="space-y-2">
                            <Label for="name">Nom complet</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                autofocus
                                placeholder="Jean Dupont"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.name }"
                            />
                            <InputError :message="errors.name" />
                        </div>

                        <!-- Champ Email -->
                        <div class="space-y-2">
                            <Label for="email">Adresse email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.email }"
                            />
                            <InputError :message="errors.email" />
                        </div>

                        <!-- Type de Stage -->
                        <div class="space-y-2">
                            <Label for="type_stage">Type de Stage</Label>
                            <select 
                                id="type_stage" 
                                name="type_stage" 
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                :class="{ 'border-red-500': errors.type_stage }"
                            >
                                <option value="">Sélectionnez un type</option>
                                <option v-for="type in typeStages" :key="type.value" :value="type.value">
                                    {{ type.label }}
                                </option>
                            </select>
                            <InputError :message="errors.type_stage" />
                        </div>

                        <!-- Diplôme -->
                        <div class="space-y-2">
                            <Label for="diplome">Diplôme visé</Label>
                            <select 
                                id="diplome" 
                                name="diplome" 
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                :class="{ 'border-red-500': errors.diplome }"
                            >
                                <option value="">Sélectionnez un diplôme</option>
                                <option v-for="diplome in (props as any).diplomes" :key="diplome.value" :value="diplome.value">
                                    {{ diplome.label }}
                                </option>
                            </select>
                            <InputError :message="errors.diplome" />
                        </div>

                        <!-- Année de Formation -->
                        <div class="space-y-2">
                            <Label for="year_training_id">Année de Formation</Label>
                            <select 
                                id="year_training_id" 
                                name="year_training_id" 
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                :class="{ 'border-red-500': errors.year_training_id }"
                            >
                                <option value="">Sélectionnez une année</option>
                                <option v-for="year in yearTrainings" :key="year.id" :value="year.id">
                                    {{ year.label }}
                                </option>
                            </select>
                            <InputError :message="errors.year_training_id" />
                        </div>

                        <!-- Champ Password -->
                        <div class="space-y-2">
                            <Label for="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.password }"
                            />
                            <InputError :message="errors.password" />
                        </div>

                        <!-- Champ Password Confirmation -->
                        <div class="space-y-2">
                            <Label for="password_confirmation">Confirmer le mot de passe</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                placeholder="••••••••"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.password_confirmation }"
                            />
                            <InputError :message="errors.password_confirmation" />
                        </div>
                    </div>

                    <!-- Boutons d'action -->
                    <div class="mt-8 flex items-center justify-between border-t pt-6">
                        <Link
                            :href="userRoutes.index().url"
                            class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200"
                        >
                            <ArrowLeft class="h-4 w-4" />
                            Retour à la liste
                        </Link>

                        <div class="flex gap-3">
                            <button
                                type="reset"
                                class="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 disabled:opacity-50"
                                :disabled="processing || !isDirty"
                            >
                                Réinitialiser
                            </button>
                            <Button type="submit" :disabled="processing" class="gap-2">
                                <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
                                {{ processing ? 'Création...' : 'Créer l\'utilisateur' }}
                            </Button>
                        </div>
                    </div>
                </Card>
            </Form>
        </div>
    </AppLayout>
</template>
