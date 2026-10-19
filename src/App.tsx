import { Component, lazy, Suspense, useMemo, useState, type ErrorInfo, type ReactNode } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import VehicleDetailsModal from "./components/VehicleDetailsModal";

import { useFleetSimulation } from "./hooks/useFleetSimulation";
import { getVehicleStatus } from "./utils/diagnostics";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Fleet = lazy(() => import("./pages/Fleet"));
const FleetMapPage = lazy(() => import("./pages/FleetMapPage").then(m => ({ default: m.FleetMapPage })));
const Traffic = lazy(() => import("./pages/Traffic"));
const Security = lazy(() => import("./pages/Security"));
const Accidents = lazy(() => import("./pages/Accidents"));
const Parking = lazy(() => import("./pages/Parking.tsx"));
const RoadRisk = lazy(() => import("./pages/RoadRisk"));
const Reports = lazy(() => import("./pages/Reports"));

import type { Vehicle } from "./types/fleet";

function App() {
const [activePage, setActivePage] = useState("dashboard");
const [searchTerm, setSearchTerm] = useState("");
const [selectedVehicle, setSelectedVehicle] =
useState<Vehicle | null>(null);

const { vehicles, resetSimulation, status: sourceStatus, lastUpdatedAt } = useFleetSimulation();
const handleResetSimulation = () => {
  if (window.confirm("Reset all simulated vehicle telemetry and positions?")) {
    resetSimulation();
    setSelectedVehicle(null);
  }
};
const currentVehicles = useMemo(
  () => vehicles.map((vehicle) => ({
    ...vehicle,
    status: getVehicleStatus(vehicle.temperature, vehicle.oilPressure),
  })),
  [vehicles],
);

const filteredVehicles = useMemo(() => {
const search = searchTerm.toLowerCase().trim().replace(/\s+/g, " ");


if (!search) {
  return currentVehicles;
}

return currentVehicles.filter(
  (vehicle) =>
    vehicle.id.toLowerCase().replace(/\s+/g, " ").includes(search) ||
    vehicle.route.toLowerCase().replace(/\s+/g, " ").includes(search) ||
    vehicle.location.toLowerCase().replace(/\s+/g, " ").includes(search),
);


}, [currentVehicles, searchTerm]);

const handleVehicleSelect = (vehicle: Vehicle) => {
setSelectedVehicle(vehicle);
};

const renderPage = () => {
switch (activePage) {
case "dashboard":
return ( <Dashboard
         vehicles={filteredVehicles}
         onVehicleSelect={handleVehicleSelect}
         selectedVehicleId={selectedVehicle?.id}
         onNavigate={setActivePage}
         onResetSimulation={handleResetSimulation}
       />
);


  case "fleet":
    return (
      <Fleet
        vehicles={filteredVehicles}
        onVehicleSelect={handleVehicleSelect}
      />
    );

  case "fleet-map":
    return (
      <FleetMapPage
        vehicles={filteredVehicles}
        onVehicleSelect={handleVehicleSelect}
        selectedVehicleId={selectedVehicle?.id}
      />
    );

  case "traffic":
    return <Traffic vehicles={filteredVehicles} />;

  case "security":
return <Security vehicles={filteredVehicles} />;

  case "accidents":
return <Accidents vehicles={filteredVehicles} />;

  case "parking":
return <Parking vehicles={filteredVehicles} />;

  case "road-risk":
return <RoadRisk vehicles={filteredVehicles} />;

  case "reports":
return <Reports vehicles={filteredVehicles} />;

  default:
    return (
      <Dashboard
        vehicles={filteredVehicles}
        onVehicleSelect={handleVehicleSelect}
        selectedVehicleId={selectedVehicle?.id}
        onNavigate={setActivePage}
        onResetSimulation={handleResetSimulation}
      />
    );
}


};

return ( <div className="min-h-screen bg-slate-50"> <Sidebar
     activePage={activePage}
     onNavigate={setActivePage}
   />


  <div className="app-main ml-64 min-h-screen">
    <Topbar
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      sourceStatus={sourceStatus}
      lastUpdatedAt={lastUpdatedAt}
      onNavigate={setActivePage}
    />

    <main className="p-4 md:p-6">
      <PageErrorBoundary key={activePage}>
        <Suspense fallback={<div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500" role="status">Loading page…</div>}>
          {renderPage()}
        </Suspense>
      </PageErrorBoundary>
    </main>
  </div>

  {selectedVehicle && (
    <VehicleDetailsModal
      vehicle={currentVehicles.find((vehicle) => vehicle.id === selectedVehicle.id) ?? selectedVehicle}
      onClose={() => setSelectedVehicle(null)}
    />
  )}
</div>


);
}

export default App;

class PageErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error("Page rendering failed", error, info.componentStack); }
  render() {
    if (this.state.hasError) return <div className="rounded-2xl border border-red-100 bg-white p-8" role="alert"><h2 className="font-bold text-slate-900">This page could not be displayed.</h2><p className="mt-2 text-sm text-slate-500">Try rendering the page again, or select another section from the sidebar.</p><button onClick={() => this.setState({ hasError: false })} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white">Try again</button></div>;
    return this.props.children;
  }
}
