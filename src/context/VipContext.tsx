import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import {
  isUnlocked as checkUnlocked,
  tryViewTip,
  hasViewedTip,
  incrementCopies,
  getCopyCount,
  getWallStage,
  setWallStage,
  unlock,
  type WallStage,
} from '@/lib/vip'
import { VipWallPopup } from '@/components/VipWall/VipWallPopup'
import { saveVipEmail } from '@/lib/api'

interface VipContextValue {
  unlocked: boolean
  openWall: () => void
  tryView: (cardId: string) => boolean
  hasViewed: (cardId: string) => boolean
  onCopy: () => void
  copyCount: number
}

const VipContext = createContext<VipContextValue>({
  unlocked: false,
  openWall: () => {},
  tryView: () => true,
  hasViewed: () => false,
  onCopy: () => {},
  copyCount: 0,
})

export function VipProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(checkUnlocked)
  const [wallOpen, setWallOpen] = useState(false)
  const [stage, setStage] = useState<WallStage>(getWallStage)
  const [copyCount, setCopyCount] = useState(getCopyCount)

  const openWall = useCallback(() => setWallOpen(true), [])

  const tryView = useCallback((cardId: string): boolean => {
    return tryViewTip(cardId)
  }, [])

  const hasViewed = useCallback((cardId: string): boolean => {
    return hasViewedTip(cardId)
  }, [])

  const onCopy = useCallback(() => {
    const n = incrementCopies()
    setCopyCount(n)
  }, [])

  function handleDownloadTap() {
    setWallStage('returning')
    setStage('returning')
  }

  function handleGoBack() {
    setWallStage('')
    setStage('')
  }

  async function handleUnlock(email: string) {
    // Fire-and-forget Supabase insert; unlock locally regardless
    saveVipEmail(email).catch(() => {})
    unlock(email)
    setUnlocked(true)
    setStage('unlocked')
    setWallOpen(false)
  }

  return (
    <VipContext.Provider value={{ unlocked, openWall, tryView, hasViewed, onCopy, copyCount }}>
      {children}
      {wallOpen && (
        <VipWallPopup
          stage={stage}
          onClose={() => setWallOpen(false)}
          onDownloadTap={handleDownloadTap}
          onGoBack={handleGoBack}
          onUnlock={handleUnlock}
        />
      )}
    </VipContext.Provider>
  )
}

export function useVip() {
  return useContext(VipContext)
}
