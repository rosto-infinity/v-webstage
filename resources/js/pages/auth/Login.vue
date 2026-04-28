<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';

import { stage as configCgu } from '@/routes/conditions';
import { request as passwordRequest } from '@/routes/password';
import { Form, Head } from '@inertiajs/vue3';
import { Eye, EyeOff, Github, LoaderCircle, LogIn } from 'lucide-vue-next';
import { ref } from 'vue';
// Import Wayfinder route pour login
import { store } from '@/routes';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const showPassword = ref(false);

const loginWithGithub = () => {
    window.location.href = '/auth/github/redirect';
};
</script>

<template>
    <AuthBase title="Connectez-vous :">
        <Head title="Connectez-vous à votre compte" />

        <!-- Message de statut -->
        <div v-if="status" class="mb-4 text-center text-sm font-bold text-accent">
            {{ status }}
        </div>
        <Form v-bind="store.form()" :reset-on-error="['password']" v-slot="{ errors, processing }">
            <!-- Boutons externes -->
            <div class="flex items-center justify-center gap-3">
                <!-- GitHub -->
                <Button
                    type="button"
                    variant="outline"
                    class="flex w-55 cursor-pointer items-center justify-center gap-3 border-primary bg-primary/20 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    @click="loginWithGithub"
                >
                    <Github class="h-4 w-4" />
                    <span>Avec GitHub</span>
                </Button>
            </div>
            <!-- Séparateur -->
            <div class="my-2 flex items-center">
                <div class="flex-1 border-t-2 border-slate-200 dark:border-slate-700"></div>
                <span class="px-4 text-sm text-slate-500 dark:text-slate-400">OU CONNECTEZ-VOUS AVEC ADRESSE E-MAIL</span>
                <div class="flex-1 border-t-2 border-slate-200 dark:border-slate-700"></div>
            </div>

            <!-- Formulaire principal -->
            <div class="grid gap-4">
                <!-- Email -->
                <div class="grid gap-2">
                    <Label for="email">Adresse e-mail</Label>
                    <Input id="email" name="email" type="email" autofocus :tabindex="1" autocomplete="email" placeholder="Adresse e-mail" />
                    <InputError :message="errors.email" />
                </div>

                <!-- Mot de passe -->
                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Mot de passe</Label>
                        <TextLink v-if="canResetPassword" :href="passwordRequest().url" class="text-sm font-black text-accent" :tabindex="5">
                            Mot de passe oublié ?
                        </TextLink>
                    </div>
                    <div class="relative">
                        <Input
                            id="password"
                            name="password"
                            :type="showPassword ? 'text' : 'password'"
                            :tabindex="2"
                            placeholder="Mot de passe"
                            autocomplete="current-password"
                            class="pr-10"
                        />
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                            <EyeOff v-if="showPassword" class="h-4 w-4" />
                            <Eye v-else class="h-4 w-4" />
                        </button>
                    </div>
                    <InputError :message="errors.password" />
                </div>

                <!-- Se souvenir de moi -->
                <div class="flex items-center justify-between">
                    <Label for="remember" class="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" :tabindex="3" />
                        <span>Se souvenir de moi</span>
                    </Label>
                </div>

                <!-- Bouton de soumission -->
                <Button type="submit" class="mt-2 w-full" :disabled="processing">
                    <LoaderCircle v-if="processing" class="mr-2 h-4 w-4 animate-spin" />
                    <LogIn v-else class="mr-2 h-4 w-4" />
                    Se connecter
                </Button>
            </div>

            <!-- Lien vers Conditions générales d'utilisation -->
            <div class="-mt-2 text-center text-sm text-muted-foreground">
                En vous connectant, vous acceptez nos
                <TextLink :href="configCgu().url" class="font-black text-accent">Conditions générales d'utilisation </TextLink>
            </div>
        </Form>
    </AuthBase>
</template>
