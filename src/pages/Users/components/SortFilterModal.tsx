import { Modal } from "@/components/ui/modal";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "iconsax-react";

interface SortFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SortFilterModal = ({ isOpen, onClose }: SortFilterModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Sort & Filter by"
      className="sm:max-w-[600px]"
    >
      <div className="space-y-6">
        {/* Business Type */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Business type</h4>
          <div className="grid grid-cols-2 gap-4">
            {['Sole proprietorship', 'Limited liabilities', 'Corporations', 'Partnerships'].map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`biz-${item}`} className="border-slate-300 data-[state=checked]:bg-[#0F4BAB] data-[state=checked]:border-[#0F4BAB]" />
                <Label htmlFor={`biz-${item}`} className="text-sm text-[#475467] font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Type */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Plan type</h4>
          <div className="flex flex-wrap gap-6">
            {['Solo', 'Duo', 'Starter', 'Basic', 'Unlimited'].map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`plan-${item}`} className="border-slate-300 data-[state=checked]:bg-[#0F4BAB] data-[state=checked]:border-[#0F4BAB]" />
                <Label htmlFor={`plan-${item}`} className="text-sm text-[#475467] font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Connection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Bank connection status</h4>
          <div className="flex gap-8">
            {['Successful', 'Failed', 'Pending'].map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`bank-${item}`} className="border-slate-300 data-[state=checked]:bg-[#0F4BAB] data-[state=checked]:border-[#0F4BAB]" />
                <Label htmlFor={`bank-${item}`} className="text-sm text-[#475467] font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Account Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Account status</h4>
          <div className="flex gap-8">
            {['Active', 'Inactive', 'Suspended'].map(item => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={`acc-${item}`} className="border-slate-300 data-[state=checked]:bg-[#0F4BAB] data-[state=checked]:border-[#0F4BAB]" />
                <Label htmlFor={`acc-${item}`} className="text-sm text-[#475467] font-normal">{item}</Label>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Sort Order */}
        <RadioGroup defaultValue="asc">
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="asc" id="asc" className="border-slate-300 text-[#0F4BAB]" />
            <Label htmlFor="asc" className="text-sm text-[#475467] font-normal">Ascending Order (A-Z)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="desc" id="desc" className="border-slate-300 text-[#0F4BAB]" />
            <Label htmlFor="desc" className="text-sm text-[#475467] font-normal">Descending Order (Z-A)</Label>
          </div>
        </RadioGroup>

        {/* Signup Date */}
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium text-slate-900">Signup date:</Label>
          <Button variant="outline" className="h-9 text-[#475467]">
            {/* 👉 Added the required color prop to Calendar */}
            <Calendar size="16" className="mr-2" color="#475467" /> Jan 6, 2022
          </Button>
        </div>

        <Button className="w-full bg-[#135ED6] hover:bg-[#0F4BAB] text-white mt-4">
          Apply filter
        </Button>
      </div>
    </Modal>
  );
};