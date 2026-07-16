import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface HotspotData {
  location: string;
  incidents: number;
  severity: "Critical" | "High" | "Medium" | "Low";
}

interface HotspotChartProps {
  data: HotspotData[];
}

const getColor = (severity: HotspotData["severity"]) => {
  switch (severity) {
    case "Critical":
      return "#EF4444";
    case "High":
      return "#F97316";
    case "Medium":
      return "#EAB308";
    default:
      return "#22C55E";
  }
};

export default function HotspotChart({
  data,
}: HotspotChartProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-white">
          Crime Hotspots
        </h2>

        <span className="text-xs text-slate-400">
          Top Risk Locations
        </span>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 10,
            right: 20,
            left: 30,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            type="number"
            stroke="#94A3B8"
          />

          <YAxis
            type="category"
            dataKey="location"
            stroke="#94A3B8"
            width={120}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
            }}
          />

          <Bar
            dataKey="incidents"
            radius={[0, 10, 10, 0]}
          >
            {data.map((item, index) => (
              <Cell
                key={index}
                fill={getColor(item.severity)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Critical
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          High
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          Medium
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Low
        </div>
      </div>
    </div>
  );
}