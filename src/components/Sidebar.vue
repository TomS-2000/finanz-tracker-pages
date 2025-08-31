<template>
    <div>

        <!-- statische Menüleiste -->
        <Transition 
            name = "fade-out"
            enter-active-class="transition-opacity duration-1000 ease-in"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-1000 ease-out"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            >
            <div v-show="!showMenu" class="fixed flex flex-col justify-between gap-4 items-center h-screen ml-2 sm:ml-5 mr-6">
                <div class="flex flex-col gap-4 justify-between items-center">
                    
                    <div class="cursor-pointer mt-5 btn-transition" @click="toggleMenu">
                        <Menu class="size-7"/>
                    </div>

                    <RouterLink class="btn-transition" to="/dashboard">
                            <LayoutDashboard />
                    </RouterLink>

                    <RouterLink  class="btn-transition" to="/finance">
                            <Wallet />
                    </RouterLink>

                </div>
                
                <RouterLink  class="cursor-pointer mb-5 btn-transition" to="/settings">
                    <div class="">
                        <Settings />
                    </div>
                </RouterLink>

            </div>
        </Transition>
        
        <div class="w-12 sm:w-18 h-full" @click="closeMenu()">
        </div>

        <!-- Slide In Menü Leiste -->
        <Transition
            name="slide-menu"
            enter-active-class="transition-transform duration-300 ease-out"
            enter-from-class="-translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-300 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="-translate-x-full"
            >
            <div v-if="showMenu" class="fixed left-0 top-0 z-10 font-bold flex flex-col m-2 p-1 bg-gray-100/90 dark:bg-gray-600/90 rounded-3xl shadow-xl shadow-dark-color">
                
                <div class="p-2 hover:bg-cyan-700/60 rounded-t-3xl btn-transition" @click="toggleMenu()">
                    <div class="cursor-pointer">
                            <Menu class="size-7"/>
                    </div>
                </div>

                <SideBarButton path="/dashboard" :click="toggleMenu" :name="t('dashboard')">
                    <LayoutDashboard />
                </SideBarButton>

                <SideBarButton path="/finance" :click="toggleMenu" :name="t('finance')">
                    <Wallet />
                </SideBarButton>

                <SideBarButton path="/line-chart" :click="toggleMenu" :name="t('lineChart')">
                    <ChartLine />
                </SideBarButton> 

                <SideBarButton path="/pie-chart" :click="toggleMenu" :name="t('pieChart')">
                    <ChartPie />
                </SideBarButton> 

                <SideBarButton path="/info" :click="toggleMenu" :name="t('info')">
                    <Info />
                </SideBarButton>

                 <SideBarButton path="/fjksfre" :click="toggleMenu" :name="t('notFound')">
                    <AppWindow />
                </SideBarButton> 

                <SideBarButton path="/settings" :click="toggleMenu" :name="t('settings')" special-style="rounded-b-3xl btn-down">
                    <Settings />
                </SideBarButton>

            </div>
        </Transition>
    </div>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router';
import { LayoutDashboard, Menu, Wallet, Settings, AppWindow, Info, ChartLine, ChartPie } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import SideBarButton from './buttons/SideBarButton.vue';
import type { PropType } from 'vue';


export default {
    components: {
        LayoutDashboard,
        Menu,
        Wallet,
        Settings,
        AppWindow,
        Info,
        ChartLine,
        ChartPie,
        SideBarButton,
        RouterLink,
    },
    
    setup() {
        const { t, locale } = useI18n();

        return { t, locale };
    },

    props: {
        showMenu : {
            type: Boolean,
            required: true
        },

        toggleMenu : {
            type: Function as PropType<()=> void>,
            required: true
        },

        closeMenu : {
            type: Function,
            required: true
        }
    },
}
</script>