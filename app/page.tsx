// DOCORE: 얼굴 분석 (얼평) 메인 페이지 - 사진 업로드 후 얼굴 분석 + 점수 출력

'use client'

import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import GoogleAnalytics from './components/GoogleAnalytics'
import { useFaceStore } from './store/faceStore'
import { comments } from './constants/comments'

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [language, setLanguage] = useState<'ko' | 'en'>('ko')
  const resultRef = useRef<HTMLDivElement>(null)
  const { setGender: setFaceStoreGender } = useFaceStore()

  useEffect(() => {
    const savedGender = localStorage.getItem('gender') as 'male' | 'female' | null
    if (savedGender) {
      setGender(savedGender)
      setFaceStoreGender(savedGender)
    }
  }, [setFaceStoreGender])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as 'ko' | 'en'
      if (savedLanguage) setLanguage(savedLanguage)
      else {
        const browserLang = navigator.language.toLowerCase()
        setLanguage(browserLang.startsWith('ko') ? 'ko' : 'en')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
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

    setScore(null)
    setMessage('')

    const img = new window.Image()
    img.src = image as string
    img.onload = async () => {
      // 임의 점수 및 코멘트 생성
      const finalScore = Math.floor(Math.random() * 70) + 30; // 30~99
      let commentCategory: 'high' | 'mid' | 'low' = 'mid';
      if (finalScore >= 90) commentCategory = 'high';
      else if (finalScore < 70) commentCategory = 'low';
      const genderType = gender === 'female' ? 'female' : 'male';
      const commentList = comments[language][genderType][commentCategory];
      const randomComment = commentList[Math.floor(Math.random() * commentList.length)];
      setScore(finalScore);
      setMessage(randomComment);
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

  const alertMessages = {
    ko: {
      copied: '이미지가 클립보드에 복사되었습니다! 원하는 곳에 붙여넣기(Cmd+V/Ctrl+V) 하세요.',
      download: '이미지 복사에 실패하여 파일로 저장합니다. (브라우저 권한 문제일 수 있습니다)',
      notSupported: '이미지 복사 기능이 지원되지 않아 파일로 저장합니다.',
      wait: '이미지가 완전히 로드될 때까지 잠시만 기다려주세요.',
      error: '이미지 생성 중 오류 발생. 브라우저 보안 정책 또는 네트워크 문제일 수 있습니다.'
    },
    en: {
      copied: 'Image copied to clipboard! Paste it anywhere (Cmd+V/Ctrl+V).',
      download: 'Failed to copy image, so it will be saved as a file. (Browser permission issue)',
      notSupported: 'Image copy is not supported, so it will be saved as a file.',
      wait: 'Please wait until the image is fully loaded.',
      error: 'Error occurred while creating image. It may be a browser security or network issue.'
    }
  }

  const shareButtonText = {
    ko: '친구들에게 공유하기',
    en: 'Share with friends'
  }

  const serviceTitle = {
    ko: '얼평 해줄께',
    en: 'Face Score for You'
  }

  const serviceSubtitle = {
    ko: '점수 저장은 안 해! 자존심만 상할 뿐',
    en: 'No score is saved! Only your pride is at stake'
  }

  const seoDescription = {
    ko: 'AI가 얼굴을 분석해 점수와 코멘트를 제공합니다. 사진만 올리면 초정밀 얼평 결과를 바로 확인하세요!',
    en: 'AI analyzes your face and gives you a score and comment. Just upload a photo and get instant precision face analysis!'
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': serviceTitle[language],
    'url': 'https://face-score-web.vercel.app/',
    'description': seoDescription[language],
    'inLanguage': language === 'ko' ? 'ko' : 'en',
    'image': 'https://face-score-web.vercel.app/og-image.png',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://face-score-web.vercel.app/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      <Head>
        <title>{serviceTitle[language]}</title>
        <meta name="description" content={seoDescription[language]} />
        <meta property="og:title" content={serviceTitle[language]} />
        <meta property="og:description" content={seoDescription[language]} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://face-score-web.vercel.app/" />
        <meta property="og:image" content="https://face-score-web.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={serviceTitle[language]} />
        <meta name="twitter:description" content={seoDescription[language]} />
        <meta name="twitter:image" content="https://face-score-web.vercel.app/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Head>
      <GoogleAnalytics />
      <main className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-800 p-6 rounded-2xl shadow-xl text-center space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex justify-end">
              <button
                onClick={() => handleLanguageChange(language === 'ko' ? 'en' : 'ko')}
                className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1 rounded-full border border-zinc-700 hover:border-zinc-600"
              >
                {messages[language].switchLanguage}
              </button>
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent text-center">
              {serviceTitle[language]}
            </h1>
            <p className="text-lg text-zinc-400 text-center mt-2">
              {serviceSubtitle[language]}
            </p>
          </div>

          {/* 성별 선택 항상 노출 */}
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-4 text-center">
              <span className={`text-lg font-medium transition-colors duration-300 ${gender === 'female' ? 'text-pink-500' : 'text-zinc-400'}`}>{messages[language].female}</span>
              <button
                onClick={() => handleGenderChange(gender === 'female' ? 'male' : 'female')}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 shadow-lg ${gender === 'female' ? 'bg-gradient-to-r from-pink-500 to-pink-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}
              >
                <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-all duration-300 ${gender === 'female' ? 'translate-x-1 hover:translate-x-0.5' : 'translate-x-11 hover:translate-x-[2.75rem]'}`}> <div className="flex h-full w-full items-center justify-center">{gender === 'female' ? (<svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>) : (<svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>)}</div></span>
              </button>
              <span className={`text-lg font-medium transition-colors duration-300 ${gender === 'male' ? 'text-blue-500' : 'text-zinc-400'}`}>{messages[language].male}</span>
            </div>
          </div>

          {/* 업로드/분석 전 */}
          {!image && (
            <div className="space-y-6 text-center">
              <div className="pt-4 border-t border-zinc-700">
                <p className="text-zinc-300 text-lg mb-4 text-center">{messages[language].uploadPhoto}</p>
                <label className="block w-full">
                  <div className="border-2 border-dashed border-zinc-600 rounded-xl p-8 hover:border-pink-500 transition-colors cursor-pointer">
                    <div className="space-y-2 text-center">
                      <svg className="mx-auto h-12 w-12 text-zinc-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <p className="text-zinc-400 text-center">{messages[language].clickToUpload}</p>
                      <p className="text-zinc-500 text-sm text-center">{messages[language].orPaste}</p>
                    </div>
                    <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 업로드 후, 분석 전 미리보기 */}
          {image && !score && (
            <div className="space-y-6">
              <div className="relative">
                <img src={image} alt="업로드된 이미지" className="w-full max-h-80 object-contain mx-auto rounded-xl shadow-lg" style={{ maxWidth: 320, maxHeight: 320 }} />
                <button onClick={() => { setImage(null); setUploadedFile(null); setScore(null); setMessage(''); }} className="absolute top-2 right-2 bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700/90 text-zinc-400 hover:text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90 transform border border-zinc-700/50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <button onClick={processImage} className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors">{messages[language].getScore}</button>
            </div>
          )}

          {/* 분석 결과 카드 */}
          {score && (
            <div className="space-y-4">
              <div ref={resultRef} className="bg-zinc-800 p-6 rounded-2xl flex flex-col items-center">
                {image && (
                  <img src={image} alt="분석된 이미지" className="w-full max-h-80 object-contain mx-auto rounded-xl mb-4" style={{ maxWidth: 320, maxHeight: 320 }} />
                )}
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent mt-2">{score}{messages[language].points}</div>
                <p className="text-zinc-300 text-lg mt-2">{message}</p>
              </div>
              <button
                onClick={async () => {
                  if (!image) return
                  const img = new window.Image()
                  img.src = image
                  img.onload = async () => {
                    const width = 400
                    const height = 580
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    if (!ctx) return
                    ctx.fillStyle = '#18181b'
                    ctx.fillRect(0, 0, width, height)
                    // 서비스 타이틀
                    ctx.font = 'bold 28px sans-serif'
                    ctx.textAlign = 'center'
                    ctx.fillStyle = '#fff'
                    ctx.fillText(serviceTitle[language], width / 2, 48)
                    // 이미지
                    const imgW = Math.min(img.width, width - 40)
                    const imgH = Math.min(img.height, 320)
                    ctx.drawImage(img, (width - imgW) / 2, 70, imgW, imgH)
                    // 점수
                    ctx.font = 'bold 40px sans-serif'
                    ctx.fillStyle = '#a78bfa'
                    ctx.fillText(`${score}${messages[language].points}`, width / 2, imgH + 140)
                    // 코멘트
                    ctx.font = '20px sans-serif'
                    ctx.fillStyle = '#d1d5db'
                    ctx.fillText(message, width / 2, imgH + 180)
                    canvas.toBlob(async (blob) => {
                      if (blob && navigator.clipboard && navigator.clipboard.write) {
                        try {
                          await navigator.clipboard.write([
                            new window.ClipboardItem({ 'image/png': blob })
                          ])
                          alert(alertMessages[language].copied)
                        } catch (err) {
                          console.error('이미지 복사 오류:', err)
                          const url = URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.download = '얼평_결과.png'
                          link.href = url
                          link.click()
                          URL.revokeObjectURL(url)
                          alert(alertMessages[language].download)
                        }
                      } else {
                        const url = canvas.toDataURL('image/png')
                        const link = document.createElement('a')
                        link.download = '얼평_결과.png'
                        link.href = url
                        link.click()
                        alert(alertMessages[language].notSupported)
                      }
                    }, 'image/png')
                  }
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors"
              >
                {shareButtonText[language]}
              </button>
              <button onClick={() => { setImage(null); setUploadedFile(null); setScore(null); setMessage(''); }} className="mt-2 w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors">{messages[language].reanalyze}</button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
