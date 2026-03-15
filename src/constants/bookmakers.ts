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
    affiliateUrl: 'https://paripesa.bet/myfreetipapp',
    webUrl: 'https://paripesa.bet/myfreetip',
  },
  '1xbet': {
    name: '1xBet',
    dot: '#1E3A6E',
    activeBg: '#1E3A6E',
    activeText: '#FFFFFF',
    affiliateUrl: 'https://refpa14435.com/L?tag=d_4659871m_1599c_&site=4659871&ad=1599',
  },
  melbet: {
    name: 'Melbet',
    dot: '#F5A623',
    activeBg: '#F5A623',
    activeText: '#1A1A1A',
    affiliateUrl: 'https://refpa3665.com/L?tag=d_5333273m_45415c_&site=5333273&ad=45415',
  },
}
