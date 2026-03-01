import { motion } from 'framer-motion'
import { type TimerState } from './timerUtils'

interface CTAButtonProps {
  bookieName: string
  affiliateUrl: string | null | undefined
  timerState: TimerState
}

export function CTAButton({ bookieName, affiliateUrl, timerState }: CTAButtonProps) {
  const expired = timerState === 'expired'
  const label = expired
    ? 'Code Expired — See next pick ↓'
    : `Open ${bookieName} & Place Bet →`

  return (
    <div className="mx-4 mt-3 mb-4">
      <motion.a
        href={affiliateUrl ?? '#'}
        className="relative block w-full text-center font-medium text-white transition-opacity overflow-hidden"
        style={{
          background: expired ? '#CCCCCC' : '#080A2D',
          borderRadius: '12px',
          height: '52px',
          lineHeight: '52px',
          fontSize: '16px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: expired ? 'default' : 'pointer',
        }}
        animate={{
          boxShadow: expired
            ? undefined
            : [
                '0 0 0 0px rgba(8,10,45,0.3)',
                '0 0 0 10px rgba(8,10,45,0)',
                '0 0 0 0px rgba(8,10,45,0)',
              ],
        }}
        transition={{ duration: 2, repeat: expired ? 0 : 2, delay: expired ? 0 : 0.5 }}
      >
        <span className="relative z-10">{label}</span>
        {!expired && (
          <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-xl" />
        )}
      </motion.a>
    </div>
  )
}
