interface CardHeaderProps {
  title: string
  type?: string | null
}

export function CardHeader({ title, type }: CardHeaderProps) {
  const badge = (type && type.trim()) || 'MFT'

  return (
    <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-[#0B2545] to-[#162E50]">
      <div className="font-display font-extrabold text-[15px] text-white leading-none">
        {title}
      </div>
      <div className="bg-blue-600 text-white font-mono text-[10px] px-2 py-0.5 rounded tracking-wide">
        {badge}
      </div>
    </div>
  )
}