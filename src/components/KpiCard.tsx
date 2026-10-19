
import type { LucideIcon } from "lucide-react";

type KpiCardType = "blue" | "green" | "amber" | "red" | "slate";

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  type?: KpiCardType;
}

const typeStyles: Record<
  KpiCardType,
  {
    icon: string;
    background: string;
    value: string;
  }
> = {
  blue: {
    icon: "bg-sky-100 text-sky-600",
    background: "border-sky-100",
    value: "text-slate-900",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600",
    background: "border-emerald-100",
    value: "text-slate-900",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    background: "border-amber-100",
    value: "text-slate-900",
  },
  red: {
    icon: "bg-red-100 text-red-600",
    background: "border-red-100",
    value: "text-slate-900",
  },
  slate: {
    icon: "bg-slate-100 text-slate-600",
    background: "border-slate-200",
    value: "text-slate-900",
  },
};

function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  type = "blue",
}: KpiCardProps) {
  const styles = typeStyles[type];

  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.background}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className={`mt-2 text-3xl font-black ${styles.value}`}>
            {value}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          <Icon size={21} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}

export default KpiCard;

