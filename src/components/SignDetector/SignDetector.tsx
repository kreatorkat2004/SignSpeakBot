import { useEffect } from 'react'
import { useTensorFlow } from '@/hooks/useTensorFlow'
import { useMediaPipe } from '@/hooks/useMediaPipe'

interface SignDetectorProps {
  onSignDetected: (sign: string, confidence: number) => void;
  isActive: boolean;
}

const SignDetector: React.FC<SignDetectorProps> = ({
  onSignDetected,
  isActive
}) => {
  const { model, isLoaded: tfLoaded } = useTensorFlow()
  const { hands, isLoaded: mpLoaded } = useMediaPipe()

  useEffect(() => {
    if (!isActive || !tfLoaded || !mpLoaded || !model || !hands?.length) {
      return
    }

    const detectSign = async () => {
      try {
        const hand = hands[0] 
        const features = hand.landmarks.flatMap(landmark => [
          landmark.x,
          landmark.y,
          landmark.z || 0
        ])

        const normalizedFeatures = features.map(f => f / 100)

        const inputTensor = model.tensor2d([normalizedFeatures], [1, features.length])
        
        const prediction = await model.predict(inputTensor) as any
        const probabilities = await prediction.data()
        
        let maxProb = 0
        let maxIndex = 0
        for (let i = 0; i < probabilities.length; i++) {
          if (probabilities[i] > maxProb) {
            maxProb = probabilities[i]
            maxIndex = i
          }
        }

        const signLabels = [
          'Hello', 'Thank You', 'Please', 'Sorry', 'Yes', 'No',
          'Good', 'Bad', 'Help', 'Stop', 'Go', 'Come', 'Eat',
          'Drink', 'Sleep', 'Work', 'Home', 'School', 'Friend',
          'Family', 'Love', 'Happy', 'Sad', 'Angry', 'Surprised'
        ]
        
        const detectedSign = signLabels[maxIndex] || 'Unknown'
        
        if (maxProb > 0.6) {
          onSignDetected(detectedSign, maxProb)
        }

        inputTensor.dispose()
        prediction.dispose()
      } catch (error) {
        console.error('Sign detection error:', error)
      }
    }

    const interval = setInterval(detectSign, 100)
    return () => clearInterval(interval)
  }, [isActive, tfLoaded, mpLoaded, model, hands, onSignDetected])

  return null 
}

export default SignDetector