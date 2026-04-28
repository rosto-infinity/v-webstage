<script setup lang="ts">
import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { edit } from '@/routes/password';
import { Form, Head } from '@inertiajs/vue3';
import { ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Eye, EyeOff } from 'lucide-vue-next';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

const passwordInput = ref<HTMLInputElement | null>(null);
const currentPasswordInput = ref<HTMLInputElement | null>(null);

const showPassword = ref(false);
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head title="Paramètres de mot de passe" />

        <SettingsLayout>
            <div class="space-y-6">
                <HeadingSmall
                    title="Mettre à jour le mot de passe"
                    description="Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé"
                />

                <Form
                    v-bind="PasswordController.update.form()"
                    :options="{
                        preserveScroll: true,
                    }"
                    reset-on-success
                    :reset-on-error="['password', 'password_confirmation', 'current_password']"
                    class="max-w-xl space-y-6 rounded-md border bg-card p-4 py-6"
                    v-slot="{ errors, processing, recentlySuccessful }"
                >
                    <div class="relative grid gap-2">
                        <Label for="current_password">Mot de passe actuel</Label>
                        <Input
                            id="current_password"
                            ref="currentPasswordInput"
                            name="current_password"
                            :type="showPassword ? 'text' : 'password'"
                            class="mt-1 block w-full"
                            autocomplete="current-password"
                            placeholder="Mot de passe actuel"
                        />
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute top-8 right-3 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                            <EyeOff v-if="showPassword" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                        <InputError :message="errors.current_password" />
                    </div>

                    <div class="relative grid gap-2">
                        <Label for="password">Nouveau mot de passe</Label>
                        <Input
                            id="password"
                            ref="passwordInput"
                            name="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="mt-1 block w-full"
                            autocomplete="new-password"
                            placeholder="Nouveau mot de passe"
                        />
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute top-8 right-3 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                            <EyeOff v-if="showPassword" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                        <InputError :message="errors.password" />
                    </div>

                    <div class="relative grid gap-2">
                        <Label for="password_confirmation">Confirmez le mot de passe</Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            :type="showPassword ? 'text' : 'password'"
                            class="mt-1 block w-full"
                            autocomplete="new-password"
                            placeholder="Confirmez le mot de passe"
                        />
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute top-8 right-3 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                            <EyeOff v-if="showPassword" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                        <InputError :message="errors.password_confirmation" />
                    </div>

                    <div class="flex items-center gap-4">
                        <Button :disabled="processing" data-test="update-password-button">Enregistrer le mode passe</Button>

                        <Transition
                            enter-active-class="transition ease-in-out"
                            enter-from-class="opacity-0"
                            leave-active-class="transition ease-in-out"
                            leave-to-class="opacity-0"
                        >
                            <p v-show="recentlySuccessful" class="text-sm text-neutral-600">Saved.</p>
                        </Transition>
                    </div>
                </Form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
