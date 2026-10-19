import { useState } from "react";
import { AlertTriangle, BarChart3, CarFront, Download, FileText, ShieldCheck, TrafficCone } from "lucide-react";
import type { Vehicle } from "../types/fleet";
import { generateFleetAlerts, TELEMETRY_THRESHOLDS } from "../utils/diagnostics";
import { calculateFleetTraffic } from "../utils/traffic";

const reports = [
  {title:"Fleet Diagnostic Report",description:"Vehicle health, temperature, oil pressure, speed, and RPM.",icon:CarFront,type:"Fleet",kind:"fleet"},
  {title:"Traffic & Congestion Report",description:"Current fleet-derived congestion and monitored zones.",icon:TrafficCone,type:"Traffic",kind:"traffic"},
  {title:"Accident Risk Indicator Report",description:"Vehicles currently meeting the demo risk heuristic.",icon:AlertTriangle,type:"Safety",kind:"risk"},
  {title:"Security Monitoring Report",description:"Simulated vehicle locations and critical diagnostic states.",icon:ShieldCheck,type:"Security",kind:"security"},
];
export default function Reports({vehicles}:{vehicles:Vehicle[]}) {
 const alerts=generateFleetAlerts(vehicles), traffic=calculateFleetTraffic(vehicles);
 const [generatedAt,setGeneratedAt]=useState("");
 function download(kind:string, createdAt:string) {
   const rows:Record<string,unknown>[] = kind==="fleet" ? vehicles.map(v=>({vehicle:v.id,route:v.route,location:v.location,speed_kmh:v.speed,temperature_c:v.temperature,oil_pressure_psi:v.oilPressure,rpm:v.rpm,status:v.status})) : kind==="traffic" ? traffic.zones.map(z=>({zone:z.name,vehicles:z.vehicles,average_speed_kmh:z.averageSpeed,congestion_percent:z.congestion,status:z.status})) : kind==="risk" ? vehicles.filter(v=>v.speed>45&&(v.temperature>=TELEMETRY_THRESHOLDS.warningTemperature||v.oilPressure<TELEMETRY_THRESHOLDS.warningOilPressure)).map(v=>({vehicle:v.id,location:v.location,speed_kmh:v.speed,temperature_c:v.temperature,oil_pressure_psi:v.oilPressure,indicator:"Risk heuristic met; not an accident record"})) : vehicles.map(v=>({vehicle:v.id,route:v.route,location:v.location,diagnostic_status:v.status,critical_diagnostic_alerts:alerts.filter(a=>a.vehicleId===v.id&&a.severity==="CRITICAL").length,tracking:"Simulated position only"}));
   const columns=Object.keys(rows[0] ?? {message:"No matching records"});
   const exportColumns=[...columns,"generated_at"];
   const csv=[exportColumns.join(","),...rows.map(row=>exportColumns.map(column=>csvValue(column==="generated_at"?createdAt:row[column])).join(","))].join("\r\n");
   const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
   const url=URL.createObjectURL(blob), anchor=document.createElement("a"); anchor.href=url; anchor.download=`${kind}-report.csv`; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <div className="space-y-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600">Intelligence Center</p><h1 className="mt-1 text-2xl font-black text-slate-900">Reports &amp; Analytics</h1><p className="mt-1 text-sm text-slate-500">Export current fleet simulation readings as CSV reports.</p></div>
   <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4"><BarChart3 size={20} className="shrink-0 text-sky-600"/><div><p className="text-sm font-bold text-sky-900">SIMULATION REPORTING</p><p className="mt-1 text-xs text-sky-700">Exports contain current simulated readings generated in this browser, not live operational records.</p></div></div>
   <section className="grid gap-4 sm:grid-cols-3"><Metric icon={<FileText size={22}/>} label="Available Reports" value={reports.length}/><Metric icon={<ShieldCheck size={22}/>} label="Vehicles in Simulation" value={vehicles.length}/><Metric icon={<AlertTriangle size={22}/>} label="Current Diagnostic Alerts" value={alerts.length}/></section>
   <div className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-900">Report Center</h2><p className="mt-1 text-xs text-slate-500">Generate a downloadable CSV snapshot</p>{generatedAt&&<p className="mt-1 text-xs text-emerald-700" role="status">Last generated {generatedAt}</p>}</div><div className="grid gap-4 p-5 md:grid-cols-2">{reports.map(report=>{const Icon=report.icon;return <div key={report.kind} className="rounded-2xl border border-slate-200 p-5"><div className="flex items-start justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon size={21}/></div><span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">{report.type}</span></div><h3 className="mt-5 font-bold text-slate-900">{report.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{report.description}</p><button type="button" onClick={()=>{const time=new Date().toISOString();setGeneratedAt(time);download(report.kind,time)}} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"><Download size={14}/>Download CSV</button></div>})}</div></div>
   <p className="text-xs text-slate-500">Current simulated traffic average: {traffic.averageSpeed} km/h · Congestion: {traffic.averageCongestion}%</p>
 </div>;
}
function csvValue(value:unknown) { const text=String(value??""); return `"${text.replaceAll('"','""')}"`; }
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:number}) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-sky-600">{icon}</div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-slate-900">{value}</p></div>; }
