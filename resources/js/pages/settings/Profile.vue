<script setup lang="ts">
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
}

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Paramètres du profil',
        href: edit().url,
    },
];

const page = usePage();
const user = page.props.auth.user;

const avatarPreview = ref<string | null>(null);

function handleAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            avatarPreview.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Paramètres du profil" />

        <SettingsLayout>
            <div class="flex max-w-2xl flex-col space-y-6">
                <HeadingSmall
                    title="Informations sur la connexion"
                    description="Actualisez vos informations de profil"
                />

                <!-- Preview avatar -->
                <div class="mb-6 flex flex-col items-center">
                    <div
                        class="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary bg-card shadow-lg transition-all duration-300"
                    >
                        <template v-if="avatarPreview">
                            <img
                                :src="avatarPreview"
                                alt="Preview avatar"
                                class="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </template>
                        <template v-else-if="user.avatar">
                            <img
                                :src="`/${user.avatar}`"
                                alt="Current avatar"
                                class="h-full w-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </template>
                        <template v-else>
                            <div class="flex h-full w-full items-center justify-center rounded-full bg-card text-5xl font-bold text-primary">
                                {{ user.name.charAt(0).toUpperCase() }}
                            </div>
                        </template>
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        >
                            <span class="text-xs font-semibold text-white">Changer l'avatar</span>
                        </div>
                    </div>
                    <p v-if="avatarPreview" class="mt-2 text-sm text-muted-foreground">
                        Prévisualisation du nouvel avatar
                    </p>
                </div>

                <!-- Formulaire avec le composant Form d'Inertia.js -->
                <Form
                    v-bind="ProfileController.update.form()"
                    class="space-y-6 rounded-md border bg-card p-4 py-6"
                    v-slot="{ errors, processing, recentlySuccessful }"
                    @success="avatarPreview = null"
                >
                    <!-- Nom -->
                    <div class="grid gap-2">
                        <Label for="name">Nom et prénom</Label>
                        <Input
                            id="name"
                            name="name"
                            :default-value="user.name"
                            required
                            autocomplete="name"
                            placeholder="Nom complet"
                        />
                        <InputError :message="errors.name" />
                    </div>

                    <!-- Email -->
                    <div class="grid gap-2">
                        <Label for="email">Adresse email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            :default-value="user.email"
                            required
                            autocomplete="username"
                            placeholder="Adresse email"
                        />
                        <InputError :message="errors.email" />
                    </div>

                    <!-- Alerte de vérification d'email -->
                    <div v-if="mustVerifyEmail && user.email_verified_at === null" class="rounded-md bg-yellow-50 border border-yellow-200 p-4">
                        <p class="text-sm text-yellow-800">
                            Votre adresse email n'est pas vérifiée.
                            <Link
                                :href="send().url"
                                method="post"
                                as="button"
                                class="rounded-md text-sm text-yellow-900 underline hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                            >
                                Cliquez ici pour renvoyer l'email de vérification.
                            </Link>
                        </p>

                        <div v-show="status === 'verification-link-sent'" class="mt-2 text-sm font-medium text-green-600">
                            Un nouveau lien de vérification a été envoyé à votre adresse email.
                        </div>
                    </div>

                    <!-- Avatar upload -->
                    <div class="grid gap-3">
                        <Label for="avatar" class="text-sm font-medium text-muted-foreground">
                            Avatar
                        </Label>
                        <Input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/*"
                            @change="handleAvatarChange"
                            class="w-full cursor-pointer border-2 border-dashed border-muted-foreground/30 transition-all duration-300 file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:text-sm file:font-medium hover:file:bg-primary/20 focus:border-primary"
                        />
                        <InputError :message="errors.avatar" class="mt-1 pl-1 text-xs text-destructive" />
                    </div>

                    <!-- Submit -->
                    <div class="flex items-center gap-4">
                        <Button :disabled="processing">Sauvegarder</Button>
                        <Transition
                            enter-active-class="transition ease-in-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition ease-in-out"
                            leave-to-class="opacity-0"
                        >
                            <p v-if="recentlySuccessful" class="text-sm text-green-600">Enregistré !</p>
                        </Transition>
                    </div>
                </Form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>