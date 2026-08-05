import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


interface PlanStat {
  planId: string;
  planName: string;
  churnRate: number;
  canceledSubscriptions: number;
}

interface ChurnChartProps {
  churnRate: number;
  plans?: PlanStat[];
}

export const ChurnChart = ({ churnRate = 0, plans = [] }: ChurnChartProps) => {
  // Calculate retained users
  const retainedRate = Math.max(0, 100 - churnRate);

  const data = [
    { name: "Lost customer churn", value: churnRate, color: "#0A1930" }, // Dark navy
    { name: "Retained customers", value: retainedRate, color: "#135ED6" }  // Bright blue
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[420px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h3 className="font-bold text-slate-900">Churn rate</h3>
        {/* <Select defaultValue="last-month">
          <SelectTrigger className="w-28 h-8 text-xs text-[#475467]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">Last week</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select> */}
      </div>
      
      {/* Pie Chart */}
      <div className="relative h-[180px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={0} outerRadius={80} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs mt-2 mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 min-w-[8px] rounded-full bg-[#0A1930]"></span>
          <span className="text-[#475467]">
            Lost customer churn <br/>
            <span className="font-semibold text-slate-900">{churnRate.toFixed(2)}%</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 min-w-[8px] rounded-full bg-[#135ED6]"></span>
          <span className="text-[#475467]">
            Retained customers <br/>
            <span className="font-semibold text-slate-900">{retainedRate.toFixed(2)}%</span>
          </span>
        </div>
      </div>

      {/* Per-Plan Churn List */}
      {plans.length > 0 && (
        <div className="flex flex-col flex-1 border-t border-slate-100 pt-4 overflow-hidden">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 shrink-0">Churn by Plan</h4>
          <div className="overflow-y-auto flex-1 pr-1 flex flex-col gap-3">
            {plans.map((plan) => (
              <div key={plan.planId} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{plan.planName}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#475467]">{plan.canceledSubscriptions} lost</span>
                  <span className="font-bold text-slate-900 w-12 text-right">{plan.churnRate.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};