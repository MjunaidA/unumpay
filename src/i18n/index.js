// src/i18n/index.js
import { createI18n } from 'vue-i18n'

// Import translations
import en from './en.json'
import fr from './fr.json'
import ar from './ar.json'

const messages = { en, fr, ar }

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  fallbackLocale: 'en',
  messages,
})

export default i18n
