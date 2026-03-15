
import React, { useEffect, useRef, useId } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const symbolMap: { [key: string]: string } = {
  'Apple': 'NASDAQ:AAPL',
  'NVIDIA': 'NASDAQ:NVDA',
  'Tesla': 'NASDAQ:TSLA',
  'Microsoft': 'NASDAQ:MSFT',
  'Amazon': 'NASDAQ:AMZN',
  'Google': 'NASDAQ:GOOGL',
  'Meta': 'NASDAQ:META',
  'Petróleo Brent': 'TVC:UKOIL',
  'Oro': 'TVC:GOLD',
  'Bitcoin': 'BINANCE:BTCUSDT',
  'Ethereum': 'BINANCE:ETHUSDT',
  'S&P 500': 'SPX',
  'Nasdaq 100': 'NAS100',
  'Dow Jones': 'DJI',
  'EUR/USD': 'FX:EURUSD',
  'GBP/USD': 'FX:GBPUSD',
  'USD/JPY': 'FX:USDJPY',
};

export const MarketChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '');
  const containerId = `tv_chart_${uniqueId}`;

  useEffect(() => {
    const initWidget = () => {
      if (containerRef.current && window.TradingView) {
        const tvSymbol = symbolMap[symbol] || symbol;
        
        new window.TradingView.widget({
          "autosize": true,
          "symbol": tvSymbol,
          "interval": "H",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "es",
          "toolbar_bg": "#f1f3f6",
          "enable_publishing": false,
          "hide_top_toolbar": true,
          "save_image": false,
          "container_id": containerId,
          "backgroundColor": "rgba(15, 23, 42, 0.5)",
          "gridColor": "rgba(30, 41, 59, 0.5)",
        });
      }
    };

    if (!window.TradingView) {
      const script = document.createElement('script');
      script.id = 'tradingview-widget-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      initWidget();
    }
  }, [symbol, containerId]);

  return (
    <div className="h-80 w-full bg-slate-900/50 rounded-3xl p-1 border border-slate-800 overflow-hidden shadow-inner">
      <div id={containerId} ref={containerRef} className="w-full h-full" />
    </div>
  );
};
