import { Button } from "@/components/ui/button";
import { Trash } from "iconsax-react";

interface FaqCardProps {
  id: string;
  question: string;
  answer: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const FaqCard = ({ id, question, answer, onEdit, onDelete, isDeleting }: FaqCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-base font-semibold text-slate-900">{question}</h4>
      </div>
      <p className="text-sm text-[#475467] leading-relaxed whitespace-pre-wrap">
        {answer}
      </p>
      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={() => onEdit(id)}
          className="text-[#475467] border-slate-200 hover:bg-slate-50"
        >
          Edit Message
        </Button>
        <button 
          onClick={() => onDelete(id)}
          disabled={isDeleting}
          className="p-2 text-[#475467] hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
        >
          <Trash size="20" color="currentColor" />
        </button>
      </div>
    </div>
  );
};