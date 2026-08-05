import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const data = [
  { name: "Lost customer churn", value: 25.42, color: "#0A1930" }, // Dark navy
  { name: "Retained customers", value: 86.49, color: "#135ED6" }  // Bright blue
];

export const ChurnChart = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[350px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">Churn rate</h3>
        <Select defaultValue="last-week">
          <SelectTrigger className="w-28 h-8 text-xs text-[#475467]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-week">Last week</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={0} outerRadius={100} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs mt-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0A1930]"></span>
          <span className="text-[#475467]">Lost customer churn <br/><span className="font-semibold text-slate-900">25.42%</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#135ED6]"></span>
          <span className="text-[#475467]">Retained customers <br/><span className="font-semibold text-slate-900">86.49%</span></span>
        </div>
      </div>
    </div>
  );
};