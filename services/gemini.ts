
import { GoogleGenAI, Type } from "@google/genai";
import { MarketAnalysis } from "../types";

export const getMarketAnalysis = async (query?: string): Promise<MarketAnalysis> => {
  const manualKey = localStorage.getItem('CUSTOM_GEMINI_API_KEY');
  const apiKey = manualKey || (process.env.API_KEY as string);
  
  if (!apiKey || apiKey === 'undefined') {
    throw new Error('API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    Eres un Analista de Trading de Alta Frecuencia y experto en Geopolítica. 
    Tu misión es convertir CADA EVENTO del mundo en una ORDEN DE COMPRA o VENTA clara.
    
    REGLAS ESTRICTAS:
    1. Para CADA noticia que listes en 'newsContext', DEBES incluir una 'recomendacionDirecta' con:
       - asset: La empresa o activo específico de Plus500 (ej: 'Apple', 'Petróleo Brent', 'NVIDIA').
       - action: 'COMPRA' o 'VENTA'.
       - target: Un precio objetivo breve.
    2. Si hablas de Venezuela, vincula con Petróleo, Repsol o Chevron. 
    3. Si hablas de Trump/Aranceles, vincula con empresas Chinas (Alibaba), Tecnológicas (Apple) o el Dólar.
    4. Responde SIEMPRE en ESPAÑOL.
    5. Utiliza googleSearch para que los datos sean de HOY mismo.
  `;

  const prompt = query || "Analiza las noticias de ÚLTIMA HORA sobre aranceles de Trump, la situación en Venezuela y conflictos en Oriente Medio. Para cada noticia, dime exactamente en qué empresa debo comprar o vender en Plus500.";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          globalSentiment: { type: Type.STRING },
          newsContext: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                impact: { type: Type.STRING },
                sentiment: { type: Type.STRING },
                date: { type: Type.STRING },
                recomendacionDirecta: {
                  type: Type.OBJECT,
                  properties: {
                    asset: { type: Type.STRING },
                    action: { type: Type.STRING },
                    target: { type: Type.STRING }
                  },
                  required: ["asset", "action", "target"]
                }
              }
            }
          },
          topOpportunities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                asset: { type: Type.STRING },
                action: { type: Type.STRING },
                entryRange: { type: Type.STRING },
                takeProfit: { type: Type.STRING },
                stopLoss: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["globalSentiment", "newsContext", "topOpportunities"]
      }
    }
  });

  try {
    const analysis: MarketAnalysis = JSON.parse(response.text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      analysis.sources = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web.title,
          uri: chunk.web.uri
        }));
    }
    return analysis;
  } catch (error) {
    console.error("Error al procesar respuesta", error);
    throw new Error("No se pudo generar el análisis predictivo.");
  }
};
