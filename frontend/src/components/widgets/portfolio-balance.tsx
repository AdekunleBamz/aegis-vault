'use client';

import React, { useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { date: '2024-01', balance: 45000 },
    { date: '2024-02', balance: 52000 },
    { date: '2024-03', balance: 48000 },
    { date: '2024-04', balance: 61000 },
    { date: '2024-05', balance: 59000 },
    { date: '2024-06', balance: 75000 },
    { date: '2024-07', balance: 82000 },
];

const ranges = ['24H', '7D', '30D', '1Y', 'ALL'];

export function PortfolioBalance() {
    const [range, setRange] = useState('30D');

    return (
        <div className="glass-dark border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg">Portfolio Value</h3>
                    <p className="text-gray-500 text-xs">Net worth growth over the selected period</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    {ranges.map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${range === r
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['dataMin - 5000', 'dataMax + 5000']}
                        />
                        <Tooltip
                            content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-gray-950/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                                            <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">{payload[0].payload.date}</p>
                                            <p className="text-white font-bold text-base">
                                                ${payload[0].value?.toLocaleString()}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-green-400"
                            viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                        >
                            <path d="M7 17l9-9M7 8h9v9" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm">+$14,230.45</p>
                        <p className="text-gray-500 text-[10px] font-medium">+15.4% this month</p>
                    </div>
                </div>
                <button className="text-blue-400 text-[10px] font-bold uppercase tracking-widest hover:text-blue-300 transition-colors">
                    View Detailed History
                </button>
            </div>
        </div>
    );
}
