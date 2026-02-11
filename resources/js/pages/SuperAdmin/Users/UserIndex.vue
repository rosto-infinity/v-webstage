<script setup lang="ts">
import Pagination from '@/components/Pagination.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem, type PaginationLink } from '@/types';
import { Head, Link, router } from '@inertiajs/vue3';
import { Calendar, Clock, Pen, Trash2, UserPlus, Users } from 'lucide-vue-next';
import { ref } from 'vue';

// ✅ Imports shadcn Dialog
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import * as presenceRoutes from '@/routes/presences';
import * as userRoutes from '@/routes/users';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users List : Sup_Admin',
        href: userRoutes.index().url,
    },
];

interface User {
    id: number | string;
    name: string;
    email: string;
    status?: 'active' | 'inactive';
}

const props = defineProps<{
    users: {
        data: User[];
        links: PaginationLink[];
    };
    totalUsers: number;
    totalPresentUsers?: number;
    totalAbsentUsers?: number;
    totalLateUsers?: number;
}>();

// ✅ État du dialog
const deleteDialogOpen = ref(false);
const selectedUserId = ref<number | string | null>(null);
const selectedUserName = ref<string>('');
const isDeleting = ref(false);

// ✅ Helper pour convertir string | number en number
const toNumber = (id: string | number): number => {
    return typeof id === 'string' ? parseInt(id, 10) : id;
};

// ✅ Ouvrir le dialog de suppression
function openDeleteDialog(user: User) {
    selectedUserId.value = user.id;
    selectedUserName.value = user.name;
    deleteDialogOpen.value = true;
}

// ✅ Confirmer la suppression
function confirmDelete() {
    if (!selectedUserId.value) return;

    isDeleting.value = true;
    router.delete(userRoutes.destroy(toNumber(selectedUserId.value)).url, {
        onFinish: () => {
            isDeleting.value = false;
            deleteDialogOpen.value = false;
            selectedUserId.value = null;
            selectedUserName.value = '';
        },
    });
}

// ✅ Annuler la suppression
function cancelDelete() {
    deleteDialogOpen.value = false;
    selectedUserId.value = null;
    selectedUserName.value = '';
    isDeleting.value = false;
}
</script>

<template>
    <Head title="Users list" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <!-- Statistiques -->
            <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-xl border border-border p-5 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="rounded-lg p-3 text-primary">
                            <Users class="h-5 w-5" />
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Total Stagiaires</p>
                            <p class="text-2xl font-bold">{{ totalUsers }}</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border border-border p-5 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="rounded-lg p-3 text-green-600 dark:text-green-400">
                            <Calendar class="h-5 w-5" />
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Présents</p>
                            <p class="text-2xl font-bold">{{ totalPresentUsers ?? 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border border-border p-5 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="rounded-lg p-3 text-red-600 dark:text-red-400">
                            <Users class="h-5 w-5" />
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">Absents</p>
                            <p class="text-2xl font-bold">{{ totalAbsentUsers ?? 0 }}</p>
                        </div>
                    </div>
                </div>

                <div class="rounded-xl border border-border p-5 shadow-sm">
                    <div class="flex items-center gap-3">
                        <div class="rounded-lg p-3 text-orange-600 dark:text-orange-400">
                            <Clock class="h-5 w-5" />
                        </div>
                        <div>
                            <p class="text-sm text-muted-foreground">En Retard</p>
                            <p class="text-2xl font-bold">{{ totalLateUsers ?? 0 }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- En-tête avec bouton ajouter -->
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium">Liste des utilisateurs</h2>
                <span class="flex gap-1 rounded-sm bg-primary px-2 pt-2 text-white">
                    <UserPlus />
                    <Link class="btn btn-primary mb-4" :href="userRoutes.create().url" prefetch> Add Users </Link>
                </span>
                <span class="text-sm text-muted-foreground"> Total: {{ totalUsers }} utilisateur(s) </span>
            </div>

            <!-- Tableau des utilisateurs -->
            <div class="overflow-x-auto rounded-lg border border-border shadow-sm">
                <table class="min-w-full divide-y divide-border">
                    <thead>
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">ID</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">Nom</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">Email</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">Statut</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        <tr v-for="user in props.users.data" :key="user.id" class="transition-colors duration-150 hover:bg-muted/50">
                            <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                {{ user.id }}
                            </td>
                            <td class="px-6 py-4 text-sm whitespace-nowrap">
                                {{ user.name }}
                            </td>
                            <td class="px-6 py-4 text-sm whitespace-nowrap">
                                {{ user.email }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold"
                                    :class="{
                                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': user.status === 'active',
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': user.status === 'inactive',
                                        'bg-muted text-muted-foreground': !user.status,
                                    }"
                                >
                                    {{ user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'N/A' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                <div class="flex gap-2">
                                    <!-- ✅ Bouton Éditer -->
                                    <Link
                                        :href="userRoutes.edit(toNumber(user.id)).url"
                                        class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-primary-foreground transition-colors hover:bg-primary/90"
                                    >
                                        <Pen class="h-4 w-4" />
                                        Éditer
                                    </Link>

                                    <!-- ✅ Bouton Supprimer (ouvre le dialog) -->
                                    <button
                                        @click="openDeleteDialog(user)"
                                        class="inline-flex items-center gap-1 rounded-md bg-destructive px-3 py-1 text-destructive-foreground transition-colors hover:bg-destructive/90"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                        Suppr.
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <Pagination :links="props.users.links" class="mt-4" />

            <!-- Lien retour -->
            <div class="mt-4">
                <Link
                    :href="presenceRoutes.users().url"
                    prefetch
                    class="inline-flex items-center rounded-md bg-muted px-4 py-2 text-foreground hover:bg-muted/80"
                >
                    Retour à la liste des présences
                </Link>
            </div>

            <!-- ✅ DIALOG DE SUPPRESSION -->
            <Dialog v-model:open="deleteDialogOpen">
                <DialogContent class="sm:max-w-md">
                    <DialogHeader class="space-y-3">
                        <DialogTitle class="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 class="h-5 w-5" />
                            Supprimer l'utilisateur
                        </DialogTitle>
                        <DialogDescription class="space-y-2">
                            <p>
                                Êtes-vous sûr de vouloir supprimer <strong>{{ selectedUserName }}</strong> ?
                            </p>
                            <p class="text-sm font-medium text-red-600 dark:text-red-400">
                                ⚠️ Cette action est irréversible. L'utilisateur et toutes ses données seront supprimés définitivement.
                            </p>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter class="gap-2 sm:gap-3">
                        <DialogClose as-child>
                            <Button type="button" variant="secondary" :disabled="isDeleting" @click="cancelDelete"> Annuler </Button>
                        </DialogClose>

                        <Button type="button" variant="destructive" :disabled="isDeleting" @click="confirmDelete" class="gap-2">
                            <span v-if="isDeleting" class="animate-spin">⏳</span>
                            {{ isDeleting ? 'Suppression...' : 'Supprimer définitivement' }}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </AppLayout>
</template>
