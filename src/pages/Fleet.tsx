import { useMemo, useState } from "react";
import {
Activity,
Bus,
Gauge,
MapPin,
Search,
Thermometer,
Wrench,
} from "lucide-react";

import type { Vehicle } from "../types/fleet";
import { TELEMETRY_THRESHOLDS } from "../utils/diagnostics";

interface FleetProps {
vehicles?: Vehicle[];
onVehicleSelect?: (vehicle: Vehicle) => void;
}

const statusStyles = {
HEALTHY: {
badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
dot: "bg-emerald-500",
label: "Healthy",
},
WARNING: {
badge: "bg-amber-50 text-amber-700 border-amber-100",
dot: "bg-amber-500",
label: "Warning",
},
CRITICAL: {
badge: "bg-red-50 text-red-700 border-red-100",
dot: "bg-red-500",
label: "Critical",
},
};

function Fleet({
vehicles = [],
onVehicleSelect,
}: FleetProps) {
const [statusFilter, setStatusFilter] = useState<"ALL" | Vehicle["status"]>("ALL");
const [sortBy, setSortBy] = useState<"id" | "route" | "location" | "speed" | "temperature" | "oilPressure">("id");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
const displayedVehicles = useMemo(() => vehicles
  .filter((vehicle) => statusFilter === "ALL" || vehicle.status === statusFilter)
  .toSorted((a, b) => {
    const left = a[sortBy];
    const right = b[sortBy];
    const comparison = typeof left === "number" && typeof right === "number"
      ? left - right
      : String(left).localeCompare(String(right));
    return sortDirection === "asc" ? comparison : -comparison;
  }), [vehicles, statusFilter, sortBy, sortDirection]);
const healthy = vehicles.filter(
(vehicle) => vehicle.status === "HEALTHY",
).length;

const warning = vehicles.filter(
(vehicle) => vehicle.status === "WARNING",
).length;

const critical = vehicles.filter(
(vehicle) => vehicle.status === "CRITICAL",
).length;

return ( <div className="space-y-6"> <div> <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">
Fleet Operations </p>

```
    <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
      Fleet Management
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Monitor vehicle health, telemetry, routes, and operating
      conditions.
    </p>
  </div>

  <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
    <Activity
      size={20}
      className="mt-0.5 shrink-0 text-sky-600"
    />

    <div>
      <p className="text-sm font-bold text-sky-900">
        SOFTWARE FLEET MONITORING
      </p>

      <p className="mt-0.5 text-xs text-sky-700">
        Vehicle telemetry shown here is simulated for the
        prototype. No physical fleet devices are connected.
      </p>
    </div>
  </div>

  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Bus size={21} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Fleet
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {vehicles.length}
          </p>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Healthy
      </p>

      <p className="mt-2 text-2xl font-black text-emerald-600">
        {healthy}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Normal operating condition
      </p>
    </div>

    <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Warning
      </p>

      <p className="mt-2 text-2xl font-black text-amber-600">
        {warning}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Requires attention
      </p>
    </div>

    <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Critical
      </p>

      <p className="mt-2 text-2xl font-black text-red-600">
        {critical}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Immediate review required
      </p>
    </div>
  </section>

  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-bold text-slate-900">
            Vehicle Fleet
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Select a vehicle to inspect its current telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <Search size={16} className="text-slate-400" />

          <span className="text-xs font-semibold text-slate-500">
            Use the top search bar to filter
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "ALL" | Vehicle["status"])} className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700">
              <option value="ALL">All</option><option value="HEALTHY">Healthy</option><option value="WARNING">Warning</option><option value="CRITICAL">Critical</option>
            </select>
          </label>
          <label className="text-xs font-semibold text-slate-500">Sort
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700">
              <option value="id">Vehicle</option><option value="route">Route</option><option value="location">Location</option><option value="speed">Speed</option><option value="temperature">Temperature</option><option value="oilPressure">Oil pressure</option>
            </select>
          </label>
          <button type="button" onClick={() => setSortDirection((direction) => direction === "asc" ? "desc" : "asc")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600" aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}>{sortDirection === "asc" ? "↑" : "↓"}</button>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Vehicle
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Route
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Location
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Speed
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Temperature
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Oil Pressure
            </th>

            <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
              Status
            </th>

            <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {displayedVehicles.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-5 py-12 text-center text-sm text-slate-500"
              >
                No vehicles match your search.
              </td>
            </tr>
          ) : (
            displayedVehicles.map((vehicle) => {
              const status = statusStyles[vehicle.status];

              return (
                <tr
                  key={vehicle.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                        <Bus size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {vehicle.id}
                        </p>

                        <p className="text-[10px] text-slate-400">
                          Fleet Vehicle
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-slate-700">
                      {vehicle.route}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <MapPin size={14} />
                      {vehicle.location}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Gauge
                        size={15}
                        className="text-sky-500"
                      />

                      <span className="text-xs font-bold text-slate-700">
                        {vehicle.speed} km/h
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Thermometer
                        size={15}
                        className={
                          vehicle.temperature >= TELEMETRY_THRESHOLDS.criticalTemperature
                            ? "text-red-500"
                            : vehicle.temperature >= TELEMETRY_THRESHOLDS.warningTemperature
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }
                      />

                      <span className="text-xs font-bold text-slate-700">
                        {vehicle.temperature}°C
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-slate-700">
                      {vehicle.oilPressure} PSI
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-black ${status.badge}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                      />

                      {status.label}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        onVehicleSelect?.(vehicle)
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700"
                    >
                      <Wrench size={14} />
                      Details
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>


);
}

export default Fleet;
