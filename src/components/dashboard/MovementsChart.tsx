"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ChartDataPoint } from "@/types";

interface MovementsChartProps {
  data: ChartDataPoint[];
}

export function MovementsChart({ data }: MovementsChartProps) {
  const tickInterval = Math.floor(data.length / 6);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#F5C518" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#F5C518" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#F87171" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#52525B" }}
          interval={tickInterval}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#52525B" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ fontWeight: 600, color: "#FAFAFA" }}
          itemStyle={{ color: "#A1A1AA" }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px", color: "#71717A" }}
          formatter={(value) => (value === "entradas" ? "Entradas" : "Saídas")}
        />
        <Area
          type="monotone"
          dataKey="entradas"
          stroke="#F5C518"
          strokeWidth={2}
          fill="url(#colorEntradas)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="saidas"
          stroke="#F87171"
          strokeWidth={2}
          fill="url(#colorSaidas)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
