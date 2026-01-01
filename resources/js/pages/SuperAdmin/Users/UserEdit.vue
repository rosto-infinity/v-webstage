<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import { computed } from 'vue';
import { Head, Link, Form } from '@inertiajs/vue3';
import { ArrowLeft, LoaderCircle } from 'lucide-vue-next';

import * as userRoutes from '@/routes/users';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';

// Typage TypeScript strict
interface User {
    id: number | string;
    name: string;
    email: string;
}

const props = defineProps<{
    user: User;
}>();

// ✅ Conversion de l'ID en number pour Wayfinder
const userId = computed(() => {
    return typeof props.user.id === 'string' ? parseInt(props.user.id, 10) : props.user.id;
});

// Configuration des breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilisateurs Admin', href: userRoutes.index().url },
    { title: `Modifier utilisateur : ${props.user.name}`, href: '' },
];
</script>

<template>
    <Head :title="`Modifier ${user.name}`" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-col gap-6 p-6">
            <header class="space-y-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Modifier l'utilisateur</h1>
                <p class="text-sm text-muted-foreground">ID: {{ user.id }} • Dernière modification: {{ new Date().toLocaleDateString() }}</p>
            </header>

            <!-- ✅ Utiliser userId au lieu de props.user.id -->
            <Form
                v-bind="UserController.update.form(userId)"
                class="space-y-6"
                setDefaultsOnSuccess
                disable-while-processing
                #default="{ errors, processing, isDirty, wasSuccessful }"
            >
                <Card class="p-6">
                    <div class="grid gap-4">
                        <!-- Champ Nom -->
                        <div class="space-y-2">
                            <Label for="name">Nom complet</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                :defaultValue="user.name"
                                placeholder="Jean Dupont"
                                :disabled="processing"
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
                                :defaultValue="user.email"
                                placeholder="email@exemple.com"
                                :disabled="processing"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.email }"
                            />
                            <InputError :message="errors.email" />
                        </div>

                        <!-- Section Mot de passe -->
                        <div class="space-y-4 border-t pt-4">
                            <div class="space-y-1">
                                <h3 class="text-lg font-medium">Changer le mot de passe</h3>
                                <p class="text-sm text-muted-foreground">Laissez vide pour conserver le mot de passe actuel</p>
                            </div>

                            <div class="grid gap-4 md:grid-cols-2">
                                <!-- Nouveau mot de passe -->
                                <div class="space-y-2">
                                    <Label for="password">Nouveau mot de passe</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        :disabled="processing"
                                        class="border-gray-300"
                                        :class="{ 'border-red-500': errors.password }"
                                    />
                                    <InputError :message="errors.password" />
                                </div>

                                <!-- Confirmation -->
                                <div class="space-y-2">
                                    <Label for="password_confirmation">Confirmation</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        :disabled="processing"
                                        class="border-gray-300"
                                        :class="{ 'border-red-500': errors.password_confirmation }"
                                    />
                                    <InputError :message="errors.password_confirmation" />
                                </div>
                            </div>
                        </div>

                        <!-- Message de succès -->
                        <transition
                            enter-active-class="transition ease-out duration-200"
                            enter-from-class="opacity-0 translate-y-1"
                            enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition ease-in duration-150"
                            leave-from-class="opacity-100 translate-y-0"
                            leave-to-class="opacity-0 translate-y-1"
                        >
                            <div v-if="wasSuccessful" class="rounded-md bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                ✓ Utilisateur mis à jour avec succès
                            </div>
                        </transition>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-between gap-3 border-t pt-6">
                        <Link
                            :href="userRoutes.index().url"
                            prefetch
                            class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-200"
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
                            <Button
                                type="submit"
                                :disabled="processing"
                                class="gap-2"
                            >
                                <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
                                {{ processing ? 'Enregistrement...' : 'Mettre à jour' }}
                            </Button>
                        </div>
                    </div>
                </Card>
            </Form>
        </div>
    </AppLayout>
</template>
