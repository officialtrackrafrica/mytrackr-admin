import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateUserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserDrawer = ({ isOpen, onClose }: CreateUserDrawerProps) => {
  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create new user account"
      description="Upload explainer videos to your learning hub."
      className="md:min-w-[500px]"
    >
      <div className="flex flex-col h-full">
        <div className="space-y-6 flex-1">
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-[#475467]">First name</Label>
            <Input placeholder="John" />
          </div>
          
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-[#475467]">Last name</Label>
            <Input placeholder="Doe" />
          </div>
          
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-[#475467]">Email</Label>
            <Input placeholder="Enter user email address" type="email" />
          </div>
          
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-[#475467]">Business name</Label>
            <Input placeholder="Enter business name" />
          </div>
          
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <Label className="text-sm font-medium text-[#475467]">Business type</Label>
            <Select>
              <SelectTrigger className="w-full text-[#475467]">
                <SelectValue placeholder="Select a business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sole">Sole proprietorship</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="corp">Corporation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="pt-6 mt-auto">
          <Button className="w-full bg-[#135ED6] hover:bg-[#0F4BAB] text-white h-12 text-base font-medium">
            Create Account
          </Button>
        </div>
      </div>
    </Drawer>
  );
};