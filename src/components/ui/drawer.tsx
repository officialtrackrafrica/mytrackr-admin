import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const Drawer = ({ isOpen, onClose, title, description, children, className = "sm:max-w-md" }: DrawerProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className={` bg-white p-0 flex flex-col h-full border-l border-slate-200 ${className}`}>
        <SheetHeader className="p-6 border-b border-slate-100 text-left">
          <SheetTitle className="text-xl font-bold text-slate-900">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-sm text-[#475467] mt-1">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-2">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};