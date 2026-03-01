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
}

export function BookingSection({
  bookies,
  selectedBookieId,
  onBookieChange,
  activeBookie,
  timerState,
}: BookingSectionProps) {
  const bookieName = activeBookie?.name ?? 'Bookie'
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
      />
      <HowToUse bookieName={bookieName} />
      <CTAButton bookieName={bookieName} affiliateUrl={affiliateUrl} timerState={timerState} />
    </div>
  )
}
