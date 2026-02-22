'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

const data = [
    { name: 'Mon', yield: 12.5 },
    { name: 'Tue', yield: 13.2 },
    { name: 'Wed', yield: 12.8 },
    { name: 'Thu', yield: 14.1 },
    { name: 'Fri', yield: 13.5 },
    { name: 'Sat', yield: 15.2 },
    { name: 'Sun', yield: 14.8 },
];

export function YieldTrends() {
    return (
        <div className="glass-dark border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-white font-bold">Yield Trends</h3>
                    <p className="text-gray-500 text-xs">Weekly APY fluctuation for AGS rewards</p>
                </div>
                <div className="px-2 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                    <span className="text-green-400 text-[10px] font-bold">AVG 13.7%</span>
                </div>
            </div>

            <div className="flex-1 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={['dataMin - 1', 'dataMax + 1']}
                        />
                        <Tooltip
                            content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-gray-950/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
                                            <p className="text-white font-bold text-sm">
                                                {payload[0].value}% APY
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="yield"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399' }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
