import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Zap, Volume2, VolumeX, Save } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useAuth } from '@/hooks/useAuth'
import { ShareDialog } from '@/components/ShareDialog'
import { OnboardingTutorial } from '@/components/OnboardingTutorial'
import { emotions } from '@/lib/emotions'
import { Entry } from '@/lib/types'
import { Progress } from "@/components/ui/progress"

const DynamicCanvas = dynamic(() => import('@/components/EmotionCanvas'), { ssr: false })
const EmotionChart = lazy(() => import('@/components/EmotionChart'))

export default function EmotionDiary() {
  const [selectedEmotion, setSelectedEmotion] = useState(emotions[0])
  const [points, setPoints] = useLocalStorage('emotionPoints', 0)
  const [level, setLevel] = useLocalStorage('emotionLevel', 1)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [powerActive, setPowerActive] = useState(false)
  const [powerCooldown, setPowerCooldown] = useState(0)
  const [isMuted, setIsMuted] = useLocalStorage('isMuted', false)
  const [diaryEntry, setDiaryEntry] = useState('')
  const [savedEntries, setSavedEntries] = useLocalStorage<Entry[]>('diaryEntries', [])
  const [activeTab, setActiveTab] = useState('diary')
  const dateInputRef = useRef<HTMLInputElement>(null)
  const { user, signIn, signOut } = useAuth()
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    const cooldownInterval = setInterval(() => {
      setPowerCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)

    if (dateInputRef.current) {
      dateInputRef.current.valueAsDate = new Date()
    }

    if (user && !localStorage.getItem('onboardingComplete')) {
      setShowOnboarding(true)
    }

    return () => clearInterval(cooldownInterval)
  }, [user])

  const playSound = useCallback((sound: string) => {
    if (!isMuted) {
      const audio = new Audio(sound)
      audio.play().catch(error => console.error("Audio playback failed:", error))
    }
  }, [isMuted])

  const handleSaveEmotion = () => {
    const newPoints = points + selectedEmotion.points
    setPoints(newPoints)
    if (newPoints >= level * 50) {
      setLevel(prevLevel => prevLevel + 1)
      setShowLevelUp(true)
      playSound('/sounds/level-up.mp3')
      setTimeout(() => setShowLevelUp(false), 3000)
    }
    playSound(selectedEmotion.sound)
  }

  const activatePower = () => {
    if (powerCooldown === 0) {
      setPowerActive(true)
      setPowerCooldown(30)
      playSound('/sounds/power-activate.mp3')
      setTimeout(() => {
        setPowerActive(false)
        playSound('/sounds/power-deactivate.mp3')
      }, 5000)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const saveDiaryEntry = () => {
    if (diaryEntry.trim() !== '' && dateInputRef.current) {
      const date = dateInputRef.current.value
      setSavedEntries(prev => [...prev, { date, emotion: selectedEmotion, entry: diaryEntry }])
      setDiaryEntry('')
      playSound('/sounds/save-entry.mp3')
    }
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const completeOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboardingComplete', 'true')
  }

  const generateShareUrl = () => {
    const url = `${window.location.origin}/shared/${btoa(JSON.stringify(savedEntries))}`
    setShareUrl(url)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Share link copied to clipboard!')
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen text-gray-100">
      <style jsx global>{`
        body {
          cursor: none;
        }
        .custom-cursor {
          mix-blend-mode: difference;
        }
        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
          .custom-cursor {
            display: none;
          }
        }
      `}</style>
      
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Emotion Diary
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-500"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Today's Emotion</h2>
          <div className="mb-4">
            <Label htmlFor="date" className="text-lg text-purple-300">Date</Label>
            <input
              type="date"
              id="date"
              ref={dateInputRef}
              className="w-full p-2 mt-1 bg-gray-700 text-white rounded border border-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {emotions.map((emotion) => (
              <motion.button
                key={emotion.color}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
                  selectedEmotion.color === emotion.color
                    ? 'bg-purple-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => {
                  setSelectedEmotion(emotion)
                  playSound(emotion.sound)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-10 h-10 rounded-full mb-2"
                  style={{ backgroundColor: emotion.color }}
                ></div>
                <span className="text-sm">{emotion.name}</span>
              </motion.button>
            ))}
          </div>

          <Button onClick={handleSaveEmotion} className="w-full bg-purple-600 text-white hover:bg-purple-700 mb-4 transition-colors duration-200">
            Save Emotion
          </Button>

          <Button 
            onClick={activatePower} 
            disabled={powerCooldown > 0}
            className="w-full bg-yellow-500 text-black hover:bg-yellow-600 disabled:opacity-50 transition-colors duration-200"
          >
            {powerCooldown > 0 ? `Cooldown: ${powerCooldown}s` : 'Activate Emotion Power'}
          </Button>
        </motion.div>

        <motion.div 
          className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-500"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Your Progress</h2>
          <div className="flex items-center mb-2">
            <Trophy className="mr-2 text-yellow-400" />
            <span className="text-lg">Level {level}</span>
          </div>
          <Progress value={(points % (level * 50)) / (level * 50) * 100} className="mb-2" />
          <p className="text-sm mb-4">Points: {points} / {level * 50}</p>
          <div className="bg-gray-700 rounded-lg p-4 border border-purple-500">
            <h3 className="text-xl font-bold mb-2 text-yellow-400">Current Power</h3>
            <div className="flex items-center">
              <Zap className="mr-2 text-yellow-400" />
              <span>{selectedEmotion.power}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="diary">Daily Diary</TabsTrigger>
          <TabsTrigger value="history">Emotion History</TabsTrigger>
        </TabsList>
        <TabsContent value="diary">
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Daily Diary</h2>
            <Textarea
              value={diaryEntry}
              onChange={(e) => setDiaryEntry(e.target.value)}
              placeholder="Write about your day and emotions..."
              className="w-full h-32 mb-4 bg-gray-700 text-white border border-purple-500 rounded"
            />
            <Button onClick={saveDiaryEntry} className="w-full bg-green-600 text-white hover:bg-green-700 transition-colors duration-200">
              <Save className="mr-2" />
              Save Entry
            </Button>
          </motion.div>
        </TabsContent>
        <TabsContent value="history">
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-500"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Diary Entries</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {savedEntries.map((entry, index) => (
                <motion.div 
                  key={index} 
                  className="bg-gray-700 rounded-lg p-4 border border-purple-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{entry.date}</span>
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: entry.emotion.color }}
                      title={entry.emotion.name}
                    ></div>
                  </div>
                  <p className="text-sm">{entry.entry}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      <Suspense fallback={<div>Loading...</div>}>
        <DynamicCanvas emotion={selectedEmotion} powerActive={powerActive} />
      </Suspense>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-purple-600 text-white px-6 py-3 rounded-full text-2xl font-bold">
              Level Up! You're now level {level}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleMute}
        className="fixed bottom-4 right-4 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </Button>

      <div className="fixed top-4 right-4 flex gap-2">
        {user ? (
          <>
            <Button onClick={handleShare}>Share</Button>
            <Button onClick={signOut}>Sign Out</Button>
          </>
        ) : (
          <Button onClick={signIn}>Sign In</Button>
        )}
      </div>

      <div className="mt-8">
        <Button onClick={generateShareUrl}>Generate Share Link</Button>
        {shareUrl && (
          <div className="mt-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            <Button onClick={copyToClipboard} className="mt-2">Copy Link</Button>
          </div>
        )}
      </div>

      <ShareDialog open={showShareDialog} onClose={() => setShowShareDialog(false)} user={user} />
      {showOnboarding && <OnboardingTutorial onComplete={completeOnboarding} />}
    </div>
  )
}