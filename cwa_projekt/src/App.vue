<template>
  <div class="flex flex-row h-screen">
    <Sidebar :showMenu="showMenu" :toggleMenu="toggleMenu" :closeMenu="closeMenu"/>

    <div class="flex-1 mt-4 mr-2 sm:mr-10" :class="[isDiagramRoute ? 'min-w-0' : '']" @click="closeMenu">
      <RouterView />
    </div>
  </div>
  
</template>

<script lang="ts">
import Sidebar from './components/Sidebar.vue';
import {RouterView} from 'vue-router';
import { useGlobalStore } from './state';
import { useI18n } from 'vue-i18n';

export default {
    components: {
      Sidebar,
      RouterView
    },

    setup() {
      const state = useGlobalStore();
      const {t, locale} = useI18n();
      return { state, t, locale };
    },

    data() {
      return {
        showMenu: false as boolean,
      }
    },

    methods: {
      toggleMenu() {
        this.showMenu = !this.showMenu
      },

      closeMenu() {
        if(this.showMenu) {
          this.showMenu = false;
        }
      },
    },

    computed: {
      isDiagramRoute() {
        console.log(this.$route.path);
        return this.$route && (this.$route.path === '/line-chart' || this.$route.path === '/pie-chart' || this.$route.path === '/dashboard');
      }
    },

    beforeMount() {
      if(this.state.isDark) {
        document.documentElement.classList.add('dark');
      } else if (this.state.isDark === false) {
        document.documentElement.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.state.isDark = prefersDark;
        document.documentElement.classList.toggle('dark', prefersDark);
      }

      if(this.state.lang === 'en') {
        this.locale = 'en';
      } else if (this.state.lang === 'de') {
        this.locale = 'de';
      } else {
        this.locale = 'en';
      }
    }  
}
</script>

<style scoped>
</style>
