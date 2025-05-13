// DOCORE: 언어 스토어 - 다국어 지원

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  language: 'ko' | 'en'
  setLanguage: (lang: 'ko' | 'en') => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ko',
      setLanguage: (lang) => set({ language: lang })
    }),
    {
      name: 'language-storage'
    }
  )
) 