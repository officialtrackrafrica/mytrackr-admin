import { usePlatformStats } from "@/components/hooks/useAdminStats";
import { ArrowUp } from "iconsax-react";

export const MetricsCards = () => {
  const { data: stats, isLoading } = usePlatformStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const metrics = [
    { 
      label: "ACTIVE", 
      value: stats?.activeSubscriptions?.toLocaleString() || stats?.activeUsers?.toLocaleString() || "0", 
      growth: stats?.activeGrowth || "+0%" 
    },
    { 
      label: "CANCELLED", 
      value: stats?.cancelledSubscriptions?.toLocaleString() || stats?.cancelledUsers?.toLocaleString() || "0", 
      growth: stats?.cancelledGrowth || "+0%" 
    },
    { 
      label: "PAST-DUE", 
      value: stats?.pastDueSubscriptions?.toLocaleString() || stats?.pastDueUsers?.toLocaleString() || "0", 
      growth: stats?.pastDueGrowth || "+0%" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 tracking-wider mb-2">{metric.label}</p>
            <h2 className="text-2xl font-bold text-slate-900">{metric.value}</h2>
          </div>
          <div className="flex items-center text-emerald-500 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full">
            <ArrowUp size="12" color="#10B981" className="mr-1" />
            {metric.growth}
          </div>
        </div>
      ))}
    </div>
  );
};