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

// Configuration des breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilisateurs Sup_Admin', href: userRoutes.index().url },
    { title: 'Nouvel utilisateur : Sup_Admin', href: '' },
];
</script>

<template>
    <Head title="Création utilisateur" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 rounded-xl bg-white p-6 dark:bg-gray-800">
            <header class="space-y-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Créer un nouvel utilisateur</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Remplissez les champs obligatoires pour ajouter un utilisateur</p>
            </header>

            <!-- Composant Form d'Inertia avec Wayfinder -->
            <Form
                v-bind="UserController.store.form()"
                class="max-w-2xl space-y-6"
                resetOnSuccess
                setDefaultsOnSuccess
                disable-while-processing
                #default="{ errors, processing, isDirty }"
            >
                <Card class="rounded-xl">
                    <div class="grid gap-6 rounded-md px-4 shadow-emerald-950">
                        <!-- Boutons d'action -->
                        <div class="flex items-center justify-between gap-3 pt-1">
                            <span>
                                <Link
                                    :href="userRoutes.index().url"
                                    prefetch
                                    class="mb-6 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-200"
                                >
                                    <ArrowLeft class="h-4 w-4" />
                                    Retour à la liste
                                </Link>
                            </span>

                            <button
                                type="button"
                                @click="$el.closest('form').reset()"
                                class="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm hover:bg-secondary/80 disabled:opacity-50"
                                :disabled="processing || !isDirty"
                            >
                                Réinitialiser
                            </button>
                        </div>

                        <!-- Champ Name -->
                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                autofocus
                                :tabindex="1"
                                autocomplete="name"
                                placeholder="Full name"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.name }"
                            />
                            <InputError :message="errors.name" />
                        </div>

                        <!-- Champ Email -->
                        <div class="grid gap-2">
                            <Label for="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                :tabindex="2"
                                autocomplete="email"
                                placeholder="email@example.com"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.email }"
                            />
                            <InputError :message="errors.email" />
                        </div>

                        <!-- Champ Password -->
                        <div class="grid gap-2">
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                :tabindex="3"
                                autocomplete="new-password"
                                placeholder="Password"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.password }"
                            />
                            <InputError :message="errors.password" />
                        </div>

                        <!-- Champ Password Confirmation -->
                        <div class="grid gap-2">
                            <Label for="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                :tabindex="4"
                                autocomplete="new-password"
                                placeholder="Confirm password"
                                class="border-gray-300"
                                :class="{ 'border-red-500': errors.password_confirmation }"
                            />
                            <InputError :message="errors.password_confirmation" />
                        </div>

                        <!-- Bouton Submit -->
                        <Button type="submit" :tabindex="5" :disabled="processing" class="w-full">
                            <LoaderCircle v-if="processing" class="mr-2 h-4 w-4 animate-spin" />
                            {{ processing ? 'Création en cours...' : 'Create account' }}
                        </Button>
                    </div>
                </Card>
            </Form>
        </div>
    </AppLayout>
</template>
