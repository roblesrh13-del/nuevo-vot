
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '09:00', price: 4200 },
  { name: '10:00', price: 4150 },
  { name: '11:00', price: 4300 },
  { name: '12:00', price: 4280 },
  { name: '13:00', price: 4400 },
  { name: '14:00', price: 4350 },
  { name: '15:00', price: 4500 },
  { name: '16:00', price: 4480 },
];

export const MarketChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-400">Rendimiento de {symbol}</h3>
        <span className="text-xs text-slate-400">Simulación en Tiempo Real</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
            itemStyle={{ color: '#3b82f6' }}
            labelStyle={{ color: '#64748b' }}
          />
          <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
