import {
AlertTriangle,
Car,
Clock3,
Gauge,
MapPin,
Radio,
TrendingDown,
TrendingUp,
} from "lucide-react";

import {
CartesianGrid,
Line,
LineChart,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";

import type { Vehicle } from "../types/fleet";
import {
calculateFleetTraffic,
type TrafficZone,
} from "../utils/traffic";

interface TrafficProps {
vehicles: Vehicle[];
}

const trafficRoads: Record<string, string> = {
Kimironko: "Kimironko - CBD",
Nyabugogo: "Nyabugogo - Remera",
Nyamirambo: "Nyamirambo - Kacyiru",
Kanombe: "Kanombe - Town",
Kacyiru: "Kacyiru - Kimironko",
Gikondo: "Gikondo - Nyabugogo",
};

const trafficTrend = [
{ time: "06:00", congestion: 32, speed: 34 },
{ time: "07:00", congestion: 41, speed: 30 },
{ time: "08:00", congestion: 58, speed: 24 },
{ time: "09:00", congestion: 64, speed: 21 },
{ time: "10:00", congestion: 52, speed: 26 },
{ time: "11:00", congestion: 46, speed: 29 },
{ time: "12:00", congestion: 55, speed: 25 },
];

const statusStyles = {
CLEAR: "bg-emerald-50 text-emerald-700 border-emerald-100",
MODERATE: "bg-sky-50 text-sky-700 border-sky-100",
HEAVY: "bg-amber-50 text-amber-700 border-amber-100",
SEVERE: "bg-red-50 text-red-700 border-red-100",
};

function Traffic({ vehicles }: TrafficProps) {
const traffic = calculateFleetTraffic(vehicles);

const averageCongestion = traffic.averageCongestion;
const averageSpeed = traffic.averageSpeed;
const totalVehicles = traffic.vehiclesDetected;
const heavyAreas = traffic.congestedZones;

const trafficAreas: (TrafficZone & { road: string })[] =
traffic.zones.map((zone) => ({
...zone,
road: trafficRoads[zone.name] ?? `${zone.name} route`,
}));

const highestCongestionArea =
trafficAreas.length > 0
? trafficAreas.reduce((highest, area) =>
area.congestion > highest.congestion
? area
: highest,
)
: null;

return ( <div className="space-y-6"> <div> <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
Kigali Mobility Intelligence </p>

```
    <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
      Traffic & Congestion
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Monitor simulated traffic conditions and congestion across
      major Kigali routes.
    </p>
  </div>

  <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
    <Radio
      size={20}
      className="mt-0.5 shrink-0 text-sky-600"
    />

    <div>
      <p className="text-sm font-bold text-sky-900">
        TRAFFIC SOFTWARE SIMULATION
      </p>

      <p className="mt-0.5 text-xs text-sky-700">
        Traffic conditions are calculated from the current simulated
        fleet vehicles. No physical traffic sensors are connected.
      </p>
    </div>
  </div>

  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Avg Congestion
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {averageCongestion}%
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <TrendingUp size={21} />
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Calculated from current simulated vehicles
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Avg Speed
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {averageSpeed}
            <span className="ml-1 text-base font-bold">
              km/h
            </span>
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Gauge size={21} />
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Current simulated fleet average
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vehicles Detected
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {totalVehicles}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Car size={21} />
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Vehicles in the simulated fleet
      </p>
    </div>

    <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Congested Areas
          </p>

          <p className="mt-2 text-3xl font-black text-red-600">
            {heavyAreas}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle size={21} />
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Heavy or severe congestion
      </p>
    </div>
  </section>

  <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-900">
            Traffic Trend
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Historical sample (fixed demonstration values; separate from current fleet readings)
          </p>
        </div>

        <Clock3 size={19} className="text-slate-400" />
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trafficTrend}
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

            <YAxis tick={{ fontSize: 11, fill: "#a5b2c5" }} axisLine={{ stroke: "#263449" }} tickLine={{ stroke: "#263449" }} />

            <Tooltip contentStyle={{ background: "#121a28", border: "1px solid #263449", color: "#f5f7fa" }} />

            <Line
              type="monotone"
              dataKey="congestion"
              name="Congestion (%)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="speed"
              name="Speed (km/h)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="font-bold text-slate-900">
          Traffic Intelligence
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Current simulated traffic observations
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <TrendingDown
              size={18}
              className="text-red-500"
            />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Speed monitoring active
              </p>

              <p className="mt-1 text-xs text-slate-500">
                The system continuously analyzes vehicle speed
                to identify possible congestion.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={18}
              className="text-amber-500"
            />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Congestion hotspot
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {highestCongestionArea
                  ? `${highestCongestionArea.name} currently has the highest simulated congestion at ${highestCongestionArea.congestion}%.`
                  : "No traffic hotspot is currently detected."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <MapPin
              size={18}
              className="text-sky-500"
            />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Route monitoring active
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Six Kigali traffic zones are being analyzed from
                simulated fleet positions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-4">
      <h2 className="font-bold text-slate-900">
        Monitored Traffic Zones
      </h2>

      <p className="mt-0.5 text-xs text-slate-500">
        Current conditions calculated from simulated fleet data
      </p>
    </div>

    <div className="divide-y divide-slate-100">
      {trafficAreas.map((area) => (
        <div
          key={area.name}
          className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {area.name}
              </p>

              <p className="text-xs text-slate-500">
                {area.road}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Congestion
              </p>

              <p className="mt-1 text-sm font-black text-slate-800">
                {area.congestion}%
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Speed
              </p>

              <p className="mt-1 text-sm font-black text-slate-800">
                {area.averageSpeed} km/h
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Vehicles
              </p>

              <p className="mt-1 text-sm font-black text-slate-800">
                {area.vehicles}
              </p>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${statusStyles[area.status]}`}
          >
            {area.status}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>


);
}

export default Traffic;
