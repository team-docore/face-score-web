'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface SearchParamsProviderProps {
  onParamsChange: (params: {
    score: string | null
    comment: string | null
    language: string | null
  }) => void
}

export default function SearchParamsProvider({ onParamsChange }: SearchParamsProviderProps) {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const score = searchParams.get('score')
    const comment = searchParams.get('comment')
    const language = searchParams.get('language')
    
    onParamsChange({ score, comment, language })
  }, [searchParams, onParamsChange])

  return null
} 