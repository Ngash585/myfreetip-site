import { motion } from 'framer-motion'
import { type TimerState } from './timerUtils'
import { BOOKMAKERS } from '@/constants/bookmakers'

interface CTAButtonProps {
  bookieName: string
  bookieId?: string
  affiliateUrl: string | null | undefined
  timerState: TimerState
  /** When false, the button is blurred and clicking fires onWallTrigger. */
  showFull: boolean
  onWallTrigger: () => void
}

export function CTAButton({ bookieName, bookieId, affiliateUrl, timerState, showFull, onWallTrigger }: CTAButtonProps) {
  const expired = timerState === 'expired'

  // ── Locked state ──────────────────────────────────────────────────────────────
  if (!showFull) {
    return (
      <div style={{ margin: '8px 14px 14px', position: 'relative' }}>
        {/* Blurred ghost of the real button */}
        <div
          style={{
            background: '#080A2D',
            borderRadius: '12px',
            padding: '13px 20px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#FFFFFF',
            filter: 'blur(4px)',
            pointerEvents: 'none',
            userSelect: 'none',
            textAlign: 'center',
          }}
        >
          Open {bookieName} &amp; Back This →
        </div>
        {/* Clickable lock overlay */}
        <button
          type="button"
          onClick={onWallTrigger}
          className="absolute inset-0 flex items-center justify-center gap-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
        >
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1D1D1D' }}>Unlock to back this tip</span>
        </button>
      </div>
    )
  }

  // ── Unlocked state ────────────────────────────────────────────────────────────
  const label = expired
    ? 'Code Expired — See next pick ↓'
    : `Open ${bookieName} & Back This →`

  const brand = bookieId ? BOOKMAKERS[bookieId] : undefined
  const bg = expired ? '#CCCCCC' : (brand?.activeBg ?? '#080A2D')
  const textColor = expired ? '#FFFFFF' : (brand?.activeText ?? '#FFFFFF')
  const href = brand?.affiliateUrl ?? affiliateUrl ?? '#'

  return (
    <div style={{ margin: '8px 14px 14px' }}>
      <motion.a
        href={expired ? undefined : href}
        target={expired ? undefined : '_blank'}
        rel={expired ? undefined : 'noopener noreferrer sponsored'}
        className="join-btn relative block w-full text-center font-medium transition-opacity overflow-hidden"
        style={{
          background: bg,
          color: textColor,
          borderRadius: '12px',
          padding: '13px 20px',
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
