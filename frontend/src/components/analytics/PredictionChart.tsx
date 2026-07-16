import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface PredictionData {
  day: string;
  predicted: number;
  confidence: number;
}

interface PredictionChartProps {
  data: PredictionData[];
}

export default function PredictionChart({
  data,
}: PredictionChartProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">
            AI Crime Prediction
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Forecast for the next 7 days
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-semibold">
          AI Forecast
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="predictionGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#8B5CF6"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="#8B5CF6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

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

          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#8B5CF6"
            fill="url(#predictionGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-5 space-y-2">
        {data.map((item) => (
          <div
            key={item.day}
            className="flex justify-between text-sm border-b border-slate-800 pb-2"
          >
            <span className="text-slate-300">
              {item.day}
            </span>

            <span className="text-violet-400 font-medium">
              {item.confidence}% Confidence
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}