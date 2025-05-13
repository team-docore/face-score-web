// DOCORE: 성별 선택 컴포넌트 - 성별 선택 UI

import { useFaceStore } from '../store/faceStore'
import { useLanguageStore } from '../store/languageStore'
import { useMemoryStore } from '../store/memoryStore'

export default function GenderSelector() {
  const { gender, setGender } = useFaceStore()
  const { language } = useLanguageStore()
  const { updateComponentStructure } = useMemoryStore()

  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender)
    updateComponentStructure('genderSelector', ['components/GenderSelector.tsx'])
  }

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      <button
        onClick={() => handleGenderChange('male')}
        className={`px-6 py-2 rounded-full transition-all duration-300 ${
          gender === 'male'
            ? 'bg-blue-500 text-white'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        {language === 'ko' ? '남성' : 'Male'}
      </button>
      <button
        onClick={() => handleGenderChange('female')}
        className={`px-6 py-2 rounded-full transition-all duration-300 ${
          gender === 'female'
            ? 'bg-pink-500 text-white'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        }`}
      >
        {language === 'ko' ? '여성' : 'Female'}
      </button>
    </div>
  )
} 