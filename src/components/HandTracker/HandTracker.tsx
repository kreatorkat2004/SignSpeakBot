import { useRef, useEffect } from 'react'
import { useMediaPipe } from '@/hooks/useMediaPipe'

const HandTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { hands, isLoaded } = useMediaPipe()

  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (hands && hands.length > 0) {
      hands.forEach(hand => {
        hand.landmarks.forEach((landmark, index) => {
          ctx.beginPath()
          ctx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            3,
            0,
            2 * Math.PI
          )
          ctx.fillStyle = index === 8 ? '#ef4444' : '#3b82f6' 
          ctx.fill()
        })

        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4], 
          [0, 5], [5, 6], [6, 7], [7, 8], 
          [0, 9], [9, 10], [10, 11], [11, 12], 
          [0, 13], [13, 14], [14, 15], [15, 16], 
          [0, 17], [17, 18], [18, 19], [19, 20], 
        ]

        ctx.strokeStyle = '#6b7280'
        ctx.lineWidth = 2
        connections.forEach(([start, end]) => {
          const startPoint = hand.landmarks[start]
          const endPoint = hand.landmarks[end]
          if (startPoint && endPoint) {
            ctx.beginPath()
            ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height)
            ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height)
            ctx.stroke()
          }
        })
      })
    }
  }, [hands, isLoaded])

  return (
    <canvas
      ref={canvasRef}
      className="canvas-overlay"
      width={640}
      height={480}
    />
  )
}

export default HandTracker