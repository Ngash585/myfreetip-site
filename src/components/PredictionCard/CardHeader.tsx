interface CardHeaderProps {
  title: string
  type?: string | null
}

export function CardHeader({ title, type }: CardHeaderProps) {
  const typeLabel = (type && type.trim()) ? type.trim() : null

  return (
    <div className="px-6 pt-6 pb-2 flex items-center justify-between">
      <span
        className="text-[11px] font-medium uppercase tracking-[0.10em]"
        style={{ color: '#777777' }}
      >
        {title}
      </span>
      {typeLabel && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-md capitalize"
          style={{
            background: '#EAF7EE',
            color: '#2D9A47',
            border: '1px solid rgba(61,177,87,0.25)',
          }}
        >
          {typeLabel}
        </span>
      )}
    </div>
  )
}
