import { useEffect, useState } from "react";
import { CarFront, Clock3, MapPin, ParkingSquare, Radio, TriangleAlert } from "lucide-react";
import type { Vehicle } from "../types/fleet";
import { DEMO_START_SPEED_KMH, DEMO_STOP_SPEED_KMH } from "../data/fleetProvider";

const LONG_STOP_MS = 5 * 60 * 1000;

export default function Parking({ vehicles }: { vehicles: Vehicle[] }) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const stopped = vehicles.filter((vehicle) => vehicle.speed <= DEMO_STOP_SPEED_KMH);
  const events = stopped.map((vehicle) => ({
    vehicle,
    duration: vehicle.stoppedSince !== null && now ? Math.max(0, now - vehicle.stoppedSince) : 0,
  }));
  const longStops = events.filter((event) => event.duration >= LONG_STOP_MS).length;

  return <div className="space-y-6">
    <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Fleet Operations</p><h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Parking &amp; Stop Monitoring</h1><p className="mt-1 text-sm text-slate-500">Stationary vehicles are reported as stopped. Speed alone does not confirm a parking event.</p></div>
    <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4"><Radio size={20} className="shrink-0 text-sky-600"/><div><p className="text-sm font-bold text-sky-900">SIMULATED STOP DATA · PARKING RECORDS UNAVAILABLE</p><p className="mt-1 text-xs text-sky-700">Stops use locally simulated speed and duration. This project has no verified parking-space coordinates, occupancy records, or arrival/departure source. Vehicle area labels below are simulated and are not parking-space locations.</p></div></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Monitored Vehicles" value={vehicles.length} icon={<CarFront size={20}/>}/><Metric label="Stopped Now" value={stopped.length} icon={<ParkingSquare size={20}/>}/><Metric label="Long Stops (5+ min)" value={longStops} icon={<Clock3 size={20}/>}/><Metric label="Moving Vehicles" value={vehicles.length-stopped.length} icon={<CarFront size={20}/>}/></section>
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Stationary Vehicles</h2><p className="text-xs text-slate-500">Timer begins when demo speed first falls to {DEMO_STOP_SPEED_KMH} km/h or below; it resets after speed reaches {DEMO_START_SPEED_KMH} km/h.</p></div>{events.length ? <div className="divide-y divide-slate-100">{events.map(({vehicle,duration})=><article key={vehicle.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"><div><p className="font-mono font-bold text-slate-900">{vehicle.id}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14}/>Simulated vehicle area: {vehicle.location}</p><p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-700"><TriangleAlert size={15} className={duration >= LONG_STOP_MS ? "text-amber-600" : "text-slate-400"}/>{vehicle.stoppedSince === null ? "Stop timer initializing" : duration >= LONG_STOP_MS ? "Long stop (not a confirmed parking event)" : "Stopped"}</p><p className="mt-1 text-xs text-slate-500">Source: {vehicle.sourceStatus ?? "SIMULATED"} · Updated: {vehicle.lastUpdatedAt ? new Date(vehicle.lastUpdatedAt).toLocaleTimeString() : "Unavailable"}</p></div><span className="flex items-center gap-2 font-mono text-sm font-bold text-slate-600"><Clock3 size={17}/>{formatDuration(duration)}</span></article>)}</div> : <p className="p-8 text-center text-sm text-slate-500">No vehicles are currently below the stop threshold.</p>}</section>
  </div>;
}

function formatDuration(ms: number) { const seconds = Math.floor(ms / 1000); return `${Math.floor(seconds / 60)}m ${seconds % 60}s`; }
function Metric({label,value,icon}:{label:string;value:number;icon:React.ReactNode}) { return <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="text-sky-600">{icon}</div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-slate-900">{value}</p></div>; }
