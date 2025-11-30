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
import { Head, useForm } from '@inertiajs/vue3';
import { Eye, EyeOff, Github, LoaderCircle, LogIn } from 'lucide-vue-next';
import { ref } from 'vue';
// Import Wayfinder routes/actions générées
import { store } from '@/routes';

defineProps<{
    status?: string;
    canResetPassword: boolean;
}>();

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const showPassword = ref(false);

const submit = () => {
    form.post(store().url, {
        onFinish: () => form.reset('password'),
    });
};

// ✅ Redirection vers les routes existantes
// const loginWithGoogle = () => {
//     window.location.href = '/auth/google/redirect';
// };

const loginWithGithub = () => {
    window.location.href = '/auth/github/redirect';
};
// const loginWithLinkedin = () => {
//     window.location.href = '/auth/linkedin/redirect';
// };
</script>

<template>
    <AuthBase title="Connectez-vous :">
        <Head title="Connectez-vous à votre compte" />

        <!-- Message de statut -->
        <div v-if="status" class="mb-4 text-center text-sm font-bold text-accent">
            {{ status }}
        </div>

        <form method="POST" @submit.prevent="submit" class="flex flex-col gap-6">
            <!-- Boutons externes -->
            <div class="flex items-center justify-center gap-3">
                <!-- Google -->
                <!-- <Button
                    type="button"
                    variant="outline"
                    class="flex w-35 items-center justify-center gap-3 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    @click="loginWithGoogle"
                >
                    <svg class="h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Avec Google</span>
                </Button> -->

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
                <!-- Linkedin-->
                <!-- <Button
                    type="button"
                    variant="outline"
                    class="flex w-27 items-center justify-center gap-3 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    @click="loginWithLinkedin"
                >
                    <Linkedin class="h-4 w-4" />
                    <span>Linkedin</span>
                </Button> -->
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
                    <Input id="email" type="email" autofocus :tabindex="1" autocomplete="email" v-model="form.email" placeholder="Adresse e-mail" />
                    <InputError :message="form.errors.email" />
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
                            v-model="form.password"
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
                    <InputError :message="form.errors.password" />
                </div>

                <!-- Se souvenir de moi -->
                <div class="flex items-center justify-between">
                    <Label for="remember" class="flex items-center space-x-3">
                        <Checkbox id="remember" v-model="form.remember" :tabindex="3" />
                        <span>Se souvenir de moi</span>
                    </Label>
                </div>

                <!-- Bouton de soumission -->
                <Button type="submit" class="mt-2 w-full" :disabled="form.processing">
                    <LoaderCircle v-if="form.processing" class="mr-2 h-4 w-4 animate-spin" />
                    <LogIn v-else class="mr-2 h-4 w-4" />
                    Se connecter
                </Button>
            </div>
           
            <!-- Lien vers Conditions générales d'utilisation -->
            <div class="-mt-2 text-center text-sm text-muted-foreground">
                En vous connectant, vous acceptez nos
                <TextLink :href="configCgu().url" class="font-black text-accent">Conditions générales d'utilisation </TextLink>
            </div>
        </form>
    </AuthBase>
</template>
