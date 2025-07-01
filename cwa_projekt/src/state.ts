import { defineStore } from 'pinia'
import { translation } from './translations/translation'

export type Finance = {
  id: number,
  name: string,
  value: number,
  from: string,
  date: string,
  categories: { cat: string }[],
  description: string,
  isRecurring: boolean,
  isNotification: boolean,
  notificationDate: string,
  notificationText: string,
  isVisibleByDay: boolean,
  isVisibleByMonth: boolean,
  isVisibleByYear: boolean
}

export type FinanceDate = {
    date : string,
    finances: Finance[]
}

export type Category = {
  cat: string,
  color: string
}

export type DateTypes = "day" | "month" | "year";

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    isDark: null as boolean | null,
    lang: 'de' as 'en' | 'de',
    totalAmount: 1000 as number,
    nextFinanceId: 11 as number,
    financePageDateFilter: 'day' as DateTypes,
    isLineChartInfoVisible: false as boolean,
    isPieChartInfoVisible: false as boolean,
    categories: [
      {cat: 'Miete', color: '#FF6B3B'},
      {cat: 'Beruf', color: '#2BC4AD'},
      {cat: 'Hobby', color: '#FF003B'},
      {cat: 'Freizeit', color: '#00C460'},
    ] as Category[],
    finances: [
      {id: 1, name: "Miete", value: -450.50, from: "Konto", date: "2025-07-01", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!", 
      isRecurring: true, isNotification: true, notificationDate: '2025-07-01', notificationText: "Lorem", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 2 ,name: "Bestellung Amazon", value: -34, from: "Konto", date: "2025-07-01", 
      categories: [{cat: 'Hobby'}, {cat: 'Freizeit', color: '#00C460'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: true, notificationDate: '2025-07-01', notificationText: "Lorem", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 3, name: "Arbeit Gehalt", value: 500.50, from: "Konto", date: "2025-06-20", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: true, notificationDate: '2025-07-01', notificationText: "Lorem", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 4, name: "Einkauf", value: -57.50, from: "Bar", date: "2025-06-20", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: '', isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 5, name: "Schraube", value: -1.50, from: "Konto", date: "2025-06-19", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: "", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 6, name: "Schraube", value: 50, from: "Konto", date: "2026-06-24", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: "", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 7, name: "Schraube", value: -150, from: "Konto", date: "2025-06-24", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: "", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 8, name: "Schraube", value: 55, from: "Konto", date: "2025-06-29", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: "", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 9, name: "Schraube", value: -120, from: "Konto", date: "2026-06-10", 
      categories: [{cat: 'Miete'}, {cat: 'Beruf'}, {cat: 'Freizeit'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: "", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
      {id: 10, name: "Schraube", value: -120, from: "Konto", date: "2026-06-04", 
      categories: [{cat: 'Hobby'}],
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, reiciendis saepe nesciunt omnis!",
      isRecurring: false, isNotification: false, notificationDate: '', notificationText: "", isVisibleByDay: true, isVisibleByMonth: true, isVisibleByYear: true },
    ] as Finance[]
  }),

  getters: {
    getFinancesPerYear() : FinanceDate[] {
            let financesPerYear : FinanceDate[] = [];

             for (let i = 0; i < this.finances.length; i++) {
                const [year] = this.finances[i].date.split('-');

                let finaceMonth = financesPerYear.find(finance =>{
                    const [yearf] = finance.date.split('-');
                    
                    if(yearf === year) return true;

                    return false;
                } );

                if(finaceMonth) {
                    finaceMonth.finances.push(this.finances[i]);
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

    getFinancesPerMonth() : FinanceDate[] {
      let financesPerMonth : FinanceDate[] = [];

        for (let i = 0; i < this.finances.length; i++) {
          const [year, month] = this.finances[i].date.split('-');

          let finaceMonth = financesPerMonth.find(finance =>{
              const [yearf, monthf] = finance.date.split('-');
              
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

    getFinancesPerDate() : FinanceDate[] {
      let financesPerDate : FinanceDate[] = [];

      for (let i = 0; i < this.finances.length; i++) {
          let finaceDay = financesPerDate.find(finance => finance.date === this.finances[i].date);
          if(finaceDay) {
              finaceDay.finances.push(this.finances[i]);
          } else {
              financesPerDate.push({date: this.finances[i].date, finances: [this.finances[i]]});
          }
      }

      financesPerDate.sort((a : FinanceDate, b: FinanceDate) => {
          return b.date.localeCompare(a.date);
      });

      financesPerDate = financesPerDate.map(finance => ({date: finance.date, finances: finance.finances}));
      
      return financesPerDate;
    },
  },

  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
    },

    toggleLanguage() {
      let language = translation.global.locale.value === 'en' ? 'de' : 'en'
      this.lang = language as 'en' | 'de';
      translation.global.locale.value = language as 'en' | 'de';
    },

    setTotalAmount(amount: string) {
      const amountNumber = parseFloat(parseFloat(amount).toFixed(2));
      if (!isNaN(amountNumber)) {
        this.totalAmount = amountNumber;
      }
    }
  },

  persist: true
})