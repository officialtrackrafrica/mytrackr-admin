import { CloseSquare } from "iconsax-react";
import { useSubscriptionHistory } from "../apis/useSubscriptions";


// Helper to format timestamps exactly like your design
const timeAgo = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const SubscriptionHistory = () => {
  //  Fetch the real data
  const { data, isLoading } = useSubscriptionHistory({ limit: 5 });
  
  // Safely extract the array
  const historyList = data?.subscriptions || data?.data || [];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 h-[400px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="font-bold text-slate-900">Subscription history</h3>
        <button className="text-[#475467] hover:text-slate-900 transition-colors">
          <CloseSquare size="20" color="currentColor" />
        </button>
      </div>
      
      <div className="space-y-6 overflow-y-auto pr-2 flex-1">
        {isLoading ? (
          <div className="text-center text-sm text-[#475467] py-8">Loading history...</div>
        ) : historyList.length === 0 ? (
          <div className="text-center text-sm text-[#475467] py-8">No recent subscription history.</div>
        ) : (
          historyList.map((item: any, index: number) => {
            // Normalize API data shapes (adjust these mappings based on your actual API response)
            const status = item.status?.toLowerCase() || 'success';
            const name = item.user?.firstName ? `${item.user.firstName} ${item.user.lastName}` : item.userName || item.name || 'Unknown User';
            const planName = item.plan?.name || item.planName || '';
            const actionText = item.action || (status === 'success' ? 'Upgraded to' : status === 'cancelled' ? 'Cancelled' : 'Failed subscription payment');
            
            return (
              <div key={item.id || item._id || index} className="flex items-start justify-between text-sm">
                <div className="flex items-start gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    status === 'success' || status === 'active' ? 'bg-emerald-500' : 
                    status === 'cancelled' || status === 'failed' ? 'bg-red-500' : 
                    'bg-slate-300'
                  }`}></span>
                  <div>
                    <p className="font-medium text-slate-900">{name}</p>
                    <p className="text-[#475467]">
                      <span className={status === 'cancelled' || status === 'failed' ? 'text-red-500 font-medium' : ''}>
                        {actionText}
                      </span> 
                      {planName && <span className="text-[#135ED6] font-medium ml-1">{planName}</span>}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {timeAgo(item.createdAt || item.date)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};