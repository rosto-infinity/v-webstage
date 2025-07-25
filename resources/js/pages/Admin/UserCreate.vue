<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/vue3';
import { LoaderCircle } from 'lucide-vue-next';
// Configuration des breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilisateurs Sup_Admin', href: '/users' },
    { title: 'Nouvel utilisateur : Sup_Admin', href: '' },
];

// Typage du formulaire avec intersection de types
type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

// Initialisation du formulaire avec typage explicite
const form = useForm<UserFormData>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

// Soumission du formulaire avec gestion améliorée des erreurs
const submit = () => {
    form.post(route('users.store'), {
        preserveScroll: true,
        onSuccess: () => {
            form.reset();
            // Ajouter une notification de succès si nécessaire
        },
        onError: (errors) => {
            console.error('Erreur lors de la création:', errors);
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
            }
        },
    });
};
</script>

<template>
    <Head title="Création utilisateur" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 rounded-xl bg-white p-6 dark:bg-gray-800">
            <header class="space-y-1">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Créer un nouvel utilisateur</h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">Remplissez les champs obligatoires pour ajouter un utilisateur</p>
            </header>

            <form @submit.prevent="submit" class="max-w-2xl space-y-6">
                <Card class="rounded-xl">
                    <!-- Boutons d'action -->
                    <div class="grid gap-6 rounded-md p-5 shadow-emerald-950">
                        <div class="flex items-center justify-end gap-3 pt-4">
                            <button type="button" @click="form.reset()" class="btn btn-secondary" :disabled="form.processing">Réinitialiser</button>
                        </div>

                        <div class="grid gap-2">
                            <Label for="name">Name</Label>
                            <Input id="name" type="text" autofocus :tabindex="1" autocomplete="name" v-model="form.name" placeholder="Full name" />
                            <InputError :message="form.errors.name" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="email">Email address</Label>
                            <Input id="email" type="email" :tabindex="2" autocomplete="email" v-model="form.email" placeholder="email@example.com" />
                            <InputError :message="form.errors.email" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                :tabindex="3"
                                autocomplete="new-password"
                                v-model="form.password"
                                placeholder="Password"
                            />
                            <InputError :message="form.errors.password" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                :tabindex="4"
                                autocomplete="new-password"
                                v-model="form.password_confirmation"
                                placeholder="Confirm password"
                            />
                            <InputError :message="form.errors.password_confirmation" />
                        </div>

                        <Button type="submit" class="mt-2 w-full bg-green-500 hover:bg-green-700" tabindex="5" :disabled="form.processing">
                            <LoaderCircle v-if="form.processing" class="h-4 w-4 animate-spin" />
                            Create account
                        </Button>
                    </div>
                </Card>
            </form>
        </div>
    </AppLayout>
</template>
