import {
Activity,
CarFront,
Gauge,
MapPin,
Thermometer,
X,
} from "lucide-react";

import type { Vehicle } from "../types/fleet";
import { getVehicleStatus, getVehicleStatusExplanation, TELEMETRY_THRESHOLDS } from "../utils/diagnostics";

interface VehicleDetailsModalProps {
vehicle: Vehicle;
onClose: () => void;
}

const statusStyles = {
HEALTHY: "bg-emerald-50 text-emerald-700 border-emerald-100",
WARNING: "bg-amber-50 text-amber-700 border-amber-100",
CRITICAL: "bg-red-50 text-red-700 border-red-100",
};

function VehicleDetailsModal({
vehicle,
onClose,
}: VehicleDetailsModalProps) {
const status = getVehicleStatus(vehicle.temperature, vehicle.oilPressure);
const oilPressureProblem = vehicle.oilPressure < TELEMETRY_THRESHOLDS.warningOilPressure;
const temperatureProblem = vehicle.temperature >= TELEMETRY_THRESHOLDS.criticalTemperature;

return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"> <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"> <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5"> <div className="flex items-center gap-3"> <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sky-400"> <CarFront size={22} /> </div>


        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Vehicle Details
          </p>

          <h2 className="text-xl font-black text-slate-900">
            {vehicle.id}
          </h2>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close vehicle details"
        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <X size={22} />
      </button>
    </div>

    <div className="max-h-[80vh] overflow-y-auto p-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            {vehicle.route}
          </h3>

          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={15} />
            {vehicle.location}
          </p>
        </div>

        <span
          className={`rounded-full border px-4 py-2 text-xs font-black ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 p-4">
          <Gauge size={20} className="text-sky-600" />

          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Speed
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {vehicle.speed} km/h
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <Activity size={20} className="text-violet-600" />

          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Engine RPM
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {vehicle.rpm}
          </p>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            temperatureProblem
              ? "border-red-200 bg-red-50"
              : "border-slate-200"
          }`}
        >
          <Thermometer
            size={20}
            className={
              temperatureProblem
                ? "text-red-600"
                : "text-orange-500"
            }
          />

          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Temperature
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {vehicle.temperature}°C
          </p>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            oilPressureProblem
              ? "border-red-200 bg-red-50"
              : "border-slate-200"
          }`}
        >
          <Activity
            size={20}
            className={
              oilPressureProblem
                ? "text-red-600"
                : "text-emerald-600"
            }
          />

          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Oil Pressure
          </p>

          <p className="mt-1 text-2xl font-black text-slate-900">
            {vehicle.oilPressure} PSI
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900">
            Simulated GPS Position
          </h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Latitude</span>
              <span className="font-bold text-slate-800">
                {vehicle.lat.toFixed(5)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Longitude</span>
              <span className="font-bold text-slate-800">
                {vehicle.lng.toFixed(5)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Location</span>
              <span className="font-bold text-slate-800">
                {vehicle.location}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data source</span>
              <span className="font-bold text-slate-800">{vehicle.sourceStatus ?? "SIMULATED"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last update</span>
              <span className="font-bold text-slate-800">{vehicle.lastUpdatedAt ? new Date(vehicle.lastUpdatedAt).toLocaleTimeString() : "Unavailable"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-slate-900">
            Diagnostic Interpretation
          </h3>

          <div className="mt-4 space-y-3">
            <p className="rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-700">
              {getVehicleStatusExplanation(vehicle.temperature, vehicle.oilPressure)}
            </p>
            {temperatureProblem && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
                Engine temperature is currently elevated and
                requires inspection.
              </div>
            )}

            {oilPressureProblem && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
                Oil pressure is below the simulated safe
                threshold.
              </div>
            )}

            {!temperatureProblem && !oilPressureProblem && (
              <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                Current simulated telemetry is within normal
                operating thresholds.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <p className="text-xs font-bold text-sky-900">
          LIVE SOFTWARE SIMULATION
        </p>

        <p className="mt-1 text-xs leading-5 text-sky-700">
          Telemetry and GPS values update automatically every few
          seconds. These values are simulated and are not coming
          from a physical vehicle.
        </p>
      </div>
    </div>
  </div>
</div>


);
}

export default VehicleDetailsModal;
