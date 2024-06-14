import React from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface Data {
  name: string;
  value: number;
}

interface PiChartProps {
  data: Data[];
}

export default function PiChart({ data }: PiChartProps) {
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
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
