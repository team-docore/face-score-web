// DOCORE: 얼굴 분석 유틸리티 함수

interface Point {
  x: number
  y: number
}

// 대칭성 계산 함수
export const calculateSymmetry = (leftEye: Point[], rightEye: Point[]) => {
  const leftEyeCenter = {
    x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
    y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length
  }
  const rightEyeCenter = {
    x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
    y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length
  }
  
  const eyeDistance = Math.sqrt(
    Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) +
    Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
  )
  
  // 대칭성 점수 계산 (0-100)
  const symmetryScore = Math.min(100, Math.max(0, 100 - Math.abs(eyeDistance - 50) * 2))
  return symmetryScore
}

// 얼굴 비율 계산 함수
export const calculateFaceRatio = (jawline: Point[], leftEye: Point[], rightEye: Point[], nose: Point[], mouth: Point[]) => {
  // 눈 간격과 눈-입 거리의 비율
  const eyeDistance = Math.sqrt(
    Math.pow(rightEye[0].x - leftEye[0].x, 2) +
    Math.pow(rightEye[0].y - leftEye[0].y, 2)
  )
  
  const eyeToMouthDistance = Math.sqrt(
    Math.pow(mouth[0].x - leftEye[0].x, 2) +
    Math.pow(mouth[0].y - leftEye[0].y, 2)
  )
  
  // 황금비율에 가까울수록 높은 점수
  const goldenRatio = 1.618
  const ratio = eyeToMouthDistance / eyeDistance
  const ratioScore = Math.min(100, Math.max(0, 100 - Math.abs(ratio - goldenRatio) * 50))
  
  return ratioScore
} 