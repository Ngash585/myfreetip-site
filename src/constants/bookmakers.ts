export type BookmakerConfig = {
  name: string
  dot: string
  activeBg: string
  activeText: string
  affiliateUrl: string
  webUrl?: string
}

export const BOOKMAKERS: Record<string, BookmakerConfig> = {
  paripesa: {
    name: 'Paripesa',
    dot: '#1A56DB',
    activeBg: '#1A56DB',
    activeText: '#FFFFFF',
    affiliateUrl: 'https://combodef.com/L?tag=d_5338871m_45611c_&site=5338871&ad=45611',
    webUrl: 'https://combodef.com/L?tag=d_5338871m_60651c_&site=5338871&ad=60651',
  },
  '1xbet': {
    name: '1xBet',
    dot: '#1E3A6E',
    activeBg: '#1E3A6E',
    activeText: '#FFFFFF',
    affiliateUrl: 'https://refpa483247.pro/L?tag=d_4716502m_1573c_&site=4716502&ad=1573',
  },
  melbet: {
    name: 'Melbet',
    dot: '#F5A623',
    activeBg: '#F5A623',
    activeText: '#1A1A1A',
    affiliateUrl: 'https://refpa3665.com/L?tag=d_4720077m_45415c_&site=4720077&ad=45415',
  },
}
