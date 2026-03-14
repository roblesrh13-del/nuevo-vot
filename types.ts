
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsRecommendation {
  asset: string;
  action: 'COMPRA' | 'VENTA';
  target: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'Alto' | 'Medio' | 'Bajo';
  sentiment: 'Alcista' | 'Bajista' | 'Neutral';
  date: string;
  recomendacionDirecta?: NewsRecommendation;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TradingSignal {
  asset: string;
  action: 'COMPRA' | 'VENTA';
  entryRange: string;
  takeProfit: string;
  stopLoss: string;
  reasoning: string;
  confidence: number;
  timestamp?: number;
}

export interface MarketAnalysis {
  globalSentiment: string;
  topOpportunities: TradingSignal[];
  newsContext: NewsItem[];
  sources?: GroundingSource[];
}
