import { useEffect, useMemo, useRef, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { LocateFixed, Map as MapIcon, Minus, Plus, RotateCcw, Search } from "lucide-react";
import type { Map as LeafletMap } from "leaflet";
import type { Vehicle, VehicleStatus } from "../types/fleet";
import { getVehicleStatus } from "../utils/diagnostics";
import { isValidCoordinate } from "../data/fleetProvider";

interface FleetMapProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

const defaultCenter: [number, number] = [-1.9441, 30.0619];
const statusColors: Record<VehicleStatus, string> = { HEALTHY: "#20e3a2", WARNING: "#ffbe55", CRITICAL: "#ff5263" };

export default function FleetMap({ vehicles, onVehicleSelect, selectedVehicleId }: FleetMapProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | VehicleStatus>("ALL");
  const [tilesFailed, setTilesFailed] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const validVehicles = useMemo(() => vehicles.filter((vehicle) => isValidCoordinate(vehicle.lat, vehicle.lng)), [vehicles]);
  const visibleVehicles = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim().replace(/\s+/g, " ");
    return validVehicles.filter((vehicle) => {
      const status = getVehicleStatus(vehicle.temperature, vehicle.oilPressure);
      return (statusFilter === "ALL" || status === statusFilter)
        && (!normalizedQuery || vehicle.id.toLowerCase().replace(/\s+/g, " ").includes(normalizedQuery) || vehicle.route.toLowerCase().replace(/\s+/g, " ").includes(normalizedQuery));
    });
  }, [validVehicles, query, statusFilter]);

  const fitVisible = () => {
    const map = mapRef.current;
    if (!map || visibleVehicles.length === 0) return;
    if (visibleVehicles.length === 1) map.setView([visibleVehicles[0].lat, visibleVehicles[0].lng], 14);
    else map.fitBounds(visibleVehicles.map((vehicle) => [vehicle.lat, vehicle.lng]), { padding: [36, 36], maxZoom: 14 });
  };
  const centerSelected = () => {
    const selected = validVehicles.find((vehicle) => vehicle.id === selectedVehicleId);
    if (selected) mapRef.current?.setView([selected.lat, selected.lng], 15);
  };

  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="border-b border-slate-100 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Fleet Map</h2><p className="mt-1 text-xs text-slate-500">SIMULATED LOCATION · {validVehicles.length} vehicles with valid coordinates · &copy; OpenStreetMap contributors</p></div><MapIcon size={19} className="text-sky-500"/></div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-48 flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input aria-label="Search map by vehicle or route" value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search vehicle or route" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs"/></label>
        <select aria-label="Filter map by status" value={statusFilter} onChange={(event)=>setStatusFilter(event.target.value as "ALL" | VehicleStatus)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"><option value="ALL">All statuses</option><option value="HEALTHY">Healthy</option><option value="WARNING">Warning</option><option value="CRITICAL">Critical</option></select>
        <button type="button" title="Zoom in" aria-label="Zoom in" onClick={()=>mapRef.current?.zoomIn()} className="rounded-lg border border-slate-200 p-2 text-slate-700"><Plus size={15}/></button>
        <button type="button" title="Zoom out" aria-label="Zoom out" onClick={()=>mapRef.current?.zoomOut()} className="rounded-lg border border-slate-200 p-2 text-slate-700"><Minus size={15}/></button>
        <button type="button" onClick={centerSelected} disabled={!validVehicles.some((vehicle)=>vehicle.id===selectedVehicleId)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"><LocateFixed size={14}/>Selected</button>
        <button type="button" onClick={fitVisible} disabled={visibleVehicles.length===0} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50">Fit fleet</button>
        <button type="button" onClick={()=>mapRef.current?.setView(defaultCenter,12)} className="rounded-lg border border-slate-200 p-2 text-slate-700" title="Return to default fleet view" aria-label="Return to default fleet view"><RotateCcw size={14}/></button>
      </div>
    </div>
    {tilesFailed && <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800" role="status">Map tiles are unavailable. Vehicle coordinates and telemetry remain available; check the network or tile provider.</div>}
    {validVehicles.length === 0 ? <div className="grid h-72 place-items-center p-8 text-center text-sm text-slate-500">No vehicles have valid coordinates. No substitute locations are shown.</div> : <div className="relative h-[600px] w-full">
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom className="h-full w-full">
        <MapReference mapRef={mapRef}/>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>' url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" eventHandlers={{tileerror:()=>setTilesFailed(true)}}/>
        {visibleVehicles.map((vehicle)=>{
          const status = getVehicleStatus(vehicle.temperature, vehicle.oilPressure);
          const selected = vehicle.id === selectedVehicleId;
          return <CircleMarker key={vehicle.id} center={[vehicle.lat,vehicle.lng]} radius={selected?13:9} pathOptions={{color:selected?"#2583ff":statusColors[status],fillColor:statusColors[status],fillOpacity:.9,weight:selected?4:2}} eventHandlers={{click:()=>onVehicleSelect?.(vehicle)}}>
            <Tooltip direction="top">{vehicle.id} · {status}</Tooltip>
            <Popup><div className="min-w-48"><strong>{vehicle.id}</strong><p className="mt-1">Route: {vehicle.route}</p><p>Location: {vehicle.location}</p><p>Speed: {vehicle.speed} km/h · Temp: {vehicle.temperature}°C</p><p>Oil: {vehicle.oilPressure} PSI · RPM: {vehicle.rpm}</p><p>Status: {status}</p><p>Source: {vehicle.sourceStatus ?? "SIMULATED"}</p><p>Updated: {vehicle.lastUpdatedAt ? new Date(vehicle.lastUpdatedAt).toLocaleTimeString() : "Unavailable"}</p><button type="button" onClick={()=>onVehicleSelect?.(vehicle)} className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Open details</button></div></Popup>
          </CircleMarker>;
        })}
      </MapContainer>
      {visibleVehicles.length===0 && <div className="absolute z-[500] mt-[-4rem] w-full text-center text-sm text-slate-700">No vehicles match these filters.</div>}
    </div>}
  </div>;
}

function MapReference({mapRef}:{mapRef:{current:LeafletMap|null}}) { const map=useMap(); useEffect(()=>{mapRef.current=map; return ()=>{mapRef.current=null;};},[map,mapRef]); return null; }
