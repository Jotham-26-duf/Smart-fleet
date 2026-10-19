import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowLeft, ArrowRight, Bus, Gauge, Map, Radio, RotateCcw, Thermometer, Droplets, Zap } from "lucide-react";
import AlertCenter from "../components/AlertCenter";
import KpiCard from "../components/KpiCard";
import TelemetryChart from "../components/TelemetryChart";
import FleetMap from "../components/FleetMap";
import { generateFleetAlerts, getVehicleStatus, getVehicleStatusExplanation, TELEMETRY_THRESHOLDS } from "../utils/diagnostics";
import type { Vehicle, VehicleStatus } from "../types/fleet";

interface DashboardProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
  onNavigate?: (page: string) => void;
  onResetSimulation?: () => void;
}

const feeds = [
  { camera: "CAMERA FEED 01", location: "Kigali Urban Transit Corridor", tone: "from-blue-950 via-slate-900 to-cyan-950", glyph: "01" },
  { camera: "CAMERA FEED 02", location: "Kigali Bus Corridor", tone: "from-indigo-950 via-slate-900 to-emerald-950", glyph: "02" },
  { camera: "CAMERA FEED 03", location: "Kigali City Centre Transit Node", tone: "from-slate-800 via-blue-950 to-violet-950", glyph: "03" },
];

