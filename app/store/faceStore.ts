// DOCORE: 얼굴 분석 상태 관리 스토어

import { create } from 'zustand'

export const useFaceStore = create<{
  gender: 'male' | 'female' | null
  setGender: (g: 'male' | 'female' | null) => void
}>((set) => ({
  gender: null,
  setGender: (g) => set({ gender: g }),
})) 