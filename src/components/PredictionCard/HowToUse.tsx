import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface HowToUseProps {
  bookieName: string
}

export function HowToUse({ bookieName }: HowToUseProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ margin: '6px 14px 0' }}
      style={{ background: '#F2EEE9', border: '1px solid rgba(29,29,29,0.08)' }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 transition-colors hover:bg-black/[0.02]"
      >
        <span className="font-medium text-sm" style={{ color: '#3DB157' }}>?</span>
        <span className="flex-1 text-left text-sm" style={{ color: '#4F4841', fontWeight: 300 }}>
          How to use this code
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          style={{ color: '#777777' }}
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
            <div
              className="px-4 pb-4 pt-3"
              style={{ borderTop: '1px solid rgba(29,29,29,0.08)' }}
            >
              <Step n={1}>
                <strong style={{ color: '#1D1D1D', fontWeight: 500 }}>Copy the code above</strong>
                {' '}— tap the button to copy it
              </Step>
              <Step n={2}>
                <strong style={{ color: '#1D1D1D', fontWeight: 500 }}>Open {bookieName}</strong>
                {' '}— find "Booking Code" in the menu
              </Step>
              <Step n={3}>
                <strong style={{ color: '#1D1D1D', fontWeight: 500 }}>Paste the code</strong>
                {' '}— your selections load automatically
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
    <div className="flex items-start gap-3 mb-3 last:mb-0">
      <div
        className="w-5 h-5 rounded-full text-[10px] font-medium grid place-items-center flex-shrink-0"
        style={{ background: '#EAF7EE', border: '1px solid rgba(61,177,87,0.30)', color: '#2D9A47' }}
      >
        {n}
      </div>
      <div className="text-[13px] leading-relaxed" style={{ color: '#4F4841', fontWeight: 300 }}>
        {children}
      </div>
    </div>
  )
}
