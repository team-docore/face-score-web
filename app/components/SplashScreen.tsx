// DOCORE: 넷플릭스 스타일 스플래시 화면 컴포넌트
import React from 'react'

interface SplashScreenProps {
  language: 'ko' | 'en'
}

export default function SplashScreen({ language }: SplashScreenProps) {
  const title = language === 'ko' ? '얼평 해줄께' : 'Face Score for You'
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black animate-fadein">
      <div className="mb-8 flex gap-1 justify-center">
        {title.split('').map((char, i) => (
          <span
            key={i}
            className="inline-block text-5xl md:text-7xl font-extrabold text-white tracking-widest animate-netflix-letter select-none"
            style={{
              animationDelay: `${i * 0.08 + 0.1}s`,
              letterSpacing: '0.15em'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <div className="mt-8 text-white text-lg font-medium animate-fadein-slow">AI 얼굴 분석 준비 중...</div>
      <style jsx global>{`
        @keyframes fadein {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadein { animation: fadein 1s ease; }
        .animate-fadein-slow { animation: fadein 2s ease; }
        @keyframes netflix-letter {
          0% { opacity: 0; transform: scale(0.7) translateY(20px);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        .animate-netflix-letter {
          animation: netflix-letter 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  )
} 