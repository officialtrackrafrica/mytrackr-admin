import { CloseSquare } from "iconsax-react";

const historyData = [
  { name: "Phoenix Baker", action: "Upgraded to", plan: "Premium", time: "Just now", status: "success" },
  { name: "Olivia Baker", action: "Failed subscription payment", plan: "", time: "15m ago", status: "failed" },
  { name: "Janet Doe", action: "Cancelled", plan: "plan", time: "20m ago", status: "cancelled" },
  { name: "John Doe", action: "Upgraded to", plan: "Premium", time: "1h ago", status: "success" },
  { name: "Phoenix Baker", action: "Upgraded to", plan: "Premium", time: "Just now", status: "success" },
  { name: "Phoenix Baker", action: "Upgraded to", plan: "Premium", time: "Just now", status: "success" },
  { name: "Phoenix Baker", action: "Upgraded to", plan: "Premium", time: "6h ago", status: "success" },
];

export const SubscriptionHistory = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">Subscription history</h3>
        <button className="text-[#475467] hover:text-slate-900">
          <CloseSquare size="20" color="#475467" />
        </button>
      </div>
      
      <div className="space-y-6 overflow-y-auto pr-2">
        {historyData.map((item, index) => (
          <div key={index} className="flex items-start justify-between text-sm">
            <div className="flex items-start gap-3">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.status === 'success' ? 'bg-emerald-500' : item.status === 'cancelled' ? 'bg-red-500' : 'bg-slate-300'}`}></span>
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-[#475467]">
                  <span className={item.status === 'cancelled' ? 'text-red-500 font-medium' : ''}>{item.action}</span> 
                  {item.plan && <span className="text-[#135ED6] font-medium ml-1">{item.plan}</span>}
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};