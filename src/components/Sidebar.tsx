import {
  AlertTriangle,
  BarChart3,
  Bus,
  CarFront,
  CircleGauge,
  Droplets,
  LayoutDashboard,
  LockKeyhole,
  Map,
  ParkingSquare,
  TrafficCone,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "fleet",
    label: "Fleet",
    icon: Bus,
  },
  {
    id: "fleet-map",
    label: "Fleet Map",
    icon: Map,
  },
  {
    id: "traffic",
    label: "Traffic",
    icon: TrafficCone,
  },
  {
    id: "security",
    label: "Security",
    icon: LockKeyhole,
  },
  {
    id: "accidents",
    label: "Accidents",
    icon: AlertTriangle,
  },
  {
    id: "parking",
    label: "Parking",
    icon: ParkingSquare,
  },
  {
    id: "road-risk",
    label: "Road Risk",
    icon: Droplets,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
  },
];

function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="app-sidebar fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
            <CircleGauge size={22} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              SMART FLEET
            </h1>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Command Center
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="app-navigation flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={19} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Simulation status */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-800">
              SYSTEM ONLINE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CarFront size={14} />
            <span>Software Simulation</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
