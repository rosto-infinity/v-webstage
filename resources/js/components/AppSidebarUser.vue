<script setup lang="ts">
import NavFooter from '@/components/NavFooter.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/vue3';
import { Folder, Home, LayoutGrid } from 'lucide-vue-next';
import AppLogo from './AppLogo.vue';
import * as routes from '@/routes';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: routes.home().url,
        icon: Home, // Icône appropriée pour un tableau de bord
    },
    {
        title: 'Dashboard',
        href: routes.dashboard().url,
        icon: LayoutGrid, // Icône appropriée pour un tableau de bord
    },
    {
        title: 'Mes Présences',
        href: routes.list().url,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Github Repo',
        href: 'https://github.com/rosto-infinity/v-webstage',
        icon: Folder,
    },
];
</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <Link :href="routes.dashboard().url" prefetch>
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>