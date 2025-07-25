import { useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Volume2 } from 'lucide-react'

interface TranslationDisplayProps {
  detectedSigns: string[];
  currentSign: string;
  confidence: number;
}

const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  detectedSigns,
  currentSign,
  confidence
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [detectedSigns])

  const handleCopy = () => {
    const text = detectedSigns.join(' ')
    navigator.clipboard.writeText(text)
  }

  const handleSpeak = () => {
    const text = detectedSigns.join(' ')
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const handleExport = () => {
    const text = detectedSigns.join(' ')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sign-translation-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Translation</h3>
        <div className="flex gap-2">
          <Button
            onClick={handleSpeak}
            variant="outline"
            size="sm"
            disabled={detectedSigns.length === 0}
          >
            <Volume2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            disabled={detectedSigns.length === 0}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            disabled={detectedSigns.length === 0}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {currentSign && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Detecting: {currentSign}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-300">
              {Math.round(confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50"
      >
        {detectedSigns.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-center">
              Start detection to see translations here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {detectedSigns.map((sign, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded shadow-sm"
              >
                <span className="text-xs text-gray-500 min-w-[3rem]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-medium">{sign}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {detectedSigns.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            Sentence:
          </h4>
          <p className="text-green-700 dark:text-green-300">
            {detectedSigns.join(' ')}
          </p>
        </div>
      )}
    </Card>
  )
}

export default TranslationDisplay