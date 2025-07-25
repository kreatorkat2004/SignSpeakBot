import { useState, useCallback, useRef } from 'react'

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>('')
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError('')
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      })
      
      streamRef.current = mediaStream
      setStream(mediaStream)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied'
      setError(errorMessage)
      console.error('Camera error:', err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setStream(null)
    }
  }, [])

  return {
    stream,
    error,
    startCamera,
    stopCamera
  }
}