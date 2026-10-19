import {
AlertTriangle,
BellRing,
CheckCircle2,
Gauge,
Thermometer,
Droplets,
} from "lucide-react";

import type { FleetAlert } from "../types/fleet";

interface AlertCenterProps {
alerts: FleetAlert[];
}

const severityStyles = {
INFO: {
icon: "bg-sky-100 text-sky-600",
badge: "bg-sky-100 text-sky-700",
},
WARNING: {
icon: "bg-amber-100 text-amber-600",
badge: "bg-amber-100 text-amber-700",
},
CRITICAL: {
icon: "bg-red-100 text-red-600",
badge: "bg-red-100 text-red-700",
},
};

function getAlertIcon(type: FleetAlert["type"]) {
if (type === "HIGH_TEMPERATURE") {
return Thermometer;
}

if (type === "LOW_OIL_PRESSURE") {
return Droplets;
}

if (type === "OVERSPEED") {
return Gauge;
}

return AlertTriangle;
}

function AlertCenter({ alerts }: AlertCenterProps) {
const critical = alerts.filter(
(alert) => alert.severity === "CRITICAL",
).length;

const warnings = alerts.filter(
(alert) => alert.severity === "WARNING",
).length;

return ( <section className="rounded-2xl border border-slate-200 bg-white shadow-sm"> <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"> <BellRing size={19} /> </div>

```
      <div>
        <h2 className="font-bold text-slate-900">
          Intelligent Alerts
        </h2>

        <p className="text-xs text-slate-500">
          Automatic telemetry diagnostics
        </p>
      </div>
    </div>

    <div className="flex gap-2">
      <span className="rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-700">
        {critical} CRITICAL
      </span>

      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-700">
        {warnings} WARNING
      </span>
    </div>
  </div>

  {alerts.length === 0 ? (
    <div className="flex items-center gap-3 p-6">
      <CheckCircle2
        size={22}
        className="text-emerald-500"
      />

      <div>
        <p className="text-sm font-bold text-slate-900">
          No active alerts
        </p>

        <p className="text-xs text-slate-500">
          Current simulated fleet telemetry is within configured
          thresholds.
        </p>
      </div>
    </div>
  ) : (
    <div className="max-h-[430px] divide-y divide-slate-100 overflow-y-auto">
      {alerts.map((alert) => {
        const Icon = getAlertIcon(alert.type);
        const styles = severityStyles[alert.severity];

        return (
          <div
            key={alert.id}
            className="p-4 transition hover:bg-slate-50"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">
                    {alert.title}
                  </p>

                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-black ${styles.badge}`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {alert.vehicleId} · {alert.location}
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  {alert.message}
                </p>

                <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold text-slate-400">
                  <span>
                    Value: {alert.value} {alert.unit}
                  </span>

                  <span>{alert.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>


);
}

export default AlertCenter;
