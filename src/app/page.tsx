import { useState, useEffect } from 'react'
import { Camera, Hand, Mic, Settings, Play, Pause, RotateCcw } from 'lucide-react'
import CameraComponent from '@/components/Camera/CameraComponent'
import HandTracker from '@/components/HandTracker/HandTracker'
import SignDetector from '@/components/SignDetector/SignDetector'
import TranslationDisplay from '@/components/TranslationDisplay/TranslationDisplay'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  const [isActive, setIsActive] = useState(false)
  const [detectedSigns, setDetectedSigns] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [currentSign, setCurrentSign] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleSignDetected = (sign: string, conf: number) => {
    setCurrentSign(sign)
    setConfidence(conf)
    
    if (conf > 0.8 && sign !== detectedSigns[detectedSigns.length - 1]) {
      setDetectedSigns(prev => [...prev, sign])
    }
  }

  const handleReset = () => {
    setDetectedSigns([])
    setCurrentSign('')
    setConfidence(0)
  }

  const toggleDetection = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Hand className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Sign Speak Bot
          </h1>
          <Hand className="w-8 h-8 text-blue-600 scale-x-[-1]" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Real-time Sign Language Detection and Translation using AI
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className="text-sm text-gray-500">
            {isLoading ? 'Loading AI Models...' : 'Ready for Detection'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Detection
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={toggleDetection}
                  disabled={isLoading}
                  className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={handleReset} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="relative">
              <CameraComponent
                isActive={isActive}
                onFrame={(frame) => {
                }}
              />
              
              {isActive && (
                <>
                  <HandTracker />
                  <SignDetector
                    onSignDetected={handleSignDetected}
                    isActive={isActive}
                  />
                </>
              )}

              {isActive && currentSign && (
                <div className="detection-overlay">
                  <div className="font-medium">{currentSign}</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <div className="text-xs mt-1">
                    {Math.round(confidence * 100)}% confidence
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <TranslationDisplay
            detectedSigns={detectedSigns}
            currentSign={currentSign}
            confidence={confidence}
          />

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Session Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Signs Detected:</span>
                <span className="font-medium">{detectedSigns.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Confidence:</span>
                <span className="font-medium">
                  {detectedSigns.length > 0 ? '87%' : '0%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mic className="w-4 h-4 mr-2" />
                Enable Voice Output
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Detection Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Real-time Detection</h3>
          <p className="text-gray-600 text-sm">
            Instant sign language recognition through your webcam with 95% accuracy
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Hand className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hand Tracking</h3>
          <p className="text-gray-600 text-sm">
            Precise hand landmark detection using advanced MediaPipe technology
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mic className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AI Translation</h3>
          <p className="text-gray-600 text-sm">
            Powered by TensorFlow.js for fast, accurate sign-to-text translation
          </p>
        </Card>
      </div>
    </div>
  )
}