<script setup lang="ts">
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/vue3';

interface PageProps {
    auth: {
        user?: {
            role: string;
        };
    };
    ziggy?: {
        location: string;
    };
}

const { props } = usePage<PageProps>();
const userRole = props.auth?.user?.role || 'user';

// Configuration de base pour tous les utilisateurs
const baseNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
    },
    {
        title: 'Password',
        href: '/settings/password',
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
    },
    {
        title: 'Media',
        href: '/settings/media',
    },
];

// Items réservés aux admins
const adminNavItems: NavItem[] = [
    {
        title: 'DB Backup',
        href: '/settings/dbbackup',
    },
];

// Items réservés aux superadmins
const superAdminNavItems: NavItem[] = [
    {
        title: 'DB Backup',
        href: '/settings/dbbackup',
    },
];

// Fusion dynamique en fonction du rôle
let sidebarNavItems = [...baseNavItems];

if (userRole === 'admin') {
    sidebarNavItems = [...sidebarNavItems, ...adminNavItems];
} else if (userRole === 'superadmin') {
    sidebarNavItems = [...sidebarNavItems, ...superAdminNavItems];
}

const currentPath = props.ziggy?.location ? new URL(props.ziggy.location).pathname : '';
</script>

<template>
    <div class="px-4 py-6">
        <Heading title="Settings" description="Manage your profile and account settings" />

        <div class="flex flex-col space-y-8 md:space-y-0 lg:flex-row lg:space-y-0 lg:space-x-12">
            <aside class="w-full max-w-xl lg:w-48">
                <nav class="flex flex-col space-y-1 space-x-0">
                    <Button
                        v-for="item in sidebarNavItems"
                        :key="item.href"
                        variant="ghost"
                        :class="['w-full justify-start', { 'bg-muted': currentPath === item.href }]"
                        as-child
                    >
                        <Link :href="item.href">
                            {{ item.title }}
                        </Link>
                    </Button>
                </nav>
            </aside>

            <Separator class="my-6 md:hidden" />

            <div class="flex-1 md:max-w-2xl">
                <section class="max-w-2xl space-y-12">
                    <slot />
                </section>
            </div>
        </div>
    </div>
</template>
