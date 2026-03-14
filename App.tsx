
import React, { useState, useEffect } from 'react';
import { MarketAnalysis, TradingSignal } from './types';
import { getMarketAnalysis } from './services/gemini';
import { MarketChart } from './components/MarketChart';
import { 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  Zap, 
  RefreshCw, 
  Search,
  Key,
  MessageSquareText,
  DollarSign,
  ChevronRight,
  PlusCircle,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<TradingSignal[]>([]);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      }
    };
    checkApiKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
      // Refresh analysis if it was empty
      if (!analysis) {
        fetchAnalysis();
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('plus_trader_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const fetchAnalysis = async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketAnalysis(query);
      setAnalysis(data);
    } catch (err: any) {
      const errorMessage = err.message || '';
      if (errorMessage.includes('Requested entity was not found') || errorMessage.includes('API_KEY')) {
        setHasApiKey(false);
        setError('Configura tu API Key de Gemini para continuar.');
      } else {
        setError('Error de conexión con el motor de IA. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const toggleWatchlist = (signal: TradingSignal) => {
    const isPresent = watchlist.some(s => s.asset === signal.asset && s.timestamp === signal.timestamp);
    let newWatchlist;
    if (isPresent) {
      newWatchlist = watchlist.filter(s => !(s.asset === signal.asset && s.timestamp === signal.timestamp));
    } else {
      newWatchlist = [...watchlist, { ...signal, timestamp: Date.now() }];
    }
    setWatchlist(newWatchlist);
    localStorage.setItem('plus_trader_watchlist', JSON.stringify(newWatchlist));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchAnalysis(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 font-sans pb-20">
      
      {/* Ticker de Mercado */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 overflow-hidden whitespace-nowrap">
        <div className="flex animate-[marquee_30s_linear_infinite] gap-12 items-center">
          {[
            { n: "ORO", p: "2,045.20", c: "+0.45%" },
            { n: "PETRÓLEO BRENT", p: "82.14", c: "-1.20%" },
            { n: "NASDAQ 100", p: "17,850.40", c: "+0.85%" },
            { n: "EUR/USD", p: "1.0842", c: "-0.15%" },
            { n: "BITCOIN", p: "64,210.00", c: "+2.10%" },
            { n: "APPLE", p: "189.20", c: "-0.40%" },
            { n: "S&P 500", p: "5,120.30", c: "+0.30%" }
          ].map((m, i) => (
            <div key={i} className="flex gap-2 items-center text-xs font-bold">
              <span className="text-slate-400">{m.n}:</span>
              <span className="text-white">{m.p}</span>
              <span className={m.c.startsWith('+') ? 'text-green-400' : 'text-red-400'}>{m.c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navegación */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-black tracking-tight text-white uppercase">
              Plus<span className="text-blue-500">Trader</span> <span className="text-[10px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded ml-2">PREDICCIÓN GEOPOLÍTICA</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {!hasApiKey && (
              <button 
                onClick={handleOpenKeySelector}
                className="flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Configurar API
              </button>
            )}
            <button 
              onClick={handleOpenKeySelector}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              title="Configurar API Key"
            >
              <Key className="w-5 h-5" />
            </button>
            <button 
              onClick={() => fetchAnalysis()}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Plus500 Live
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {!hasApiKey && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Se requiere API Key de Gemini</h3>
                <p className="text-sm text-slate-400">Para usar las funciones avanzadas de IA, necesitas configurar una API Key de un proyecto de Google Cloud con facturación habilitada.</p>
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-amber-500 hover:underline mt-1 inline-block">Más información sobre facturación</a>
              </div>
            </div>
            <button 
              onClick={handleOpenKeySelector}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap"
            >
              CONFIGURAR AHORA
            </button>
          </div>
        )}
        
        {/* Panel de Análisis Directo */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/30 to-slate-900 p-8 rounded-3xl border border-blue-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <MessageSquareText className="text-blue-400" />
                Dime el evento y te daré la orden
              </h2>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: Ataque en Venezuela o nuevos aranceles a China..." 
                  className="flex-1 bg-slate-950/80 border border-slate-700 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'GENERAR ORDEN'}
                </button>
              </form>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-center">
             <div className="flex items-center gap-2 text-blue-400 mb-2">
               <TrendingUp className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Sentimiento Actual</span>
             </div>
             <p className="text-slate-300 italic text-sm leading-relaxed">
               {analysis?.globalSentiment || "Analizando el flujo de noticias globales en tiempo real..."}
             </p>
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
              <DollarSign className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-white uppercase tracking-tighter">Buscando oportunidades de inversión...</p>
              <p className="text-slate-500 text-sm mt-2">Correlacionando eventos geopolíticos con activos de Plus500</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* EVENTOS Y ÓRDENES DIRECTAS */}
            <div className="lg:col-span-4 space-y-8">
              <section className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800">
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Eventos y Acciones
                </h3>
                
                <div className="space-y-8">
                  {analysis?.newsContext.map((news, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-slate-800">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-950"></div>
                      <div className="mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          news.impact === 'Alto' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          Impacto {news.impact}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-sm mb-2">{news.title}</h4>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-3">{news.summary}</p>
                      
                      {news.recomendacionDirecta && (
                        <div className="bg-slate-950 rounded-2xl p-4 border border-blue-500/20 shadow-xl">
                          <p className="text-[10px] font-black text-blue-500 uppercase mb-2">Orden de Mercado IA</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-black text-white">{news.recomendacionDirecta.asset}</p>
                              <p className="text-[10px] text-slate-500">Obj: {news.recomendacionDirecta.target}</p>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-lg font-black text-xs ${
                              news.recomendacionDirecta.action === 'COMPRA' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {news.recomendacionDirecta.action === 'COMPRA' ? <ArrowUpRight className="w-3 h-3"/> : <ArrowDownRight className="w-3 h-3"/>}
                              {news.recomendacionDirecta.action}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {analysis?.sources && analysis.sources.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <h5 className="text-[10px] font-bold text-slate-600 uppercase mb-3">Fuentes Verificadas</h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.sources.slice(0, 3).map((src, i) => (
                        <a key={i} href={src.uri} target="_blank" className="text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded-full flex items-center gap-1">
                          Fuente {i+1} <ExternalLink className="w-2 h-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800">
                <h3 className="text-sm font-black text-slate-500 uppercase mb-4 flex items-center gap-2">
                  <Bookmark className="w-4 h-4" /> Mi Cartera IA
                </h3>
                {watchlist.length === 0 ? (
                  <p className="text-xs text-slate-600 italic">No hay órdenes guardadas aún.</p>
                ) : (
                  <div className="space-y-3">
                    {watchlist.map((sig, i) => (
                      <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center group">
                        <div>
                          <p className="text-sm font-black text-white">{sig.asset}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold ${sig.action === 'COMPRA' ? 'text-green-400' : 'text-red-400'}`}>{sig.action}</span>
                            <span className="text-[10px] text-slate-600">Conf: {Math.round(sig.confidence*100)}%</span>
                          </div>
                        </div>
                        <button onClick={() => toggleWatchlist(sig)} className="text-blue-500 opacity-50 group-hover:opacity-100">
                           <BookmarkCheck className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* SEÑALES DETALLADAS */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                  <Zap className="text-yellow-400 w-6 h-6" /> 
                  Oportunidades de Alta Probabilidad
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {analysis?.topOpportunities.map((signal, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all shadow-2xl">
                    <div className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-950 rounded-3xl flex items-center justify-center font-black text-3xl text-blue-500 border border-slate-800">
                            {signal.asset.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="text-4xl font-black text-white tracking-tighter">{signal.asset}</h4>
                              <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${
                                signal.action === 'COMPRA' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                              }`}>
                                {signal.action}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                               <div className="flex gap-1">
                                 {[1,2,3,4,5].map(s => (
                                   <div key={s} className={`w-4 h-1 rounded-full ${s <= (signal.confidence * 5) ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                                 ))}
                               </div>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confianza {Math.round(signal.confidence * 100)}%</span>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => toggleWatchlist(signal)}
                          className={`p-4 rounded-2xl border transition-all ${
                            watchlist.some(s => s.asset === signal.asset) 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-white'
                          }`}
                        >
                          {watchlist.some(s => s.asset === signal.asset) ? <BookmarkCheck className="w-6 h-6" /> : <Bookmark className="w-6 h-6" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                          <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Rango Entrada</p>
                          <p className="text-2xl font-mono font-bold text-blue-400">{signal.entryRange}</p>
                        </div>
                        <div className="bg-green-500/5 p-6 rounded-3xl border border-green-500/20">
                          <p className="text-[10px] font-black text-green-600 uppercase mb-2">Toma de Ganancia</p>
                          <p className="text-2xl font-mono font-bold text-green-400">{signal.takeProfit}</p>
                        </div>
                        <div className="bg-red-500/5 p-6 rounded-3xl border border-red-500/20">
                          <p className="text-[10px] font-black text-red-600 uppercase mb-2">Parada Pérdida</p>
                          <p className="text-2xl font-mono font-bold text-red-400">{signal.stopLoss}</p>
                        </div>
                      </div>

                      <MarketChart symbol={signal.asset} />

                      <div className="mt-10">
                         <div className="flex items-center gap-2 mb-4">
                           <ShieldAlert className="w-4 h-4 text-orange-500" />
                           <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Análisis del Experto IA</h5>
                         </div>
                         <div className="bg-slate-950 p-6 rounded-3xl text-sm text-slate-300 leading-relaxed border border-slate-800 shadow-inner">
                           {signal.reasoning}
                         </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/40 px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                         <div className="flex -space-x-3">
                           {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"></div>)}
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Oportunidad detectada por correlación geopolítica</p>
                      </div>
                      <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[1.5rem] font-black text-sm transition-all flex items-center justify-center gap-3 group shadow-xl shadow-blue-500/20">
                        ABRIR EN PLUS500
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};

export default App;
