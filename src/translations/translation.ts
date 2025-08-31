import { createI18n } from 'vue-i18n'
import de from './de.json'
import en from './en.json'

const messages = {
  de,
  en
}

export const translation = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages
})