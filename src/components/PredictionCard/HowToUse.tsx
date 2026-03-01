import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface HowToUseProps {
  bookieName: string
}

export function HowToUse({ bookieName }: HowToUseProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-3 mt-2 rounded-lg overflow-hidden border border-white/10 bg-[var(--surface)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-3 hover:bg-white/5"
      >
        <span className="text-red-500 font-bold text-base">?</span>
        <span className="flex-1 text-left text-sm text-[var(--muted)]">
          How to use this code
        </span>
        <ChevronDown
          className={[
            'w-4 h-4 text-[var(--muted)] transition-transform',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-3 border-t border-white/10 bg-black/10">
              <Step n={1}>
                <strong className="text-[var(--text)]">Copy the code above</strong> — tap the
                button to copy it
              </Step>
              <Step n={2}>
                <strong className="text-[var(--text)]">Open {bookieName}</strong> — find
                “Booking Code” in the menu
              </Step>
              <Step n={3}>
                <strong className="text-[var(--text)]">Paste the code</strong> — your
                selections load automatically
              </Step>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 mb-3 last:mb-0">
      <div className="w-5 h-5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold grid place-items-center flex-shrink-0">
        {n}
      </div>
      <div className="text-[12px] text-[var(--muted)] leading-relaxed">{children}</div>
    </div>
  )
}