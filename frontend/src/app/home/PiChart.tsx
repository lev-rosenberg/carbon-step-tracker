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
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  console.log(data);
  const isDataValid = data.some((entry) => entry.value > 0);
  if (!isDataValid) {
    return <div>No data available</div>;
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
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
}
