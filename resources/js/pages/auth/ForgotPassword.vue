<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/AuthLayout.vue';
import * as passwordRoutes from '@/routes/password';
import { Form, Head } from '@inertiajs/vue3';
import { LoaderCircle } from 'lucide-vue-next';

defineProps<{
    status?: string;
}>();
</script>

<template>
    <AuthLayout title="Forgot your password?" description="Enter your email address and we will send you a password reset link.">
        <Head title="Forgot Password" />

        <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
            {{ status }}
        </div>

        <Form v-bind="passwordRoutes.email.form()" v-slot="{ errors, processing }">
            <div class="grid gap-2">
                <Label for="email">Email address</Label>
                <Input id="email" name="email" type="email" required autofocus />
                <InputError :message="errors.email" />
            </div>

            <div class="flex items-center justify-end gap-4">
                <TextLink :href="route('login')" class="text-sm underline-offset-4 hover:underline"> Back to login </TextLink>

                <Button type="submit" :disabled="processing">
                    <LoaderCircle v-if="processing" class="h-4 w-4 animate-spin" />
                    Email password reset link
                </Button>
            </div>
        </Form>
    </AuthLayout>
</template>
