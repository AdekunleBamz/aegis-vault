'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'STX', value: 65, color: '#3b82f6' },
    { name: 'USDA', value: 20, color: '#10b981' },
    { name: 'wBTC', value: 10, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#6366f1' },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="text-white font-bold text-sm mb-1">{payload[0].name}</p>
                <p className="text-blue-400 font-medium text-xs">
                    {payload[0].value}% of portfolio
                </p>
            </div>
        );
    }
    return null;
};

export function AssetAllocation() {
    return (
        <div className="glass-dark border border-white/5 rounded-2xl p-6 h-full flex flex-col">
            <div>
                <h3 className="text-white font-bold">Asset Allocation</h3>
                <p className="text-gray-500 text-xs">Portfolio distribution by asset type</p>
            </div>

            <div className="flex-1 mt-4 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            content={({ payload }) => (
                                <div className="flex flex-wrap justify-center gap-4 mt-6">
                                    {payload?.map((entry: any, index: number) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                {entry.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
                {data.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-white text-sm font-bold">{item.value}%</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
