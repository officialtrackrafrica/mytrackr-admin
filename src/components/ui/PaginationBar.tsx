import { Button } from "./button";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const PaginationBar = ({ currentPage, totalPages, onNext, onPrevious }: PaginationBarProps) => {
  // Prevent rendering if there are no pages
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 rounded-b-xl">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="text-sm font-medium text-slate-700 h-9 px-4"
      >
        Previous
      </Button>
      
      <span className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-900">{currentPage}</span> of{" "}
        <span className="font-medium text-slate-900">{totalPages}</span>
      </span>
      
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="text-sm font-medium text-slate-700 h-9 px-4"
      >
        Next
      </Button>
    </div>
  );
};