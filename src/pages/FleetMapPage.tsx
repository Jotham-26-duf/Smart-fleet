import { Map, Radio } from "lucide-react";

import FleetMap from "../components/FleetMap";
import type { Vehicle } from "../types/fleet";

interface FleetMapPageProps {
vehicles?: Vehicle[];
onVehicleSelect?: (vehicle: Vehicle) => void;
selectedVehicleId?: string;
}

export function FleetMapPage({
vehicles = [],
onVehicleSelect,
  selectedVehicleId,
}: FleetMapPageProps) {
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
      Fleet Map
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Monitor simulated vehicle locations and telemetry across
      Kigali.
    </p>
  </div>

  <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">
    <Radio
      size={20}
      className="mt-0.5 shrink-0 text-sky-600"
    />

    <div>
      <p className="text-sm font-bold text-sky-900">
        LIVE SOFTWARE SIMULATION
      </p>

      <p className="mt-0.5 text-xs text-sky-700">
        Vehicle GPS positions are simulated. This prototype does
        not receive data from physical GPS devices.
      </p>
    </div>
  </div>

  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <Map size={20} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vehicles Mapped
          </p>

          <p className="text-2xl font-black text-slate-900">
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
    </div>

    <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Warning
      </p>

      <p className="mt-2 text-2xl font-black text-amber-600">
        {warning}
      </p>
    </div>

    <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Critical
      </p>

      <p className="mt-2 text-2xl font-black text-red-600">
        {critical}
      </p>
    </div>
  </section>

  <FleetMap
    vehicles={vehicles}
    onVehicleSelect={onVehicleSelect}
    selectedVehicleId={selectedVehicleId}
  />
</div>


);
}
