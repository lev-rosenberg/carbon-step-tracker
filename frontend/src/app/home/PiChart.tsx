import React from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Data {
  name: string;
  value: number;
}

interface PiChartProps {
  data: Data[];
}

export default function PiChart({ data }: PiChartProps) {
  const COLORS = ["#582d18", "#cc6e0f", "#36281c"];
  const isDataValid = data.some((entry) => entry.value > 0);
  if (!isDataValid) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart />
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={70}
          fill="#82ca9d"
          label={({ value }) => `${value} kg`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => `${value} kg`}
          labelFormatter={(value) => `Category: ${value}`}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
