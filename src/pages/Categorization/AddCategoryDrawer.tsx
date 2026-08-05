import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CloseSquare } from "iconsax-react";
// Make sure this import path matches where your hook actually lives!
import { useCreateCategorizationRule } from "./apis/useCategorizationRules"; 
import { toast } from "sonner";

interface AddCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryDrawer = ({ isOpen, onClose }: AddCategoryDrawerProps) => {
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [keywords, setKeywords] = useState("");

  const { mutate: createRule, isPending } = useCreateCategorizationRule();

  const handleAddSubCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subCategoryInput.trim()) {
      e.preventDefault();
      if (!subCategories.includes(subCategoryInput.trim())) {
        setSubCategories([...subCategories, subCategoryInput.trim()]);
      }
      setSubCategoryInput("");
    }
  };

  const removeSubCategory = (itemToRemove: string) => {
    setSubCategories(subCategories.filter(item => item !== itemToRemove));
  };

  // 👉 Restored the correct handleSave logic for creating a new rule
  const handleSave = () => {
    if (!category.trim() || !keywords.trim()) {
      toast.error("Category and Keywords are required.");
      return;
    }

    // Convert the textarea string into an array
    const formattedKeywords = keywords
      .split(",")
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    // Join the sub-categories array into a single string for the backend
    const formattedSubCategory = subCategories.length > 0 
      ? subCategories.join(", ") 
      : undefined;

    createRule(
      { 
        category, 
        subCategory: formattedSubCategory, 
        keywords: formattedKeywords 
      },
      {
        onSuccess: () => {
          toast.success("Category added successfully!");
          setCategory("");
          setSubCategories([]);
          setKeywords("");
          onClose();
        },
        onError: () => toast.error("Failed to add category."),
      }
    );
  };

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add new category"
      className=""
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="p-3 border-b border-slate-100 ">
          <p className="text-sm text-[#475467]">Add new category to your transaction lists.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {/* Category Input */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <span className="text-sm font-medium text-slate-900">Category</span>
            <Input 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Rent"
              className="border-slate-200 text-sm text-slate-900 focus-visible:ring-[#135ED6]"
            />
          </div>

          {/* Sub-categories Input */}
          <div className="grid grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-sm font-medium text-slate-900 pt-3">Sub-categories</span>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2 items-center p-2 min-h-[44px] border border-slate-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-[#135ED6] focus-within:border-[#135ED6] transition-all">
                {subCategories.map((sub, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {sub}
                    <button 
                      onClick={() => removeSubCategory(sub)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <CloseSquare size="14" variant="Linear" color="#135ED6"/>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  onKeyDown={handleAddSubCategory}
                  className="flex-1 outline-none min-w-[100px] text-sm text-slate-900 bg-transparent placeholder:text-slate-400"
                  placeholder={subCategories.length === 0 ? "Type and press enter..." : ""}
                />
              </div>
              <p className="text-xs text-[#475467]">Type in your subcategories and click "enter" after each one</p>
            </div>
          </div>

          {/* Keywords Textarea */}
          <div className="grid grid-cols-[120px_1fr] items-start gap-4">
            <span className="text-sm font-medium text-slate-900 pt-3">Key words</span>
            <textarea 
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="housing, shop, house bill"
              className="w-full h-32 p-3 resize-none outline-none border border-slate-200 rounded-md text-sm text-slate-900 focus:ring-1 focus:ring-[#135ED6] focus:border-[#135ED6] transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white shrink-0">
          <Button 
            onClick={handleSave} 
            disabled={isPending}
            className="w-full bg-[#135ED6] hover:bg-[#0F4BAB] text-white h-11"
          >
            {isPending ? "Adding..." : "Add Category"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};