import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface CrimeTrendData {
  day: string;
  reported: number;
  resolved: number;
}

interface CrimeTrendChartProps {
  data: CrimeTrendData[];
}

export default function CrimeTrendChart({
  data,
}: CrimeTrendChartProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">
        Weekly Crime Trend
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="day"
            stroke="#94A3B8"
          />

          <YAxis stroke="#94A3B8" />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="reported"
            stroke="#3B82F6"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="resolved"
            stroke="#22C55E"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}