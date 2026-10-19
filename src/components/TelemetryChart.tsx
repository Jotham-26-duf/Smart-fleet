
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TelemetryPoint {
  time: string;
  speed: number;
  temperature: number;
  rpm: number;
}

const telemetryData: TelemetryPoint[] = [
  { time: "08:00", speed: 28, temperature: 86, rpm: 1600 },
  { time: "08:05", speed: 31, temperature: 88, rpm: 1720 },
  { time: "08:10", speed: 34, temperature: 89, rpm: 1850 },
  { time: "08:15", speed: 30, temperature: 91, rpm: 1780 },
  { time: "08:20", speed: 26, temperature: 93, rpm: 1650 },
  { time: "08:25", speed: 29, temperature: 92, rpm: 1710 },
  { time: "08:30", speed: 33, temperature: 90, rpm: 1820 },
];

function TelemetryChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-slate-900">
          Fleet Telemetry
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Fixed demonstration sample of simulated vehicle performance (not a live history)
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={telemetryData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="#263449" strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#a5b2c5" }}
              axisLine={{ stroke: "#263449" }}
              tickLine={{ stroke: "#263449" }}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#a5b2c5" }}
              axisLine={{ stroke: "#263449" }}
              tickLine={{ stroke: "#263449" }}
            />

            <Tooltip contentStyle={{ background: "#121a28", border: "1px solid #263449", color: "#f5f7fa" }} />

            <Legend />

            <Line
              type="monotone"
              dataKey="speed"
              name="Speed (km/h)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature (°C)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="rpm"
              name="RPM"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TelemetryChart;

