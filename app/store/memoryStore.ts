// DOCORE: 메모리 스토어 - 컴포넌트 구조와 상태 관리

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MemoryState {
  componentStructure: {
    main: string[]
    genderSelector: string[]
    imageUploader: string[]
    languageSwitch: string[]
  }
  lastUpdate: string
  updateComponentStructure: (component: string, structure: string[]) => void
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      componentStructure: {
        main: ['page.tsx'],
        genderSelector: ['components/GenderSelector.tsx'],
        imageUploader: ['components/ImageUploader.tsx'],
        languageSwitch: ['components/LanguageSwitch.tsx']
      },
      lastUpdate: new Date().toISOString(),
      updateComponentStructure: (component, structure) => 
        set((state) => ({
          componentStructure: {
            ...state.componentStructure,
            [component]: structure
          },
          lastUpdate: new Date().toISOString()
        }))
    }),
    {
      name: 'memory-storage'
    }
  )
) 