function Dashboard({ vehicles, onVehicleSelect, selectedVehicleId, onNavigate, onResetSimulation }: DashboardProps) {
  const [selectedFeed, setSelectedFeed] = useState(0);
  const [clock, setClock] = useState(() => new Date());
  const [incidentFilter, setIncidentFilter] = useState<"ALL" | VehicleStatus>("ALL");
  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? vehicles[0];
  const statuses = useMemo(() => vehicles.map((vehicle) => getVehicleStatus(vehicle.temperature, vehicle.oilPressure)), [vehicles]);
  const healthy = statuses.filter((status) => status === "HEALTHY").length;
  const warning = statuses.filter((status) => status === "WARNING").length;
  const critical = statuses.filter((status) => status === "CRITICAL").length;
  const averageSpeed = vehicles.length ? Math.round(vehicles.reduce((total, vehicle) => total + vehicle.speed, 0) / vehicles.length) : 0;
  const averageTemperature = vehicles.length ? Math.round(vehicles.reduce((total, vehicle) => total + vehicle.temperature, 0) / vehicles.length) : 0;
  const alerts = generateFleetAlerts(vehicles);
  const incidents = vehicles.map((vehicle, index) => ({ vehicle, status: statuses[index] })).filter((entry) => incidentFilter === "ALL" || entry.status === incidentFilter);
  const hasPosition = selectedVehicle && Number.isFinite(selectedVehicle.lat) && Number.isFinite(selectedVehicle.lng);

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center">
      <div className="flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sky-400"><Gauge size={24}/></div><div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">SMART FLEET DIAGNOSTICS &amp; TRAFFIC</p>
        <h1 className="mt-1 text-xl font-black text-slate-900 md:text-2xl">Integrated Kigali Transit &amp; Remote Telemetry</h1>
        <p className="mt-1 font-mono text-xs text-slate-500">{clock.toLocaleString()}</p>
      </div></div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">SIMULATED</span>
        <button onClick={() => onNavigate?.("fleet-map")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Fleet Map</button>
        <button onClick={() => onNavigate?.("reports")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Reports</button>
        <button onClick={onResetSimulation} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"><RotateCcw size={14}/>Reset Simulation</button>
      </div>
    </section>

    <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4"><Radio size={20} className="mt-0.5 shrink-0 text-sky-600"/><div><p className="text-sm font-bold text-sky-900">SIMULATED TELEMETRY</p><p className="mt-0.5 text-xs text-sky-700">Vehicle readings and positions are generated in this prototype; no physical vehicle hardware is connected.</p></div></div>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard title="Total Vehicles" value={vehicles.length} description="Vehicles in current view" icon={Bus} type="blue"/>
      <KpiCard title="Healthy" value={healthy} description="Within diagnostic thresholds" icon={Activity} type="green"/>
      <KpiCard title="Warnings" value={warning} description="Telemetry needs attention" icon={AlertTriangle} type="amber"/>
      <KpiCard title="Critical" value={critical} description="Critical simulated readings" icon={AlertTriangle} type="red"/>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Selected vehicle telemetry">
      <Metric icon={<Gauge size={18}/>} label="Speed" value={selectedVehicle ? `${selectedVehicle.speed} km/h` : "—"}/>
      <Metric icon={<Thermometer size={18}/>} label="Engine temperature" value={selectedVehicle ? `${selectedVehicle.temperature}°C` : "—"}/>
      <Metric icon={<Droplets size={18}/>} label="Oil pressure" value={selectedVehicle ? `${selectedVehicle.oilPressure} PSI` : "—"}/>
      <Metric icon={<Zap size={18}/>} label="Engine RPM" value={selectedVehicle ? `${selectedVehicle.rpm}` : "—"}/>
    </section>

    <div className="grid gap-4 sm:grid-cols-2"><Metric icon={<Gauge size={18}/>} label="Fleet average speed" value={`${averageSpeed} km/h`}/><Metric icon={<Thermometer size={18}/>} label="Fleet average engine temperature" value={`${averageTemperature}°C`}/></div>

    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4"><div><h2 className="font-bold text-slate-900">LIVE TRAFFIC &amp; ROUTE VISUAL FEEDS</h2><p className="mt-1 text-xs text-slate-500">Illustrative feed panels · not live CCTV</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-600">DEMO FEED</span></div>
        <div className={`relative flex h-56 flex-col justify-between overflow-hidden bg-gradient-to-br ${feeds[selectedFeed].tone} p-5`}>
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",backgroundSize:"28px 28px"}} aria-hidden="true"/>
          <div className="relative flex items-center justify-between"><span className="rounded bg-black/40 px-2 py-1 font-mono text-xs text-white">{feeds[selectedFeed].camera}</span><span className="rounded bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-200">SIMULATED</span></div>
          <div className="relative flex items-end justify-between"><div><p className="font-mono text-4xl font-black text-white/20">{feeds[selectedFeed].glyph}</p><h3 className="font-bold text-white">{feeds[selectedFeed].location}</h3></div><div className="flex gap-2"><button aria-label="Previous demo feed" onClick={() => setSelectedFeed((selectedFeed + feeds.length - 1) % feeds.length)} className="rounded-lg bg-black/40 p-2 text-white"><ArrowLeft size={17}/></button><button aria-label="Next demo feed" onClick={() => setSelectedFeed((selectedFeed + 1) % feeds.length)} className="rounded-lg bg-black/40 p-2 text-white"><ArrowRight size={17}/></button></div></div>
        </div>
      </article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Vehicle</p><h2 className="mt-1 text-xl font-black text-slate-900">{selectedVehicle?.id ?? "No vehicle available"}</h2><p className="text-sm text-slate-500">{selectedVehicle?.route ?? "Select a vehicle to view details"}</p></div>{selectedVehicle && <StatusBadge status={getVehicleStatus(selectedVehicle.temperature, selectedVehicle.oilPressure)}/>}</div>
        {selectedVehicle && <>
          <p className="mt-4 text-sm text-slate-600">{getVehicleStatusExplanation(selectedVehicle.temperature, selectedVehicle.oilPressure)}</p>
          <div className="mt-4 flex items-center gap-4"><div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full" style={{background:`conic-gradient(#20e3a2 ${healthScore(selectedVehicle)}%, #263449 0)`}} aria-label={`Telemetry health score ${healthScore(selectedVehicle)} out of 100`}><div className="grid h-16 w-16 place-items-center rounded-full bg-white text-lg font-black text-slate-900">{healthScore(selectedVehicle)}</div></div><p className="text-xs leading-5 text-slate-500">Telemetry health score (0–100). Deterministic estimate from temperature and oil pressure relative to configured thresholds; not a certified condition assessment.</p></div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><Value label="Temperature" value={`${selectedVehicle.temperature}°C`}/><Value label="Oil pressure" value={`${selectedVehicle.oilPressure} PSI`}/><Value label="Speed" value={`${selectedVehicle.speed} km/h`}/><Value label="Engine RPM" value={`${selectedVehicle.rpm}`}/></div>
        </>}
      </article>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="font-bold text-slate-900">Selected Vehicle Map</h2><p className="mt-1 text-xs text-slate-500">SIMULATED LOCATION · no GPS hardware connected</p></div><Map size={19} className="text-sky-500"/></div>
        <FleetMap vehicles={hasPosition ? [selectedVehicle] : []} selectedVehicleId={selectedVehicle?.id} onVehicleSelect={onVehicleSelect}/>
      </article>
      <div className="space-y-6"><AlertCenter alerts={alerts}/><article className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Simulated Incident Stream</h2><p className="mt-1 text-xs text-slate-500">Current telemetry snapshot · not verified real-world events</p></div><div className="flex gap-1" role="group" aria-label="Filter incident stream">{(["ALL","CRITICAL","WARNING","HEALTHY"] as const).map((filter) => <button key={filter} aria-pressed={incidentFilter === filter} onClick={() => setIncidentFilter(filter)} className={`rounded-md px-2 py-1 text-[10px] font-bold ${incidentFilter === filter ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}>{filter}</button>)}</div></div>
        <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">{incidents.map(({vehicle,status})=><div key={vehicle.id} className={`rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-[11px] ${status === "CRITICAL" ? "text-red-600" : status === "WARNING" ? "text-amber-600" : "text-emerald-600"}`}><span className="text-slate-500">[{clock.toLocaleTimeString()}]</span> {vehicle.id} — {status === "HEALTHY" ? `Telemetry heartbeat OK — coolant ${vehicle.temperature}°C` : `${status} diagnostic — ${getVehicleStatusExplanation(vehicle.temperature, vehicle.oilPressure)}`}</div>)}{incidents.length === 0 && <p className="p-4 text-center text-xs text-slate-500">No vehicles match this filter.</p>}</div>
      </article></div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white"><div className="border-b border-slate-100 p-4"><h2 className="font-bold text-slate-900">Fleet Directory</h2><p className="mt-1 text-xs text-slate-500">Use the top search to filter by vehicle, route, or location.</p></div><div className="divide-y divide-slate-100">{vehicles.map((vehicle)=><button key={vehicle.id} type="button" aria-pressed={selectedVehicle?.id === vehicle.id} onClick={()=>onVehicleSelect?.(vehicle)} className={`flex w-full flex-col gap-3 p-4 text-left transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between ${selectedVehicle?.id === vehicle.id ? "bg-sky-50" : ""}`}><div><p className="font-mono text-sm font-bold text-slate-900">{vehicle.id}</p><p className="text-xs text-slate-500">{vehicle.route}</p></div><div className="flex items-center gap-4 text-xs"><span className="text-slate-500">{vehicle.temperature}°C</span><StatusBadge status={getVehicleStatus(vehicle.temperature, vehicle.oilPressure)}/></div></button>)}{vehicles.length === 0 && <p className="p-8 text-center text-sm text-slate-500">No vehicles match the current search.</p>}</div></section>

    <TelemetryChart/>
  </div>;
}

function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}) { return <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className="text-sky-500">{icon}</span><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-lg font-black text-slate-900">{value}</p></div></div>; }
function Value({label,value}:{label:string;value:string}) { return <div className="rounded-lg bg-slate-50 p-3"><p className="text-slate-500">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div>; }
function StatusBadge({status}:{status:VehicleStatus}) { const style = status === "CRITICAL" ? "border-red-100 bg-red-50 text-red-700" : status === "WARNING" ? "border-amber-100 bg-amber-50 text-amber-700" : "border-emerald-100 bg-emerald-50 text-emerald-700"; return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${style}`}>{status}</span>; }
function healthScore(vehicle:Vehicle) { const t = TELEMETRY_THRESHOLDS; const temperaturePenalty = Math.max(0, (vehicle.temperature - t.warningTemperature) * 2); const oilPenalty = vehicle.oilPressure < t.warningOilPressure ? (t.warningOilPressure - vehicle.oilPressure) * 2 : 0; return Math.max(0, Math.min(100, Math.round(100 - temperaturePenalty - oilPenalty))); }

export default Dashboard;
