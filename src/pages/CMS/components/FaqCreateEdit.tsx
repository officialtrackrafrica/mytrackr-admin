import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight2, TextBold, Link2, EmojiNormal, Trash } from "iconsax-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useCreateFaq, useUpdateFaq, useFaqDetails } from "../apis/useFAQs";

export const FaqCreateEdit = () => {
  const { id } = useParams();
  const isEditMode = id && id !== "new";
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Fetch data if editing
  const { data: faqDetails, isLoading: isLoadingDetails } = useFaqDetails(isEditMode ? id : undefined);
  const { mutate: createFaq, isPending: isCreating } = useCreateFaq();
  const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaq();

  // Populate form when data loads
  useEffect(() => {
    if (isEditMode && faqDetails) {
      const data = faqDetails.data || faqDetails; // Handle nested payloads
      setQuestion(data.question || "");
      setAnswer(data.answer || data.body || "");
    }
  }, [faqDetails, isEditMode]);

  const handleSave = () => {
    if (!question || !answer) {
      toast.error("Both Question and Body Text are required.");
      return;
    }

    const payload = { question, answer };

    if (isEditMode && id) {
      updateFaq({ id, data: payload }, {
        onSuccess: () => {
          toast.success("FAQ updated successfully!");
          navigate("/dashboard/content/faqs");
        },
        onError: () => toast.error("Failed to update FAQ.")
      });
    } else {
      createFaq(payload, {
        onSuccess: () => {
          toast.success("FAQ created successfully!");
          navigate("/dashboard/content/faqs");
        },
        onError: () => toast.error("Failed to create FAQ.")
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <AdminLayout 
      title="FAQs and Policies" 
      subtitle="Keep track of user subscriptions, churn rate, and your revenue."
    >
      <div className="flex flex-col h-full max-w-5xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#475467] mb-8">
          <Link to="/dashboard/content/faqs" className="hover:text-slate-900">Content management</Link>
          <ArrowRight2 size="12" color="#475467" />
          <Link to="/dashboard/content/faqs" className="hover:text-slate-900">FAQs and Policies</Link>
          <ArrowRight2 size="12" color="#475467" />
          <span className="text-[#135ED6]">{isEditMode ? "Edit FAQ" : "Add New"}</span>
        </div>

        {/* Compose Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-900">
              {isEditMode ? "Edit FAQ" : "New FAQ"}
            </span>
          </div>

          <div className="p-6 flex flex-col flex-1 gap-6">
            {isLoadingDetails ? (
              <div className="text-center text-[#475467] py-10">Loading details...</div>
            ) : (
              <>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4">
                  <span className="text-sm font-medium text-slate-900">Question</span>
                  <Input 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter the question..."
                    className="border-none shadow-none focus-visible:ring-0 px-0 rounded-none text-slate-900 placeholder:text-[#475467]/50 font-medium"
                  />
                </div>

                <div className="grid grid-cols-[100px_1fr] items-start gap-4 flex-1">
                  <span className="text-sm font-medium text-slate-900 pt-3">Body Text</span>
                  <textarea 
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write the answer or policy details here..."
                    className="w-full h-full min-h-[300px] resize-none outline-none text-sm text-[#475467] placeholder:text-[#475467]/50 pt-3 leading-relaxed"
                  />
                </div>
              </>
            )}
          </div>

          {/* Bottom Toolbar */}
          <div className="p-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                onClick={handleSave} 
                disabled={isPending || isLoadingDetails}
                className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white px-6"
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
                <button className="text-[#475467] hover:text-slate-900"><TextBold size="18" color="#475467" /></button>
                <button className="text-[#475467] hover:text-slate-900"><Link2 size="18" color="#475467" /></button>
                <button className="text-[#475467] hover:text-slate-900"><EmojiNormal size="18" color="#475467" /></button>
              </div>
            </div>
            
            <button 
              onClick={() => navigate("/dashboard/content/faqs")} 
              className="p-2 text-[#475467] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash size="20" color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};