import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTerm, useCreateTerm, useUpdateTerm } from "../apis/useLegals";

export const TermsCreateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [effectiveAt, setEffectiveAt] = useState("");

  const { data: initialData, isLoading: isFetching } = useTerm(id);
  const { mutate: createTerm, isPending: isCreating } = useCreateTerm();
  const { mutate: updateTerm, isPending: isUpdating } = useUpdateTerm();

  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (initialData && isEditMode) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      // Convert ISO string back to YYYY-MM-DD for the HTML date input
      if (initialData.effectiveAt) {
        setEffectiveAt(initialData.effectiveAt.split("T")[0]);
      }
    }
  }, [initialData, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !effectiveAt) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Convert YYYY-MM-DD to ISO string for the backend
    const payload = {
      title,
      content,
      effectiveAt: new Date(effectiveAt).toISOString(),
    };

    if (isEditMode && id) {
      updateTerm(
        { id, ...payload },
        {
          onSuccess: () => {
            toast.success("Terms updated successfully.");
            navigate("/dashboard/content/faqs");
          },
          onError: () => toast.error("Failed to update terms."),
        }
      );
    } else {
      createTerm(payload, {
        onSuccess: () => {
          toast.success("Terms created successfully.");
          navigate("/dashboard/content/faqs");
        },
        onError: () => toast.error("Failed to create terms."),
      });
    }
  };

  return (
    <AdminLayout 
      title={isEditMode ? "Edit Terms and Conditions" : "Create Terms and Conditions"} 
      subtitle="Manage your platform's user agreements."
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl">
        {isFetching ? (
          <div className="py-12 text-center text-[#475467]">Loading data...</div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Title <span className="text-red-500">*</span></label>
              <Input
                placeholder="e.g. MyTrackr Terms and Conditions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Effective Date <span className="text-red-500">*</span></label>
              <Input
                type="date"
                value={effectiveAt}
                onChange={(e) => setEffectiveAt(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Content <span className="text-red-500">*</span></label>
              <textarea
                className="w-full min-h-[300px] p-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#0F4BAB] focus:ring-1 focus:ring-[#0F4BAB] transition-all resize-y"
                placeholder="Enter the full terms and conditions text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard/content/faqs")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Terms"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
};