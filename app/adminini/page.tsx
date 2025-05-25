// DOCORE: 관리자용 실시간 접속자 수 확인 페이지 (Vercel Analytics 활용)
'use client'
import React, { useEffect, useState } from 'react'

export default function AdmininiPage() {
  const [activeUsers, setActiveUsers] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Vercel Analytics API (공식 문서 참고)
    // https://vercel.com/docs/analytics/quickstart
    // (실제 배포 환경에서만 동작)
    fetch('/api/vercel/active-users')
      .then(res => res.json())
      .then(data => {
        if (typeof data.activeVisitors === 'number') setActiveUsers(data.activeVisitors)
        else setError('실시간 접속자 정보를 불러올 수 없습니다.')
      })
      .catch(() => setError('실시간 접속자 정보를 불러올 수 없습니다.'))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-8">실시간 접속자 현황</h1>
      {error ? (
        <div className="text-red-400 text-lg">{error}</div>
      ) : activeUsers !== null ? (
        <div className="text-6xl font-extrabold text-blue-400 mb-4">{activeUsers}명</div>
      ) : (
        <div className="text-zinc-400 text-lg">불러오는 중...</div>
      )}
      <div className="mt-8 text-zinc-400 text-sm">이 페이지는 관리자만 직접 주소로 접근해야 합니다.</div>
    </div>
  )
} 