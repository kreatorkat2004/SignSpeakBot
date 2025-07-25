import { useState, useEffect, useRef } from 'react'

interface HandLandmark {
  x: number;
  y: number;
  z?: number;
}

interface Hand {
  landmarks: HandLandmark[];
  handedness: string;
}

export const useMediaPipe = () => {
  const [hands, setHands] = useState<Hand[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const handsRef = useRef<any>(null)

  useEffect(() => {
    const loadMediaPipe = async () => {
      try {

        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockHands = {
          onResults: (callback: (results: any) => void) => {
            setInterval(() => {
              if (Math.random() > 0.7) { 
                const mockResults = {
                  multiHandLandmarks: [
                    Array.from({ length: 21 }, (_, i) => ({
                      x: 0.3 + Math.random() * 0.4, 
                      y: 0.3 + Math.random() * 0.4,
                      z: Math.random() * 0.1 - 0.05
                    }))
                  ],
                  multiHandedness: [{ label: 'Right' }]
                }
                callback(mockResults)
              } else {
                callback({ multiHandLandmarks: [], multiHandedness: [] })
              }
            }, 100)
          }
        }

        handsRef.current = mockHands
        
        mockHands.onResults((results: any) => {
          const detectedHands: Hand[] = []
          
          if (results.multiHandLandmarks && results.multiHandedness) {
            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
              detectedHands.push({
                landmarks: results.multiHandLandmarks[i],
                handedness: results.multiHandedness[i]?.label || 'Unknown'
              })
            }
          }
          
          setHands(detectedHands)
        })

        setIsLoaded(true)
      } catch (err) {
        setError('Failed to load MediaPipe')
        console.error('MediaPipe error:', err)
      }
    }

    loadMediaPipe()
  }, [])

  return {
    hands,
    isLoaded,
    error
  }
}