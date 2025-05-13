// DOCORE: 얼굴 분석 (얼평) 메인 페이지 - 사진 업로드 후 얼굴 분석 + 점수 출력

'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'
import { useFaceStore } from './store/faceStore'
import { calculateSymmetry, calculateFaceRatio } from './utils/faceAnalysis'
import { comments } from './constants/comments'

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [language, setLanguage] = useState<'ko' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'ko' | 'en'
      if (savedLanguage) return savedLanguage
      
      const browserLang = navigator.language.toLowerCase()
      return browserLang.startsWith('ko') ? 'ko' : 'en'
    }
    return 'ko'
  })
  const imgRef = useRef<HTMLImageElement | null>(null)
  const { gender: faceStoreGender, setGender: setFaceStoreGender } = useFaceStore()

  useEffect(() => {
    const savedGender = localStorage.getItem('gender') as 'male' | 'female' | null
    if (savedGender) {
      setGender(savedGender)
      setFaceStoreGender(savedGender)
    }
  }, [setFaceStoreGender])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    }
    loadModels()

    // 클립보드 이벤트 리스너 추가
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile()
          if (!file) continue

          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            setImage(dataUrl)
            setUploadedFile(file)
            setScore(null)
            setMessage('')
          }
          reader.readAsDataURL(file)
          break
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  const processImage = async () => {
    if (!uploadedFile) return

    setLoading(true)
    setScore(null)
    setMessage('')

    await new Promise((r) => setTimeout(r, 500))

    const img = new Image()
    img.src = image as string
    img.onload = async () => {
      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
      setLoading(false)

      if (detections) {
        // 얼굴 특징 분석
        const landmarks = detections.landmarks.positions
        const jawline = landmarks.slice(0, 17)
        const leftEye = landmarks.slice(36, 42)
        const rightEye = landmarks.slice(42, 48)
        const nose = landmarks.slice(27, 36)
        const mouth = landmarks.slice(48, 68)

        const symmetryScore = calculateSymmetry(leftEye, rightEye)
        const faceRatioScore = calculateFaceRatio(jawline, leftEye, rightEye, nose, mouth)
        const finalScore = Math.floor(symmetryScore * 0.6 + faceRatioScore * 0.4)

        let commentCategory: 'high' | 'mid' | 'low' = 'mid'
        if (finalScore >= 90) commentCategory = 'high'
        else if (finalScore < 70) commentCategory = 'low'

        const genderType = gender === 'female' ? 'female' : 'male'
        const commentList = comments[language][genderType][commentCategory]
        const randomComment = commentList[Math.floor(Math.random() * commentList.length)]
        
        setScore(finalScore)
        setMessage(randomComment)
      } else {
        setScore(null)
        setMessage('얼굴을 찾을 수 없어요 😢')
      }
    }
  }

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImage(dataUrl)
      setUploadedFile(file)
      setScore(null)
      setMessage('')
    }
    reader.readAsDataURL(file)
  }

  const handleGenderChange = (newGender: 'male' | 'female') => {
    setGender(newGender)
    setFaceStoreGender(newGender)
  }

  const handleLanguageChange = (newLanguage: 'ko' | 'en') => {
    setLanguage(newLanguage)
    if (score) {
      const genderType = gender === 'female' ? 'female' : 'male'
      let commentCategory: 'high' | 'mid' | 'low' = 'mid'
      if (score >= 90) commentCategory = 'high'
      else if (score < 70) commentCategory = 'low'
      const commentList = comments[newLanguage][genderType][commentCategory]
      const randomComment = commentList[Math.floor(Math.random() * commentList.length)]
      setMessage(randomComment)
    }
  }

  const messages = {
    ko: {
      title: 'AI 초정밀 얼평',
      subtitle: 'AI-Powered Precision Face Analysis',
      selectGender: '성별을 선택해주세요',
      female: '여성',
      male: '남성',
      uploadPhoto: '사진을 업로드하세요',
      clickToUpload: '클릭하여 사진 업로드',
      orPaste: '또는 Ctrl+V로 붙여넣기',
      analyzing: '분석 중...',
      noFace: '얼굴을 찾을 수 없어요 😢',
      getScore: '얼평받기',
      reanalyze: '다시 분석하기',
      points: '점',
      switchLanguage: 'English'
    },
    en: {
      title: 'AI Precision Face Analysis',
      subtitle: 'AI-Powered Precision Face Analysis',
      selectGender: 'Please select your gender',
      female: 'Female',
      male: 'Male',
      uploadPhoto: 'Upload your photo',
      clickToUpload: 'Click to upload photo',
      orPaste: 'or press Ctrl+V to paste',
      analyzing: 'Analyzing...',
      noFace: 'No face detected 😢',
      getScore: 'Get Score',
      reanalyze: 'Analyze Again',
      points: 'points',
      switchLanguage: '한국어'
    }
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-800 p-6 rounded-2xl shadow-xl text-center space-y-6">
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              onClick={() => handleLanguageChange(language === 'ko' ? 'en' : 'ko')}
              className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1 rounded-full border border-zinc-700 hover:border-zinc-600"
            >
              {messages[language].switchLanguage}
            </button>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            {messages[language].title}
          </h1>
          <p className="text-m text-zinc-400">
            {messages[language].subtitle}
          </p>
        </div>

        {!image ? (
          <div className="space-y-6">
            <div className="space-y-4">
              {!gender && <p className="text-zinc-300 text-lg">{messages[language].selectGender}</p>}
              <div className="flex items-center justify-center gap-4">
                <span className={`text-lg font-medium transition-colors duration-300 ${gender === 'female' ? 'text-pink-500' : 'text-zinc-400'}`}>
                  {messages[language].female}
                </span>
                <button
                  onClick={() => handleGenderChange(gender === 'female' ? 'male' : 'female')}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 shadow-lg ${
                    gender === 'female' 
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-all duration-300 ${
                      gender === 'female' 
                        ? 'translate-x-1 hover:translate-x-0.5' 
                        : 'translate-x-11 hover:translate-x-[2.75rem]'
                    }`}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      {gender === 'female' ? (
                        <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </span>
                </button>
                <span className={`text-lg font-medium transition-colors duration-300 ${gender === 'male' ? 'text-blue-500' : 'text-zinc-400'}`}>
                  {messages[language].male}
                </span>
              </div>
            </div>
            <div className="pt-4 border-t border-zinc-700">
              <p className="text-zinc-300 text-lg mb-4">{messages[language].uploadPhoto}</p>
              <label className="block w-full">
                <div className="border-2 border-dashed border-zinc-600 rounded-xl p-8 hover:border-pink-500 transition-colors cursor-pointer">
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-zinc-400">{messages[language].clickToUpload}</p>
                    <p className="text-zinc-500 text-sm">{messages[language].orPaste}</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto"></div>
                <p className="text-zinc-400 text-lg">{messages[language].analyzing}</p>
              </div>
            ) : (
              <>
                {image && (
                  <div className="relative">
                    <img
                      ref={imgRef}
                      src={image}
                      alt="업로드된 이미지"
                      className="w-full max-h-80 object-contain mx-auto rounded-xl shadow-lg"
                    />
                    <button
                      onClick={() => {
                        setImage(null)
                        setUploadedFile(null)
                        setScore(null)
                        setMessage('')
                      }}
                      className="absolute top-2 right-2 bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700/90 text-zinc-400 hover:text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90 transform border border-zinc-700/50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {!score && !loading && (
                  <button
                    onClick={processImage}
                    className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
                  >
                    {messages[language].getScore}
                  </button>
                )}
                {score && (
                  <div className="space-y-2">
                    <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                      {score}{messages[language].points}
                    </div>
                    <p className="text-zinc-300 text-lg">{message}</p>
                    <button
                      onClick={() => {
                        setImage(null)
                        setUploadedFile(null)
                        setScore(null)
                        setMessage('')
                      }}
                      className="mt-4 w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
                    >
                      {messages[language].reanalyze}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
