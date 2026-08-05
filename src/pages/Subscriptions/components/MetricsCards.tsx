import { usePlatformStats } from "@/components/hooks/useAdminStats";
import { ArrowUp, ArrowDown } from "iconsax-react";

export const MetricsCards = () => {
  //  Fetch real data from your endpoint
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

  // 👉 Map the API response to the cards
  const metrics = [
    { 
      label: "ACTIVE", 
      value: stats?.activeSubscriptions?.toLocaleString() || "0", 
      growth: stats?.activeGrowth || "+0%",
      up: (stats?.activeGrowth || "+").startsWith("+")
    },
    { 
      label: "CANCELLED", 
      value: stats?.cancelledSubscriptions?.toLocaleString() || "0", 
      growth: stats?.cancelledGrowth || "+0%",
      up: (stats?.cancelledGrowth || "+").startsWith("+") 
    },
    { 
      label: "PAST-DUE", 
      value: stats?.pastDueSubscriptions?.toLocaleString() || "0", 
      growth: stats?.pastDueGrowth || "+0%",
      up: (stats?.pastDueGrowth || "+").startsWith("+")
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
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${metric.up ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
            {metric.up ? <ArrowUp size="12" color="#10B981" className="mr-1" /> : <ArrowDown size="12" color="#EF4444" className="mr-1" />}
            {metric.growth}
          </div>
        </div>
      ))}
    </div>
  );
};