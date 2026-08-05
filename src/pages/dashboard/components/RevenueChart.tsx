import { useFinancialSummary } from "@/components/hooks/useAdminStats";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DocumentDownload } from "iconsax-react";
import { Button } from "@/components/ui/button";

export const RevenueChart = () => {
  const { data, isLoading } = useFinancialSummary();

  const chartData = data?.monthlyBreakdown || [
    { name: 'JAN', total: 0 }, { name: 'FEB', total: 0 },
    { name: 'MAR', total: 0 }, { name: 'APR', total: 0 },
    { name: 'MAY', total: 0 }, { name: 'JUN', total: 0 },
    { name: 'JUL', total: 0 }, { name: 'AUG', total: 0 },
    { name: 'SEP', total: 0 }, { name: 'OCT', total: 0 },
    { name: 'NOV', total: 0 }, { name: 'DEC', total: 0 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Monthly Recurring Revenue</h3>
          <div className="flex items-center gap-2 mt-1">
            <h2 className="text-2xl font-bold text-slate-900">
              {isLoading ? "..." : `$${data?.totalRevenue ? (data.totalRevenue / 1000).toFixed(1) + "k" : "0.0k"}`}
            </h2>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              {data?.growthPercentage || "+0%"}
            </span>
            <span className="text-xs text-slate-400">VS LAST YEAR</span>
          </div>
        </div>
        <Button variant="outline" className="h-8 text-xs text-[#475467]">
          <DocumentDownload size="14" color="#475467" className="mr-2" /> Export PDF
        </Button>
      </div>

      <div className="h-[250px] w-full">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#135ED6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#135ED6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val / 1000}k`} />
              <CartesianGrid vertical={false} stroke="#f1f5f9" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#0F4BAB', strokeWidth: 2 }}
              />
              <Area type="monotone" dataKey="total" stroke="#135ED6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};