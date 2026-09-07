import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchNormal, Add } from "iconsax-react";
import { FaqCard } from "./components/FAQCard";
import { toast } from "sonner";

// Import Hooks
import { useFaqs, useDeleteFaq } from "./apis/useFAQs";
import { useTerms, useDeleteTerm, usePolicies, useDeletePolicy } from "./apis/useLegals";

type TabType = "FAQs" | "Terms and Conditions" | "Policies";

export const FaqsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("FAQs");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // 1. Fetch Data for all tabs (React Query caches these efficiently)
  const queryParams = { search: debouncedSearch || undefined, page, limit: 10 };
  
  const { data: faqsData, isLoading: isLoadingFaqs } = useFaqs(queryParams);
  const { data: termsData, isLoading: isLoadingTerms } = useTerms(queryParams);
  const { data: policiesData, isLoading: isLoadingPolicies } = usePolicies(queryParams);

  // 2. Setup Mutations
  const { mutate: deleteFaq, isPending: isDeletingFaq } = useDeleteFaq();
  const { mutate: deleteTerm, isPending: isDeletingTerm } = useDeleteTerm();
  const { mutate: deletePolicy, isPending: isDeletingPolicy } = useDeletePolicy();

  // 3. Determine Active Data & States dynamically based on the selected tab
  let currentList: any[] = [];
  let isLoading = false;
  let isDeleting = false;
  let editBaseRoute = "";
  let addBaseRoute = "";

  if (activeTab === "FAQs") {
    currentList = faqsData?.faqs || faqsData?.data || [];
    isLoading = isLoadingFaqs;
    isDeleting = isDeletingFaq;
    editBaseRoute = "/dashboard/content/faqs";
    addBaseRoute = "/dashboard/content/faqs/new";
  } else if (activeTab === "Terms and Conditions") {
    currentList = termsData?.terms || termsData?.data || [];
    isLoading = isLoadingTerms;
    isDeleting = isDeletingTerm;
    editBaseRoute = "/dashboard/content/terms";
    addBaseRoute = "/dashboard/content/terms/new";
  } else if (activeTab === "Policies") {
    currentList = policiesData?.policies || policiesData?.data || [];
    isLoading = isLoadingPolicies;
    isDeleting = isDeletingPolicy;
    editBaseRoute = "/dashboard/content/policies";
    addBaseRoute = "/dashboard/content/policies/new";
  }

  // 4. Handle Deletion based on the active tab
  const confirmDelete = () => {
    if (!itemToDelete) return;

    const onSuccess = () => {
      toast.success(`${activeTab.split(" ")[0]} deleted successfully.`);
      setItemToDelete(null);
    };
    const onError = () => toast.error("Failed to delete item.");

    if (activeTab === "FAQs") deleteFaq(itemToDelete, { onSuccess, onError });
    else if (activeTab === "Terms and Conditions") deleteTerm(itemToDelete, { onSuccess, onError });
    else if (activeTab === "Policies") deletePolicy(itemToDelete, { onSuccess, onError });
  };

  const pageActions = (
    <Button className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
      <Link to={addBaseRoute} className="flex items-center">
        <Add size="18" color="white" className="mr-2" /> Add new
      </Link>
    </Button>
  );

  return (
    <AdminLayout 
      title="FAQs and Policies" 
      subtitle="Manage your platform's legal documents, terms, and frequently asked questions."
      headerActions={pageActions}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-6 h-full">
        
        {/* Toolbar Bar (Search & Tabs) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
            <Input 
              placeholder="Search documents..." 
              className="pl-9 h-10 text-[#475467] placeholder:text-[#475467]/70 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 text-sm font-medium border-b border-slate-100 w-full sm:w-auto overflow-x-auto">
            {(['FAQs', 'Terms and Conditions', 'Policies'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                  setSearch("");
                }}
                className={`pb-3 px-1 transition-colors relative whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-[#0F4BAB] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F4BAB]' 
                    : 'text-[#475467] hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <div className="py-12 text-center text-[#475467]">Loading {activeTab}...</div>
          ) : currentList.length === 0 ? (
            <div className="py-12 text-center text-[#475467]">No {activeTab.toLowerCase()} found.</div>
          ) : (
            currentList.map((item: any) => {
              const itemId = item.id || item._id;
              // Map standard FAQ fields or Legal draft fields (title/content) to the FAQCard
              const displayTitle = item.question || item.title;
              const displayContent = item.answer || item.body || item.content;
              const isItemDeleting = isDeleting && itemToDelete === itemId;

              return (
                <FaqCard 
                  key={itemId}
                  id={itemId}
                  question={displayTitle}
                  answer={displayContent}
                  onEdit={() => navigate(`${editBaseRoute}/${itemId}`)}
                  onDelete={() => setItemToDelete(itemId)}
                  isDeleting={isItemDeleting}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Reusable Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Item</h3>
            <p className="text-sm text-[#475467] mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="text-[#475467] border-slate-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};