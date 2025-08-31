<template>
  <div class="flex flex-row h-screen">
    
    <!-- Menüleiste -->
    <Sidebar :showMenu="showMenu" :toggleMenu="toggleMenu" :closeMenu="closeMenu"/>

    <!-- Haupt Seite -->
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
import type { Finance } from './state';

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
        showMenu: false as boolean, // ist Menüleiste offen
        state: useGlobalStore()
      }
    },

    methods: {
      /**
       * Wechselt zwischen offener / geschlossener Menüleiste
       */
      toggleMenu() {
        this.showMenu = !this.showMenu
      },

      /**
       * Schließt offene Menüleiste
       */
      closeMenu() {
        if(this.showMenu) {
          this.showMenu = false;
        }
      },
    },

    computed: {

      /**
       * Gibt zurück ob Route zu ein Diagramm führt
       */
      isDiagramRoute() {
        console.log(this.$route.path);
        return this.$route && (this.$route.path === '/line-chart' || this.$route.path === '/pie-chart' || this.$route.path === '/dashboard' || this.$route.path === '/');
      }
    },

    watch: {
      'state.finances': {
        handler(newFinances, oldFinances) {
          
          const extractRelevantForRecurring = (arr: Finance[]) =>
            arr.map(f => ({
              id: f.id,
              isRecurring: f.isRecurring,
              recurringCycle: f.recurringCycle,
              date: f.date
            }));

          const extractRelevantForNotification = (arr: Finance[]) =>
            arr.map(f => ({
              id: f.id,
              isNotification: f.isNotification,
              notificationDate: f.notificationDate,
            }));

          const newDataRecurring = extractRelevantForRecurring(newFinances);
          const oldDataRecurring = extractRelevantForRecurring(oldFinances);

          const newDataNotification = extractRelevantForNotification(newFinances);
          const oldDataNotification = extractRelevantForNotification(oldFinances);

          if (JSON.stringify(newDataRecurring) !== JSON.stringify(oldDataRecurring)) {
            console.log('Recurring-relevante Daten haben sich geändert!');
            this.state.checkRecurringFinances();
          }

          if (JSON.stringify(newDataNotification) !== JSON.stringify(oldDataNotification)) {
            console.log('Notification-relevante Daten haben sich geändert!');
            this.state.checkNotification();
          }
        },
        deep: true
      }
    },

    /**
     * Setze initiales Theme und Sprache und überprüfe wiederkehrende Zahlungen
     */
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
      document.title = this.state.lang === 'de' ? 'Finanztracker' : 'Finance Tracker';

      this.state.pieChartDateFilter = this.state.getDateFilterOptions[0] ?? '';
      this.state.lineChartDateFilter = this.state.getDateFilterOptions[0] ?? '';
      this.state.checkNotification();
      this.state.checkRecurringFinances();
    }  
}
</script>
