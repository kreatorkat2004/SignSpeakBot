import { useRef, useEffect, useState } from 'react'
import { useCamera } from '@/hooks/useCamera'

interface CameraComponentProps {
  isActive: boolean;
  onFrame?: (frame: HTMLVideoElement) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  isActive,
  onFrame
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { stream, error, startCamera, stopCamera } = useCamera()

  useEffect(() => {
    if (isActive) {
      startCamera()
    } else {
      stopCamera()
    }
  }, [isActive, startCamera, stopCamera])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (!isActive || !onFrame || !videoRef.current) return

    const interval = setInterval(() => {
      if (videoRef.current) {
        onFrame(videoRef.current)
      }
    }, 33) 
    return () => clearInterval(interval)
  }, [isActive, onFrame])

  if (error) {
    return (
      <div className="video-container">
        <div className="flex items-center justify-center h-64 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 font-medium">Camera Error</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video-element"
        autoPlay
        playsInline
        muted
        style={{ transform: 'scaleX(-1)' }}
      />
      {!stream && isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Connecting to camera...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CameraComponent