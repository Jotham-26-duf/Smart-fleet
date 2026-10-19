import { Bell, Search, Wifi } from "lucide-react";
import type { DataSourceStatus } from "../types/fleet";

interface TopbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sourceStatus: DataSourceStatus;
  lastUpdatedAt: string;
  onNavigate: (page: string) => void;
}

function Topbar({ searchTerm, onSearchChange, sourceStatus, lastUpdatedAt, onNavigate }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          aria-label="Search vehicles, routes, and locations"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search vehicles, routes, locations..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* System controls */}
      <div className="ml-6 flex items-center gap-5">
        {/* Live status */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>

          <div>
            <p className="text-xs font-bold text-slate-800">{sourceStatus}</p>
            <p className="text-[10px] text-slate-400">Updated {new Date(lastUpdatedAt).toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Network */}
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-5 md:flex">
          <Wifi size={18} className="text-slate-500" />
          <span className="text-xs font-semibold text-slate-500">Local simulation</span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Open dashboard alert overview"
          onClick={() => onNavigate("dashboard")}
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
