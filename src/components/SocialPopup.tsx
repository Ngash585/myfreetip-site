import { useEffect, useState } from 'react'
import { useVip } from '@/context/VipContext'
import { getSocialShown, markSocialShown } from '@/lib/vip'

const SOCIALS = [
  {
    platform: 'telegram',
    milestone: 5,
    heading: 'Enjoying MyFreeTip?',
    body: 'Get tips on Telegram before they go live on the site.',
    cta: 'Join Telegram →',
    bg: '#2CA5E0',
    // Replace these placeholder URLs with real channel/page links before deploying
    url: 'https://t.me/myfreetip',
  },
  {
    platform: 'facebook',
    milestone: 10,
    heading: 'Follow us on Facebook',
    body: 'Daily tips, results and analysis in your feed.',
    cta: 'Follow on Facebook →',
    bg: '#1877F2',
    url: 'https://facebook.com/myfreetip',
  },
  {
    platform: 'twitter',
    milestone: 15,
    heading: "We're on Twitter too",
    body: 'Quick updates, live results and match alerts.',
    cta: 'Follow on Twitter →',
    bg: '#000000',
    url: 'https://twitter.com/myfreetip',
  },
] as const

type SocialEntry = (typeof SOCIALS)[number]

export function SocialPopup() {
  const { unlocked, copyCount } = useVip()
  const [current, setCurrent] = useState<SocialEntry | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!unlocked) return
    const shown = getSocialShown()
    // Find the highest-milestone platform hit that hasn't been shown yet
    for (const social of [...SOCIALS].reverse()) {
      if (copyCount >= social.milestone && !shown.includes(social.platform)) {
        setCurrent(social)
        setVisible(true)
        return
      }
    }
  }, [unlocked, copyCount])

  function dismiss() {
    if (current) markSocialShown(current.platform)
    setVisible(false)
  }

  if (!current || !visible) return null

  return (
    <div
      className="fixed left-4 right-4 z-40 rounded-2xl md:left-auto md:right-6 md:max-w-sm"
      style={{
        bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))',
        background: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        border: '1px solid rgba(29,29,29,0.08)',
      }}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug" style={{ color: '#1D1D1D' }}>
            {current.heading}
          </p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: '#4F4841' }}>
            {current.body}
          </p>
          <div className="flex items-center gap-4 mt-3">
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="inline-flex items-center rounded-lg px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: current.bg, minHeight: 36 }}
            >
              {current.cta}
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: '#8a9bb0' }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
