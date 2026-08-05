import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchNormal, Add, Trash } from "iconsax-react";
import { useMessages, useTrashMessage, type GetMessagesParams } from "./apis/useMessages";
// import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";



export const EmailsNotifications = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Emails");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
// 👉 2. Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
      setSelectedItems([]); // Clear selections on search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 👉 3. Map Tabs to API Parameters
  const getTabParams = (tab: string): Partial<GetMessagesParams> => {
    switch (tab) {
      case 'Emails': return { channel: 'email', status: 'sent' };
      case 'Push': return { channel: 'push', status: 'sent' };
      case 'Draft': return { status: 'draft' };
      case 'Trash': return { status: 'trash' };
      default: return { channel: 'email', status: 'sent' };
    }
  };

  // 👉 4. Fetch Real Data
  const { data, isLoading } = useMessages({
    ...getTabParams(activeTab),
    search: debouncedSearch || undefined,
    page,
    limit: 10,
  });

  const { mutateAsync: _trashMessage, isPending: isTrashing } = useTrashMessage();

  const messages = data?.messages || data?.data || [];
  const totalPages = data?.totalPages || 1;

  const toggleSelectAll = () => {
    if (selectedItems.length === messages.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(messages.map((item: any) => item.id || item._id));
    }
  };

  const toggleSelectItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking the row from firing
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

//   const handleBulkDelete = async () => {
//     try {
//       // Execute trash mutations concurrently for selected items
//       await Promise.all(selectedItems.map(id => trashMessage(id)));
//       toast.success(`${selectedItems.length} messages moved to trash.`);
//       setSelectedItems([]);
//     } catch (error) {
//       toast.error("Failed to delete some messages.");
//     }
//   };

 const pageActions = (
    <Button  className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
      <Link to="/dashboard/content/emails/compose" className="flex items-center">
        <Add size="18" color="white" className="mr-2" /> Compose Email
      </Link>
    </Button>
  );

  return (
    <AdminLayout 
      title="Emails and Notifications" 
      subtitle="Keep track of user subscriptions, churn rate, and your revenue."
      headerActions={pageActions}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        
        {/* Toolbar Bar (Search & Tabs) */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
            <Input 
              placeholder="Search by email or username" 
              className="pl-9 h-9 text-[#475467] placeholder:text-[#475467]/70"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            {['Emails', 'Push', 'Draft', 'Trash'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                  setSelectedItems([]);
                }}
                className={`pb-1 transition-colors ${
                  activeTab === tab 
                    ? 'text-[#0F4BAB] border-b-2 border-[#0F4BAB] font-semibold' 
                    : 'text-[#475467] hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table Header Row */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-[#475467]">
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={messages.length > 0 && selectedItems.length === messages.length}
              onChange={toggleSelectAll}
              className="rounded border-slate-300 text-[#0F4BAB] focus:ring-[#0F4BAB]" 
            />
            <span>Users</span>
          </div>
          {selectedItems.length > 0 && (
            <button className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium">
              <Trash size="16" color="#DC2626" /> {isTrashing ? "Deleting..." : `Delete (${selectedItems.length})`}
            </button>
          )}
        </div>

        {/* Notification List Items */}
        <div className="divide-y divide-slate-100 min-h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center text-[#475467]">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-[#475467]">No messages found.</div>
          ) : (
            messages.map((item: any) => {
              const id = item.id || item._id;
              const isChecked = selectedItems.includes(id);
              
              // Format date string safely
              const date = new Date(item.createdAt || Date.now());
              const timeString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div 
                  key={id} 
                  onClick={() => navigate(`/dashboard/content/emails/${id}`)}
                  className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => toggleSelectItem(id, e as any)}
                        className="mt-1.5 rounded border-slate-300 text-[#0F4BAB] focus:ring-[#0F4BAB] cursor-pointer" 
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#475467] font-medium">To: {item.recipients || "Unknown group"}</p>
                      <h4 className="text-sm font-bold text-slate-900">{item.subject || "No Subject"}</h4>
                      <p className="text-xs text-[#475467] line-clamp-1 max-w-2xl">{item.body || "No preview available..."}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#475467] whitespace-nowrap pt-1">{timeString}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-[#475467]">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[#475467]"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[#475467]"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages || isLoading}
          >
            Next
          </Button>
        </div>

      </div>
    </AdminLayout>
  );
};