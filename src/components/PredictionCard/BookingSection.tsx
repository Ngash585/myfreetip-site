import type { TipCard } from '@/lib/api'
import { type TimerState } from './timerUtils'
import { PlatformTabs } from './PlatformTabs'
import { CodeBlock } from './CodeBlock'
import { HowToUse } from './HowToUse'
import { CTAButton } from './CTAButton'

interface BookingSectionProps {
  bookies: TipCard['bookies']
  selectedBookieId: string | number
  onBookieChange: (id: string | number) => void
  activeBookie: TipCard['bookies'][0] | undefined
  timerState: TimerState
  showFull: boolean
  onWallTrigger: () => void
  onCopy: () => void
}

export function BookingSection({
  bookies,
  selectedBookieId,
  onBookieChange,
  activeBookie,
  timerState,
  showFull,
  onWallTrigger,
  onCopy,
}: BookingSectionProps) {
  const bookieName = activeBookie?.name ?? 'Bookie'
  const bookieId = activeBookie?.id ? String(activeBookie.id) : undefined
  const affiliateUrl = activeBookie?.deeplink_url ?? activeBookie?.signup_url

  return (
    <div className="pb-1">
      <PlatformTabs
        bookies={bookies}
        selectedId={selectedBookieId}
        onSelect={onBookieChange}
      />
      <CodeBlock
        activeBookie={activeBookie}
        timerState={timerState}
        showFull={showFull}
        onWallTrigger={onWallTrigger}
        onCopy={onCopy}
      />
      {showFull && <HowToUse bookieName={bookieName} />}
      <CTAButton
        bookieName={bookieName}
        bookieId={bookieId}
        affiliateUrl={affiliateUrl}
        timerState={timerState}
        showFull={showFull}
        onWallTrigger={onWallTrigger}
      />
    </div>
  )
}
