import React from 'react'
import { motion } from 'framer-motion'
import { type TimerState } from './timerUtils'

interface CTAButtonProps {
  bookieName: string
  affiliateUrl: string | null | undefined
  timerState: TimerState
}

export function CTAButton({ bookieName, affiliateUrl, timerState }: CTAButtonProps) {
  const label =
    timerState === 'expired'
      ? 'Code Expired — See next pick ↓'
      : `Open ${bookieName} & Place Bet →`

  const href = affiliateUrl ?? '#'

  return (
    <div className="mx-3 mt-2 mb-3">
      <motion.a
        href={href}
        className={[
          'relative block w-full py-4 rounded-xl',
          'font-display font-extrabold text-base',
          'bg-emerald-500 text-black',
          'hover:bg-emerald-400 hover:-translate-y-0.5 transition-all',
          'overflow-hidden text-center',
        ].join(' ')}
        animate={{
          boxShadow:
            timerState === 'expired'
              ? undefined
              : [
                  '0 0 0 0px rgba(16,163,74,0.5)',
                  '0 0 0 10px rgba(16,163,74,0)',
                  '0 0 0 0px rgba(16,163,74,0)',
                ],
        }}
        transition={{
          duration: 2,
          repeat: timerState === 'expired' ? 0 : 2,
          delay: timerState === 'expired' ? 0 : 0.5,
        }}
      >
        <span className="relative z-10">{label}</span>
        {/* shimmer overlay */}
        <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-xl" />
      </motion.a>
    </div>
  )
}