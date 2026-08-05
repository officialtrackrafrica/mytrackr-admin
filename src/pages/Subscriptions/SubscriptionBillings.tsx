import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchNormal, Filter, Refresh } from "iconsax-react";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaginationBar } from "@/components/ui/PaginationBar";

// Import your newly created components
import { MetricsCards } from "./components/MetricsCards";
import { RevenueChart } from "./components/RevenueChart";
import { ChurnChart } from "./components/ChurnChart";
import { SubscriptionHistory } from "./components/SubscriptionHistory";
import { useTransactions } from "@/components/hooks/useTransactions";
import { useUsers } from "../Users/apis/useUser";

// Mock Data for the table visually matching the design
const mockBillingData = [
  { id: 1, name: "Olivia Rhye", email: "olivia@untitledui.com", date: "Wed 1:00pm", plan: "Starter", amount: "500", status: "Active" },
  { id: 2, name: "Olivia Jane", email: "olivia@untitledui.com", date: "Wed 7:20am", plan: "Solo", amount: "80", status: "Active" },
  { id: 3, name: "Jane Doe", email: "doe@untitledui.com", date: "Wed 2:45am", plan: "Duo", amount: "1,239", status: "Active" },
  { id: 4, name: "Olivia Jane", email: "olivia@untitledui.com", date: "Tue 6:10pm", plan: "Unlimited", amount: "+ $88.00", status: "Active" },
  { id: 5, name: "Olivia Jane", email: "olivia@untitledui.com", date: "Tue 7:52am", plan: "Solo", amount: "- $12.50", status: "Cancelled" },
  { id: 6, name: "Olivia Jane", email: "olivia@untitledui.com", date: "Tue 12:15pm", plan: "Solo", amount: "- $40.20", status: "Due" },
  { id: 7, name: "Olivia Jane", email: "olivia@untitledui.com", date: "Tue 5:40am", plan: "Solo", amount: "+ $88.00", status: "Active" },
  { id: 8, name: "Olivia Jane", email: "olivia@untitledui.com", date: "Tue 5:40am", plan: "Solo", amount: "+ $88.00", status: "Cancelled" },
];

export const SubscriptionBillings = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

 const { data, isLoading, refetch, isRefetching } = useUsers({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  });

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const totalUsers = data?.total || 0;

  const columns: ColumnDef<any>[] = [
    {
      key: 'checkbox',
      label: '',
      headerClassName: 'w-12 pl-4',
      cellClassName: 'pl-4',
      render: () => <input type="checkbox" className="rounded border-slate-300 text-[#0F4BAB] focus:ring-[#0F4BAB]" />
    },
    {
      key: 'users',
      label: 'Users',
      render: (user) => {
        const name = user.name || user.firstName || "Unknown User";
        const email = user.email || "No email provided";
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                {name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-sm">{name}</span>
              <span className="text-[#475467] text-xs">{email}</span>
            </div>
          </div>
        )
      }
    },
    { 
      key: 'date', 
      label: 'Billing date', 
      cellClassName: 'text-[#475467] text-sm',
      render: (user) => {
        const date = user.createdAt || user.subscriptionDate;
        return date ? new Date(date).toLocaleString('en-US', { 
          weekday: 'short', hour: 'numeric', minute: 'numeric' 
        }) : 'N/A';
      }
    },
    { 
      key: 'plan', 
      label: 'Plan', 
      cellClassName: 'font-medium text-slate-900 text-sm capitalize',
      render: (user) => user.plan?.name || user.planType || 'None'
    },
    { 
      key: 'amount', 
      label: 'Amount', 
      cellClassName: 'text-[#475467] text-sm',
      render: (user) => {
        // Fallback to 0 if no specific amount is attached to the user plan yet
        const amount = Number(user.planPrice || user.amount) || 0;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => {
        const statusStr = (user.accountStatus || user.status || "Unknown").charAt(0).toUpperCase() + (user.accountStatus || user.status || "Unknown").slice(1).toLowerCase();
        
        const styles: Record<string, string> = {
          Active: "bg-emerald-50 text-emerald-700",
          Cancelled: "bg-red-50 text-red-700",
          Suspended: "bg-red-50 text-red-700",
          Due: "bg-orange-50 text-orange-700",
        };
        
        const dotColor: Record<string, string> = {
          Active: "bg-emerald-500",
          Cancelled: "bg-red-500",
          Suspended: "bg-red-500",
          Due: "bg-orange-500",
        };

        const activeStyle = styles[statusStr] || "bg-slate-50 text-slate-700";
        const activeDot = dotColor[statusStr] || "bg-slate-500";

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${activeStyle}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${activeDot}`}></span>
            {statusStr}
          </span>
        );
      }
    }
  ];

  const pageActions = (
    <Button className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
      Manage Plan
    </Button>
  );

  return (
    <AdminLayout 
      title="Subscription and Billings" 
      subtitle="Keep track of user subscriptions, churn rate, and your revenue."
      headerActions={pageActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Takes up 2/3 of space) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <MetricsCards />
          <RevenueChart />
          
         <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">All Users</span>
                <span className="bg-[#0F4BAB] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {totalUsers}
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
                  <Input 
                    placeholder="Search by email or name" 
                    className="pl-9 h-9 text-[#475467] placeholder:text-[#475467]/70"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="h-9 px-3 text-[#475467]">
                  <Filter size="16" className="mr-2" color="#475467" /> Sort & Filter
                </Button>
                <Button 
                  variant="outline" 
                  className="h-9 px-3 text-[#475467]"
                  onClick={() => refetch()}
                  disabled={isRefetching}
                >
                  <Refresh size="16" className={`mr-2 ${isRefetching ? 'animate-spin' : ''}`} color="#475467" /> 
                  Update
                </Button>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <DataTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                keyExtractor={(item) => item.id || item._id}
                pagination={
                  <PaginationBar 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onNext={() => setPage(p => p + 1)} 
                    onPrevious={() => setPage(p => p - 1)} 
                  />
                }
              />
            </div>
          </div>
        </div>

        {/* Right Column (Takes up 1/3 of space) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ChurnChart />
          <SubscriptionHistory />
        </div>

      </div>
    </AdminLayout>
  );
};