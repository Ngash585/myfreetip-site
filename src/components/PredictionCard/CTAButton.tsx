import { motion } from 'framer-motion'
import { type TimerState } from './timerUtils'
import { BOOKMAKERS } from '@/constants/bookmakers'

interface CTAButtonProps {
  bookieName: string
  bookieId?: string
  affiliateUrl: string | null | undefined
  timerState: TimerState
}

export function CTAButton({ bookieName, bookieId, affiliateUrl, timerState }: CTAButtonProps) {
  const expired = timerState === 'expired'
  const label = expired
    ? 'Code Expired — See next pick ↓'
    : `Open ${bookieName} & Place Bet →`

  const brand = bookieId ? BOOKMAKERS[bookieId] : undefined
  const bg = expired ? '#CCCCCC' : (brand?.activeBg ?? '#080A2D')
  const textColor = expired ? '#FFFFFF' : (brand?.activeText ?? '#FFFFFF')
  const href = brand?.affiliateUrl ?? affiliateUrl ?? '#'

  return (
    <div className="mx-4 mt-3 mb-4">
      <motion.a
        href={expired ? undefined : href}
        target={expired ? undefined : '_blank'}
        rel={expired ? undefined : 'noopener noreferrer sponsored'}
        className="join-btn relative block w-full text-center font-medium transition-opacity overflow-hidden"
        style={{
          background: bg,
          color: textColor,
          borderRadius: '12px',
          height: '52px',
          lineHeight: '52px',
          fontSize: '16px',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: expired ? 'default' : 'pointer',
          textDecoration: 'none',
        }}
        animate={{
          boxShadow: expired
            ? undefined
            : [
                `0 0 0 0px ${bg}4D`,
                `0 0 0 10px ${bg}00`,
                `0 0 0 0px ${bg}00`,
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
