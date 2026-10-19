import { AlertTriangle, Droplets, Gauge, Mountain, Radio, Scale, ShieldAlert } from "lucide-react";
import type { Vehicle } from "../types/fleet";

const roads = ["Kanombe - Town", "Gikondo - Nyabugogo", "Kimironko - CBD", "Kacyiru - Kimironko"];
type Zone = { road:string; vehicles:Vehicle[]; moisture:number; load:number; risk:number };
export default function RoadRisk({ vehicles }: { vehicles: Vehicle[] }) {
  const zones:Zone[] = roads.map((road,index) => {
    const matching=vehicles.filter(v=>v.route===road || (index===0 && v.route.includes("Kanombe")) || (index===1 && v.route.includes("Gikondo")) || (index===2 && v.route.includes("Kimironko")) || (index===3 && v.route.includes("Kacyiru")));
    const moisture=[78,64,32,24][index];
    const load=matching.length ? Math.min(100,Math.round(matching.reduce((sum,v)=>sum+v.speed,0)/matching.length*2)) : 0;
    const risk=Math.round(moisture*0.5+load*0.5);
    return {road,vehicles:matching,moisture,load,risk};
  });
  const avg=(key:"moisture"|"load")=>zones.length?Math.round(zones.reduce((s,z)=>s+z[key],0)/zones.length):0;
  const high=zones.filter(z=>z.risk>=60).length;
  return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">Road Safety Intelligence</p><h1 className="mt-1 text-2xl font-black text-slate-900">Road Risk Monitoring</h1><p className="mt-1 text-sm text-slate-500">Illustrative road-risk index combines fixed demo moisture samples with current simulated vehicle speed.</p></div>
    <div className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4"><Radio size={20} className="shrink-0 text-orange-600"/><div><p className="text-sm font-bold text-orange-900">ROAD RISK SOFTWARE SIMULATION</p><p className="mt-1 text-xs text-orange-700">Moisture values are fixed demonstration inputs; the load index is estimated as mean speed × 2 and capped at 100. No road sensors, weather, vehicle mass, or engineering data are available.</p></div></div>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={<Droplets size={22}/>} label="Avg Demo Moisture" value={`${avg("moisture")}%`}/><Metric icon={<Scale size={22}/>} label="Avg Speed Index" value={`${avg("load")}%`}/><Metric icon={<ShieldAlert size={22}/>} label="Higher Index (≥60)" value={high}/><Metric icon={<Mountain size={22}/>} label="Monitored Roads" value={zones.length}/></section>
    <div className="grid gap-6 lg:grid-cols-2">{zones.map(zone=><article key={zone.road} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-bold text-slate-900">{zone.road}</h2><p className="mt-1 text-xs text-slate-500">{zone.vehicles.length} matching simulated vehicles</p></div><span className={`rounded-full border px-3 py-1 text-[10px] font-black ${zone.risk>=60?"border-red-100 bg-red-50 text-red-700":"border-emerald-100 bg-emerald-50 text-emerald-700"}`}>{zone.risk>=60?"HIGHER":"LOWER"} INDEX · {zone.risk}</span></div><Progress label="Demo moisture input" value={zone.moisture} color="bg-sky-500"/><Progress label="Mean speed index" value={zone.load} color="bg-orange-500"/><div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-3"><span className="flex items-center gap-2 text-xs font-bold text-slate-700"><Gauge size={16}/>Risk score (50% each)</span><b className="text-sm">{zone.risk}/100</b></div></article>)}</div>
    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5"><div className="flex items-start gap-3"><AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600"/><div><p className="text-sm font-bold text-amber-900">Risk interpretation</p><p className="mt-1 text-xs leading-5 text-amber-800">This index is a demonstration only. It cannot establish actual road conditions or safe speeds; use verified field measurements and engineering review for decisions.</p></div></div></div>
  </div>;
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string|number}) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-sky-600">{icon}</div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-slate-900">{value}</p></div>; }
function Progress({label,value,color}:{label:string;value:number;color:string}) { return <div className="mt-5"><div className="mb-2 flex justify-between text-xs"><span className="font-bold text-slate-700">{label}</span><b>{value}%</b></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${color}`} style={{width:`${value}%`}}/></div></div>; }
