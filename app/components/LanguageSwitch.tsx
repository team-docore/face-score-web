// DOCORE: 언어 스위치 컴포넌트 - 다국어 지원

import { useLanguageStore } from '../store/languageStore'
import { useMemoryStore } from '../store/memoryStore'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguageStore()
  const { updateComponentStructure } = useMemoryStore()

  const handleLanguageChange = (newLanguage: 'ko' | 'en') => {
    setLanguage(newLanguage)
    updateComponentStructure('languageSwitch', ['components/LanguageSwitch.tsx'])
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => handleLanguageChange(language === 'ko' ? 'en' : 'ko')}
        className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
      >
        {language === 'ko' ? 'English' : '한국어'}
      </button>
    </div>
  )
} 