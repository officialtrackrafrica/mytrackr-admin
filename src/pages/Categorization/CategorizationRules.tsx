import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Add, Notification, Edit2, Trash, SearchNormal } from "iconsax-react";
import { toast } from "sonner";
import { AddCategoryDrawer } from "./AddCategoryDrawer";
import { 
  useCategorizationRules, 
  useUpdateCategorizationRule, 
  useDeleteCategorizationRule 
} from "./apis/useCategorizationRules";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CategorizationRules = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Delete Modal State
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);
  // 👉 Fetch Real Data
  const { data, isLoading } = useCategorizationRules({page, limit: 10, search: debouncedSearch || undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,});
  const { mutate: updateRule } = useUpdateCategorizationRule();
  const { mutate: deleteRule, isPending: isDeleting } = useDeleteCategorizationRule();

  const rules = data?.rules || data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  // Handlers for Inline Editing
  const handleEditStart = (id: string, currentKeywords: string[]) => {
    setEditingId(id);
    // Join the array into a comma-separated string for the input field
    setEditValue(currentKeywords?.join(", ") || "");
  };

  // 👉 2. Split the string back into an array on save
  const handleSave = (id: string) => {
    const keywordsArray = editValue
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    updateRule({ id, data: { keywords: keywordsArray } }, {
      onSuccess: () => {
        setEditingId(null);
        toast.success("Categorization rules updated.");
      },
      onError: () => toast.error("Failed to update rules.")
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  // Handlers for Deletion
  const confirmDelete = () => {
    if (!categoryToDelete) return;
    deleteRule(categoryToDelete, {
      onSuccess: () => {
        setCategoryToDelete(null);
        toast.success("Category deleted.");
      },
      onError: () => toast.error("Failed to delete category.")
    });
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button 
        onClick={() => setIsDrawerOpen(true)}
        className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white h-10 px-4"
      >
        <Add size="18" color="white" className="mr-2" /> Add new category
      </Button>
      <button className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-[#475467] hover:bg-slate-50 transition-colors">
        <Notification size="20" color="currentColor" />
      </button>
    </div>
  );

  return (
    <AdminLayout 
      title="Categorization Rules" 
      subtitle="View, manage, and keep track of user complaints."
      headerActions={headerActions}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0 bg-white">
          <Select value={categoryFilter} onValueChange={(val: any) => { setCategoryFilter(val); setPage(1); }}>
            <SelectTrigger className="w-48 h-10 text-[#475467]">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="food">Food & Dining</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 max-w-md relative">
            <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
            <Input 
              placeholder="Search by category name or keywords" 
              className="pl-9 h-10 text-[#475467] placeholder:text-[#475467]/70"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Table Header */}
        <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-[#475467]">
          <span>Categories</span>
          <span>Actions</span>
        </div>

        {/* Categories List */}
        <div className="flex flex-col divide-y divide-slate-100 p-2 min-h-[400px]">
          {isLoading ? (
            <div className="py-12 text-center text-[#475467]">Loading rules...</div>
          ) : rules.length === 0 ? (
            <div className="py-12 text-center text-[#475467]">No categorization rules found.</div>
          ) : (
            rules.map((rule: any) => {
              const ruleId = rule.id || rule._id;
              const isEditing = editingId === ruleId;
              const displayKeywords = rule.keywords?.join(", ") || "";

              return (
                <div key={ruleId} className="px-6 py-4 flex items-center gap-8 hover:bg-slate-50/30 transition-colors">
                  {/* Category Name */}
                  <div className="w-48 shrink-0">
                    {/* <span className="text-sm font-medium text-slate-900 capitalize">{rule.category || rule.name}</span> */}
                    {[rule.category, rule.subCategory].filter(Boolean).join(' / ') || rule.name}
                  </div>

                  {/* Keywords Input Area */}
                  <div className="flex-1">
                    {isEditing ? (
                      <Input 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSave(ruleId);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        autoFocus
                        className="h-12 border-[#135ED6] focus-visible:ring-[#135ED6]/20 bg-blue-50/10 text-sm text-slate-900"
                      />
                    ) : (
                      <div 
      // Replaced h-12 with min-h-[48px], removed truncate, added break-words
      className="min-h-[48px] px-3 py-2.5 rounded-md border border-slate-200 bg-slate-50/50 text-sm text-[#475467] cursor-pointer hover:bg-slate-50 transition-colors break-words"
      onClick={() => handleEditStart(ruleId, rule.keywords)}
    >
      {displayKeywords}
    </div>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="w-32 shrink-0 flex items-center justify-end gap-2">
                    {isEditing ? (
                      <Button 
                        onClick={() => handleSave(ruleId)}
                        className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white h-10 px-4"
                      >
                        Save changes
                      </Button>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleEditStart(ruleId, rule.keywords)}
                          className="p-2 text-[#475467] hover:text-[#135ED6] hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 size="20" color="currentColor" />
                        </button>
                        <button 
                          onClick={() => setCategoryToDelete(ruleId)}
                          className="p-2 text-[#475467] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash size="20" color="currentColor" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {!isLoading && rules.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <PaginationBar 
              currentPage={page} 
              totalPages={totalPages} 
              onNext={() => setPage(p => p + 1)} 
              onPrevious={() => setPage(p => p - 1)} 
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Category</h3>
            <p className="text-sm text-[#475467] mb-6">
              Are you sure you want to delete this category rule? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCategoryToDelete(null)}
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

      {/* Drawer */}
      <AddCategoryDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </AdminLayout>
  );
};