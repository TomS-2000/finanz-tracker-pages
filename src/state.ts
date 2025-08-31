import { defineStore } from 'pinia'
import { translation } from './translations/translation'

export type Finance = {
  id: number,
  name: string,
  value: number,
  valueList: {title: string, value: number}[],
  from: string,
  date: string,
  categories: string [],
  description: string,
  isRecurring: boolean,
  recurringCycle: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly',
  isNotification: boolean,
  notificationDate: string,
  notificationText: string,
  isExtraValuesVisible: boolean
}

export type FinanceDate = {
    date : string,
    finances: Finance[]
}

export type Category = {
  cat: string,
  color: string
}

export type Notification = {
  notificationID: number,
  notificationDate: string,
  notificationText: string,
  fromID: number
}

export type DateTypes = "day" | "month" | "year";

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    isDark: null as boolean | null,   // Theme
    lang: 'de' as 'en' | 'de',        // Sprache 
    totalAmount: 2000 as number,      // aktueller Kontostand
    nextFinanceId: 11 as number,      // nächste Finanz ID
    financePageDateFilter: 'day' as DateTypes,  // Filter Finanz Seite Tag/Monat/Jahr 
    isLineChartInfoVisible: false as boolean,   // ist Infotext sichtbar LineChart
    isPieChartInfoVisible: false as boolean,    // ist Infotext sichtbar PieChart
    notifications: [] as Notification[],
    nextNotificationID: 1 as number,
    pieChartDateFilter: '' as string,
    lineChartDateFilter: '' as string,
    categories: [
      {cat: 'Einkauf', color: '#b7349f'},
      {cat: 'Miete', color: '#ff6b3b'},
      {cat: 'Beruf', color: '#2bc4ad'},
      {cat: 'Hobby', color: '#ff003b'},
      {cat: 'Urlaub', color: '#00c460'},
      {cat: 'Vertrag', color: '#d5e212'},
      {cat: 'Besonderes', color: '#0810f7'},
    ] as Category[],
    isVisibleDayList: [
      { date: "2025-06-02", isVisible: true },
      { date: "2025-06-28", isVisible: true },
      { date: "2025-06-30", isVisible: true },
      { date: "2025-06-20", isVisible: true },
      { date: "2025-05-15", isVisible: true },
      { date: "2025-06-01", isVisible: true },
      { date: "2024-12-24", isVisible: true },
      { date: "2025-06-13", isVisible: true },
      { date: "2025-01-10", isVisible: true },
      { date: "2026-01-13", isVisible: true }
    ] as {date: string, isVisible: boolean}[],
    isVisibleMonthList: [
      { date: "2025-06", isVisible: true },
      { date: "2025-05", isVisible: true },
      { date: "2024-12", isVisible: true },
      { date: "2025-01", isVisible: true },
      { date: "2026-01", isVisible: true }
    ] as {date: string, isVisible: boolean}[],
    isVisibleYearList: [
      { date: "2025", isVisible: true },
      { date: "2024", isVisible: true },
      { date: "2026", isVisible: true }
    ] as {date: string, isVisible: boolean}[],
    finances: [
      // Keine echten Werte
      {id: 1, name: "Miete", value: -670.59, valueList: [], from: "Konto", date: "2025-06-02T12:00", 
      categories: ['Miete'],
      description: "Monatliche Miete der Wohnung", 
      isRecurring: false, recurringCycle: 'none', isNotification: true, notificationDate: '2025-06-02T12:00', notificationText: "Die Miete von -670.59€ wurde abgezogen.", 
      isExtraValuesVisible: false },
      
      {id: 2 ,name: "Bestellung Amazon", value: -39.99, valueList: [], from: "Konto", date: "2025-06-28T12:10", 
      categories: ['Hobby', 'Einkauf'],
      description: "Skistöcke für nächsten Winterurlaub",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: "", 
      isExtraValuesVisible: false },
      
      {id: 3, name: "Gehalt", value: 1600.00, valueList: [], from: "Konto", date: "2025-06-30T15:10", 
      categories: ['Beruf'],
      description: "Gehalt von der Arbeit.",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: "", 
      isExtraValuesVisible: false },
      
      {id: 4, name: "Einkauf", value: -1.37, 
      valueList: [{title: "Wurst", value: -2.49}, {title: "Brot", value: -2.79}, {title: "Käse", value: -2.29},{title: "Wasser-1l", value: -0.30}, {title: "Pfand", value: 6.50}], 
      from: "Bar", date: "2025-06-20T16:10", 
      categories: ['Einkauf'],
      description: "Essen für die Woche.",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: '', 
      isExtraValuesVisible: false },
      
      {id: 5, name: "Internet-Vertrag", value: -49.99, valueList: [], from: "Konto", date: "2025-05-15T10:00", 
      categories: ['Vertrag'],
      description: "Monatlich anfallender Vertrag für Internet.",
      isRecurring: false, recurringCycle: 'none', isNotification: true, notificationDate: '2025-05-14T10:00', notificationText: "Bald fallen -49.99€ für den Internet-Vertrag an.", 
      isExtraValuesVisible: false },
      
      {id: 6, name: "Taschengeld", value: 25, valueList: [], from: "Bar", date: "2025-06-01T12:00", 
      categories: ['Besonderes'],
      description: "Wöchentliches Taschengeld.",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: "",
      isExtraValuesVisible: false },
      
      {id: 7, name: "Weihnachten", value: 300, valueList: [], from: "Konto", date: "2024-12-24T18:00", 
      categories: ['Besonderes'],
      description: "Weihnachtsgeld",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: "",
      isExtraValuesVisible: false },
      
      {id: 8, name: "Einkauf", value: -4.27, 
      valueList: [{title: "Apfel", value: -1.49}, {title: "Brot", value: -2.79}, {title: "Käse", value: -3.49}, {title: "Pfand", value: 3.50}], 
      from: "Bar", date: "2025-06-13T11:10", 
      categories: ['Einkauf'],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: "",
      isExtraValuesVisible: false },
      
      {id: 9, name: "Skiurlaub 2025", value: -1340, 
      valueList: [{title: "Ausleih", value: -140}, {title: "Skiticket", value: -390}, {title: "Unterkunft", value: -810}],
      from: "Konto", date: "2025-01-10T14:30", 
      categories: ['Hobby', 'Urlaub'],
      description: "Kosten für den Skiurlaub 2025.",
      isRecurring: false, recurringCycle: 'none', isNotification: false, notificationDate: '', notificationText: "",
      isExtraValuesVisible: false },
      
      {id: 10, name: "Skiurlaub 2026", value: -1460, 
      valueList: [{title: "Ausleih", value: -145}, {title: "Skiticket", value: -395}, {title: "Unterkunft", value: -920}], 
      from: "Konto", date: "2026-01-13T10:15", 
      categories: ['Hobby', 'Urlaub'],
      description: "Kosten für den Skiurlaub 2025. Skiausleih, Tickets, Unterkunft.",
      isRecurring: false, recurringCycle: 'none', isNotification: true, notificationDate: '2026-01-02T10:00', notificationText: "Ski-Urlaub 2026 hat -1460€ gekostet.",
      isExtraValuesVisible: false },
    ] as Finance[]
  }),

  // computed
  getters: {
    /**
     * Gibt die Einnahmen/Ausgaben pro Jahr zurück
     * @returns Finanzen pro Jahr
     */
    getFinancesPerYear() : FinanceDate[] {
      let financesPerYear : FinanceDate[] = [];

        for (let i = 0; i < this.finances.length; i++) {
          const [year] = this.finances[i].date.split(/[-T]/);

          let finaceYear = financesPerYear.find(finance =>{
              const [yearf] = finance.date.split(/[-T]/);
              
              if(yearf === year) return true;

              return false;
          } );

          if(finaceYear) {
              finaceYear.finances.push(this.finances[i]);
          } else {
              financesPerYear.push({date: year, finances: [this.finances[i]]});
          }
      }

      financesPerYear.sort((a: FinanceDate, b: FinanceDate) => b.date.localeCompare(a.date));

      financesPerYear.forEach(year => {
          year.finances.sort((a: Finance, b: Finance) => b.date.localeCompare(a.date));
      });

      financesPerYear = financesPerYear.map(finance => ({date: finance.date, finances: finance.finances}));
      
      return financesPerYear;
    },

    /**
     * Gibt die Einnahmen/Ausgaben pro Monat zurück
     * @returns Finanzen pro Monat
     */
    getFinancesPerMonth() : FinanceDate[] {
      let financesPerMonth : FinanceDate[] = [];

        for (let i = 0; i < this.finances.length; i++) {
          const [year, month] = this.finances[i].date.split(/[-T]/);

          let finaceMonth = financesPerMonth.find(finance =>{
              const [yearf, monthf] = finance.date.split(/[-T]/);
              
              if(yearf === year && monthf === month) return true;

              return false;
          } );

          if(finaceMonth) {
              finaceMonth.finances.push(this.finances[i]);
          } else {
              financesPerMonth.push({date: year + "-" + month, finances: [this.finances[i]]});
          }
      }

      financesPerMonth.sort((a: FinanceDate, b: FinanceDate) => b.date.localeCompare(a.date));

      financesPerMonth.forEach(month => {
          month.finances.sort((a: Finance, b: Finance) => b.date.localeCompare(a.date));
      });

      financesPerMonth = financesPerMonth.map(finance => ({date: finance.date, finances: finance.finances}));
      
      return financesPerMonth;
    },

    /**
     * Gibt die Einnahmen/Ausgaben pro Tag zurück
     * @returns Finanzen pro Tag
     */
    getFinancesPerDate() : FinanceDate[] {
      let financesPerDate : FinanceDate[] = [];

      for (let i = 0; i < this.finances.length; i++) {

          const [year, month, day] = this.finances[i].date.split(/[-T]/);
          let finaceDay = financesPerDate.find(finance => {
            const [yearf, monthf, dayf] = finance.date.split(/[-T]/);
            
            if(yearf === year && monthf === month && dayf === day) return true;

            return false;
          });

          if(finaceDay) {
              finaceDay.finances.push(this.finances[i]);
          } else {
              financesPerDate.push({date: year + "-" + month + "-" + day, finances: [this.finances[i]]});
          }
      }

      financesPerDate.sort((a : FinanceDate, b: FinanceDate) => {
          return b.date.localeCompare(a.date);
      });

      financesPerDate.forEach(day => {
          day.finances.sort((a: Finance, b: Finance) => b.date.localeCompare(a.date));
      });

      financesPerDate = financesPerDate.map(finance => ({date: finance.date, finances: finance.finances}));
      
      return financesPerDate;
    },

    getDateFilterOptions() : string[] {

			let filterOptions: string[] = [];

			const monthFilterOptions: string[] = this.getFinancesPerMonth.map(finance => finance.date);

			const yearFilterOptions: string[] = this.getFinancesPerYear.map(finance => finance.date );

			if(monthFilterOptions.length > 0) {
				filterOptions = [...monthFilterOptions]
			}

			if(yearFilterOptions.length > 0) {
				filterOptions = [...filterOptions, ...yearFilterOptions];
			}

			filterOptions.sort((f1, f2) => f2.localeCompare(f1));

			return filterOptions;
		},
  },

  // methods
  actions: {

    dateToString(str: string, isDay? : boolean) {
      if(isDay) {
          const [year, month, day, time] = str.split(/[-T]/);
          return `${day}.${month}.${year} ${time}`;
      }
      else if(this.financePageDateFilter === "day") {
          const [year, month, day] = str.split(/[-T]/);
          return `${day}.${month}.${year}`;
      } else if (this.financePageDateFilter === "month") {
          const [year, month, day] = str.split(/[-T]/);
          return `${month}.${year}`;
      } else if (this.financePageDateFilter === "year") {
          const [year, month, day] = str.split(/[-T]/);
          return `${year}`;
      } else {
          return "";
      } 
    },

    getIsInVisibleDayList(date: string) {
      const [year, month, day] = date.split(/[-T]/);
      return this.isVisibleDayList.some(iv => iv.date === (year + '-' + month + '-' + day));
    },

    getIsInVisibleMonthList(date: string) {
      const [year, month] = date.split(/[-T]/);
      return this.isVisibleMonthList.some(iv => iv.date === (year + '-' + month));
    },

    getIsInVisibleYearList(date: string) {
      const [year] = date.split(/[-T]/);
      return this.isVisibleYearList.some(iv => iv.date === year);
    },

    pushInVisibleDayList(date: string) {
      const [year, month, day] = date.split(/[-T]/);
      this.isVisibleDayList.push({date: year + '-' + month + '-' + day, isVisible: true});
    },

    pushInVisibleMonthList(date: string) {
      const [year, month] = date.split(/[-T]/);
      this.isVisibleMonthList.push({date: year + '-' + month, isVisible: true});
    },

    pushInVisibleYearList(date: string) {
      const [year] = date.split(/[-T]/);
      this.isVisibleYearList.push({date: year, isVisible: true});
    },

    checkPushInVisibleList(date: string) {
      let isInDayList = this.getIsInVisibleDayList(date);
      let isInMonthList = this.getIsInVisibleMonthList(date);
      let isInYearList = this.getIsInVisibleYearList(date);

      if(!isInDayList){
          this.pushInVisibleDayList(date);
      }

      if(!isInMonthList){
          this.pushInVisibleMonthList(date);
      }

      if(!isInYearList){
          this.pushInVisibleYearList(date);
      }
    },

    checkRemoveFromVisibleList(date: string) {
      const [year, month, day] = date.split(/[-T]/);
      let isSoleDay = !this.getFinancesPerDate.some(fpd => fpd.date === (year + '-' + month + '-' + day));
      let isSoleMonth = !this.getFinancesPerMonth.some(fpd => fpd.date === (year + '-' + month));
      let isSoleYear = !this.getFinancesPerYear.some(fpd => fpd.date === year);

      if(isSoleDay) {
          let findDayIndex = this.isVisibleDayList.findIndex(iv => iv.date === (year + '-' + month + '-' + day));
          if(findDayIndex !== -1) {
              this.isVisibleDayList.splice(findDayIndex, 1);
          }
      }

      if(isSoleMonth) {
          let findMonthIndex = this.isVisibleMonthList.findIndex(iv => iv.date === (year + '-' + month));
          if(findMonthIndex !== -1) {
              this.isVisibleMonthList.splice(findMonthIndex, 1);
          }
      }

      if(isSoleYear) {
          let findYearIndex = this.isVisibleYearList.findIndex(iv => iv.date === year);

          if(findYearIndex !== -1) {
              this.isVisibleYearList.splice(findYearIndex, 1);
          }
      }
    },

    checkNotification() {
      let notifications: Finance[] = this.finances.filter(f => f.isNotification);
      const today = new Date();

      for(const notification of notifications) {
        let notificationDate = new Date(notification.notificationDate);

        if(notificationDate <= today) {
          notification.isNotification = false;
          this.notifications.push({
             notificationID: this.nextNotificationID,
             notificationDate : notificationDate.toLocaleString(),
             notificationText : notification.notificationText, 
             fromID: notification.id}
          );
          
          this.nextNotificationID++;
        }
      }

      this.notifications.sort((n1,n2) => this.toISOString(n2.notificationDate).localeCompare(this.toISOString(n1.notificationDate)));
    },

    toISOString(date: string) {
      const [day, month, year, time] = date.split(/[.,]/);

      return year + '-' + month + '-' + day + 'T' + time;
    },

    checkRecurringFinances() {
      let recurring: Finance[] = this.finances.filter(f => f.isRecurring && f.recurringCycle !== 'none');
      const today = new Date();

      for (const original of recurring) {
        let lastDate = new Date(original.date);

        let nextDate = this.getNextRecurringDate(lastDate, original.recurringCycle, lastDate.getDate());

        let lastClone: Finance | null = null;

        while (nextDate <= today) {
          const newFinance: Finance = JSON.parse(JSON.stringify(original));
          newFinance.id = this.nextFinanceId;
          
          newFinance.date = this.toLocalISOString(nextDate);
          newFinance.isRecurring = false;
          newFinance.recurringCycle = 'none';
          if(newFinance.notificationDate && newFinance.notificationText) {
            newFinance.isNotification = true;
            newFinance.notificationDate = newFinance.date;
          } else {
            newFinance.isNotification = false;
          }

          this.checkPushInVisibleList(newFinance.date);
          
          this.nextFinanceId++;

          this.finances.push(newFinance);
          this.totalAmount += this.parseToFixed2(newFinance.value);
          this.totalAmount = this.parseToFixed2(this.totalAmount);
          lastClone = newFinance;

          nextDate = this.getNextRecurringDate(nextDate, original.recurringCycle, lastDate.getDate());
        }

         if (lastClone) {
          lastClone.isRecurring = true;
          lastClone.recurringCycle = original.recurringCycle;

          original.isRecurring = false;
          original.recurringCycle = 'none';
        }
      }  
    },

    parseToFixed2(value: number): number {
      return Number(value.toFixed(2));
    },

    toLocalISOString(date: Date): string {
      const tzOffset = date.getTimezoneOffset() * 60000; // in ms
      const localTime = new Date(date.getTime() - tzOffset);
      return localTime.toISOString().slice(0, 16); // nur Jahr-Monat-Tag Stunde:Minute
    },

    getNextRecurringDate(date: Date, zyklus: Finance['recurringCycle'], originalDay: number): Date {
      let next = new Date(date);

      switch (zyklus) {
        case 'daily':
          next.setDate(next.getDate() + 1);
          break;
        case 'weekly':
          next.setDate(next.getDate() + 7);
          break;
        case 'monthly':
          next = this.addMonthSafe(next, originalDay);
          break;
        case 'yearly':
          next.setFullYear(next.getFullYear() + 1);
          break;
      }

      return next;
    },

    addMonthSafe(date: Date, originalDay: number): Date {
      const newDate = new Date(date);
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() + 1);
      const daysInMonth = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate();
      newDate.setDate(Math.min(originalDay, daysInMonth));
      return newDate;
    },

    /**
     * Wechselt zu anderen Theme (Light / Dark)
     */
    toggleDarkMode() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    /**
     * Wechselt zur anderen Sprache (Deutsch / Englisch)
     */
    toggleLanguage() {
      let language = translation.global.locale.value === 'en' ? 'de' : 'en'
      this.lang = language as 'en' | 'de';
      translation.global.locale.value = language as 'en' | 'de';
      document.title = this.lang === 'de' ? 'Finanztracker' : 'Finance Tracker';
    },

    /**
     * Setzt den aktuellen Kontostand neu
     * @param amount Neuer Kontostand
     */
    setTotalAmount(amount: string) {
      const amountNumber = parseFloat(parseFloat(amount).toFixed(2));
      if (!isNaN(amountNumber)) {
        this.totalAmount = amountNumber;
      }
    }
  },

  // Option von piniaPluginPersistedstate speichert state in localStorage automatisch
  persist: true
})