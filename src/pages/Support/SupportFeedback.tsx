import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchNormal, Calendar, Export, Refresh2 } from "iconsax-react";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketDrawer } from "./components/TicketDrawer";
import { useTickets, useTicketStats } from "./apis/useSupport";
import empty from "@/assets/emptyIllustration.png"

export const SupportFeedback = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all-status");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 👉 Fetch real metrics
  const { data: statsData, isLoading: isLoadingStats } = useTicketStats();
  
  // 👉 Fetch real tickets list
  const { data: ticketsData, isLoading: isLoadingTickets, refetch } = useTickets({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter !== "all-status" ? statusFilter : undefined,
  });

  const tickets = ticketsData?.tickets || ticketsData?.data || [];
  const totalPages = ticketsData?.totalPages || 1;
  const stats = statsData?.stats || statsData || { total: 0, pending: 0, inProgress: 0, closed: 0 };

  const columns: ColumnDef<any>[] = [
    {
      key: 'checkbox',
      label: '',
      headerClassName: 'w-12 pl-4',
      cellClassName: 'pl-4',
      render: () => <input type="checkbox" className="rounded border-slate-300 text-[#0F4BAB] focus:ring-[#0F4BAB]" />
    },
    { key: 'ticketId', label: 'Ticket ID', cellClassName: 'text-[#475467] text-sm font-medium ', render: (item) => item.id || item._id?.substring(0, 8) },
    {
      key: 'users',
      label: 'Users',
      render: (item) => {
        const name = item.user?.name || item.user?.firstName || "Unknown User";
        const email = item.user?.email || "No email";
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
        );
      }
    },
    { 
      key: 'dateCreated', 
      label: 'Date Created', 
      cellClassName: 'text-[#475467] text-sm',
      render: (item) => {
        const date = new Date(item.createdAt || Date.now());
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    },
    { key: 'title', label: 'Title', cellClassName: 'font-medium text-slate-900 text-sm', render: (item) => item.title || item.subject },
    { key: 'category', label: 'Category', cellClassName: 'text-[#475467] text-sm capitalize' },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const statusStr = (item.status || "Open").toLowerCase();
        
        const styles: Record<string, string> = {
          closed: "bg-emerald-50 text-emerald-700",
          resolved: "bg-emerald-50 text-emerald-700",
          "in progress": "bg-orange-50 text-orange-700",
          open: "bg-orange-50 text-orange-700",
          pending: "bg-yellow-50 text-yellow-700"
        };
        
        const dotColor: Record<string, string> = {
          closed: "bg-emerald-500",
          resolved: "bg-emerald-500",
          "in progress": "bg-orange-500",
          open: "bg-orange-500",
          pending: "bg-yellow-500"
        };

        const activeStyle = styles[statusStr] || "bg-slate-50 text-slate-700";
        const activeDot = dotColor[statusStr] || "bg-slate-500";
        const displayStatus = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${activeStyle}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${activeDot}`}></span>
            {displayStatus}
          </span>
        );
      }
    }
  ];

  const headerActions = (
    <Button className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
      <Export size="18" color="white" className="mr-2" /> Export
    </Button>
  );
const ticketsEmptyState = (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center overflow-y-hidden">
     <img src={empty} alt="" />
      <h3 className="text-lg font-bold text-slate-900 mb-2">No tickets here</h3>
      <p className="text-sm text-[#475467] max-w-sm mb-6 leading-relaxed">
        There are no available support tickets here. Come back later.
      </p>
      <Button 
        onClick={() => refetch()} 
        className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white px-6 cursor-pointer"
      >
        <Refresh2 size="18" className="mr-2" color="white"/> Reload
      </Button>
    </div>
  );
  return (
    <AdminLayout 
      title="Support and Feedback" 
      subtitle="View, manage, and keep track of user complaints."
      headerActions={headerActions}
    >
      <div className="flex flex-col gap-6 h-full pb-6">
        
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider mb-2 uppercase">All Tickets</p>
            <h2 className="text-2xl font-bold text-slate-900">{isLoadingStats ? "..." : (stats.total || 0).toLocaleString()}</h2>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider mb-2 uppercase">Pending</p>
            <h2 className="text-2xl font-bold text-slate-900">{isLoadingStats ? "..." : (stats.pending || 0).toLocaleString()}</h2>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider mb-2 uppercase">In Progress</p>
            <h2 className="text-2xl font-bold text-slate-900">{isLoadingStats ? "..." : (stats.inProgress || stats.open || 0).toLocaleString()}</h2>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 tracking-wider mb-2 uppercase">Closed</p>
            <h2 className="text-2xl font-bold text-slate-900">{isLoadingStats ? "..." : (stats.closed || stats.resolved || 0).toLocaleString()}</h2>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
          
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={(val: any) => { setCategoryFilter(val); setPage(1); }}>
                <SelectTrigger className="w-32 h-9 text-[#475467]">
                  <SelectValue placeholder="Ticket Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="bug">Bugs</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={(val: any) => { setStatusFilter(val); setPage(1); }}>
                <SelectTrigger className="w-32 h-9 text-[#475467]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="open">In Progress / Open</SelectItem>
                  <SelectItem value="closed">Closed / Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 max-w-md relative">
              <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
              <Input 
                placeholder="Search by category or username" 
                className="pl-9 h-9 text-[#475467] placeholder:text-[#475467]/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button variant="outline" className="h-9 px-3 text-[#475467]">
              <Calendar size="16" className="mr-2" color="#475467" /> Select dates
            </Button>
          </div>
          
          {/* Main Table */}
          <div className="flex-1 min-h-[300px]">
            <DataTable
              columns={columns}
              data={tickets}
              isLoading={isLoadingTickets}
              keyExtractor={(item) => item.id || item._id}
              onRowClick={(item) => setSelectedTicket(item)}
              emptyState={ticketsEmptyState}
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

      {/* Ticket Slide-out Drawer */}
      <TicketDrawer 
        isOpen={!!selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
        ticketId={selectedTicket?.id || selectedTicket?._id}
        initialTicket={selectedTicket} 
      />
    </AdminLayout>
  );
};