import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchNormal, Add } from "iconsax-react";
import { useFaqs, useDeleteFaq } from "./apis/useFAQs";
import { FaqCard } from "./components/FAQCard";
import { toast } from "sonner";

export const FaqsList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("FAQs");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch Data
  const { data, isLoading } = useFaqs({
    search: debouncedSearch || undefined,
    page,
    limit: 10,
    // category: activeTab, // Map tabs to category parameter if backend supports it
  });

  const { mutate: deleteFaq, isPending: isDeleting } = useDeleteFaq();

  const faqs = data?.faqs || data?.data || [];

 // Updated to execute the mutation and close the modal
  const confirmDelete = () => {
    if (!faqToDelete) return;

    deleteFaq(faqToDelete, {
      onSuccess: () => {
        toast.success("FAQ deleted successfully.");
        setFaqToDelete(null); // Close modal on success
      },
      onError: () => toast.error("Failed to delete FAQ."),
    });
  };

  const pageActions = (
    <Button  className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
      <Link to="/dashboard/content/faqs/new" className="flex items-center">
        <Add size="18" color="white" className="mr-2" /> Add new
      </Link>
    </Button>
  );

  return (
    <AdminLayout 
      title="FAQs and Policies" 
      subtitle="Keep track of user subscriptions, churn rate, and your revenue."
      headerActions={pageActions}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-6 h-full">
        
        {/* Toolbar Bar (Search & Tabs) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
            <Input 
              placeholder="Search by email or username" 
              className="pl-9 h-10 text-[#475467] placeholder:text-[#475467]/70 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 text-sm font-medium border-b border-slate-100 w-full sm:w-auto">
            {['FAQs', 'Terms and Conditions', 'Policies'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(1);
                }}
                className={`pb-3 px-1 transition-colors relative ${
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

        {/* FAQs List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <div className="py-12 text-center text-[#475467]">Loading...</div>
          ) : faqs.length === 0 ? (
            <div className="py-12 text-center text-[#475467]">No items found.</div>
          ) : (
            faqs.map((faq: any) => (
              <FaqCard 
                key={faq.id || faq._id}
                id={faq.id || faq._id}
                question={faq.question}
                answer={faq.answer || faq.body}
                onEdit={(id) => navigate(`/dashboard/content/faqs/${id}`)}
                onDelete={(id) => setFaqToDelete(id)}
                isDeleting={isDeleting && faqToDelete === (faq.id || faq._id)}
              />
            ))
          )}
        </div>
      </div>
      {faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete FAQ</h3>
            <p className="text-sm text-[#475467] mb-6">
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setFaqToDelete(null)}
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