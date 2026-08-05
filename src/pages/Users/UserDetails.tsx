import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser, useUpdateUser } from "./apis/useUser";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, More, Home2, ArrowRight2, Sms, Export, Add } from "iconsax-react";
import { toast } from "sonner";

export const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading } = useUser(id!);
  const { mutate: updateUserDetails, isPending: isUpdating } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    businessType: "",
    email: "",
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || "",
        businessName: user.businessName || "",
        businessType: user.businessType || "SOLE_PROPRIETORSHIP",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!id) return;

    // Split the full name back into first and last name for the API payload
    const nameParts = formData.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    updateUserDetails(
      {
        id,
        data: {
          firstName,
          lastName,
          email: formData.email,
          businessName: formData.businessName,
          businessType: formData.businessType,
        },
      },
      {
        onSuccess: () => {
          toast.success("User details updated successfully");
          setIsEditing(false);
        },
        onError: () => {
          toast.error("Failed to update user. Please try again.");
        },
      }
    );
  };

  const pageActions = (
   <>
                       <Button variant="outline" className="text-[#0F4BAB] border-[#0F4BAB] hover:bg-blue-50">
                           <Export size="18" className="mr-2" color="#0F4BAB"/> Export
                       </Button>
                       <Button className="bg-[#0F4BAB] hover:bg-[#135ED6] text-white">
                           <Add size="18" className="mr-2" color="white" /> Create user account
                       </Button>
                   </>
  );

  if (isLoading) {
    return (
      <AdminLayout title="User Management" headerActions={pageActions}>
        <div className="flex items-center justify-center h-64 text-slate-500">Loading user details...</div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Management">
        <div className="flex items-center justify-center h-64 text-slate-500">User not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Management" subtitle="Keep track of user information" headerActions={pageActions}>
      <div className="space-y-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#475467]">
          <Link to="/dashboard" className="hover:text-[#0F4BAB] transition-colors"><Home2 size="16" color="#475467"/></Link>
          <ArrowRight2 size="14" color="#475467"/>
          <Link to="/dashboard/users" className="hover:text-[#0F4BAB] transition-colors">User management</Link>
          <ArrowRight2 size="14" color="#475467"/>
          <span className="font-semibold text-[#0F4BAB]">User details</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          
          {/* Header & Actions */}
          <div className="flex items-start justify-between mb-8 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal details</h2>
              <p className="text-sm text-slate-500 mt-1">Update your photo and personal details here.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                    Cancel
                  </Button>
                  <Button className="bg-[#0F4BAB] hover:bg-[#135ED6] text-white" onClick={handleSave} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save changes"}
                  </Button>
                </>
              ) : (
                <>
                  <Button className="bg-[#0F4BAB] hover:bg-[#135ED6] text-white" onClick={() => setIsEditing(true)}>
                    <Edit2 size="16" className="mr-2" color="white" /> Edit user profile
                  </Button>
                  <Button variant="outline" className="px-3">
                    <More size="18" className="rotate-90" color="#475467"/> More options
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 max-w-3xl">
            
            <div className="space-y-2">
              <Label className="text-slate-600">Full name</Label>
              <Input 
                value={formData.fullName} 
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
                className="bg-slate-50/50 disabled:opacity-80"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Business name</Label>
              <Input 
                value={formData.businessName} 
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                disabled={!isEditing}
                className="bg-slate-50/50 disabled:opacity-80"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600">Business type</Label>
              <Select 
                disabled={!isEditing} 
                value={formData.businessType} 
                onValueChange={(val) => setFormData({ ...formData, businessType: val })}
              >
                <SelectTrigger className="bg-slate-50/50 disabled:opacity-80">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLE_PROPRIETORSHIP">Sole proprietorship</SelectItem>
                  <SelectItem value="LLC">LLC</SelectItem>
                  <SelectItem value="CORPORATION">Corporation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 relative">
              <Label className="text-slate-600">Email address</Label>
              <div className="relative">
                <Sms size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="pl-10 bg-slate-50/50 disabled:opacity-80"
                />
              </div>
            </div>

            {/* Read-Only Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Connected banks</Label>
                <Input 
                  value={user.bankConnectionStatus?.replace('_', ' ') || 'None'} 
                  disabled 
                  className="bg-slate-50/80 capitalize"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600">Transaction count</Label>
                <Input 
                  value={user.transactionCount || "0"} 
                  disabled 
                  className="bg-slate-50/80"
                />
              </div>
            </div>
            
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-medium text-slate-500 gap-4">
            <p>Signup date: <span className="text-slate-700">{new Date(user.createdAt).toLocaleString()}</span></p>
            <p>Last active: <span className="text-slate-700">{user.lastActive ? new Date(user.lastActive).toLocaleString() : 'N/A'}</span></p>
            <div className="flex items-center gap-2">
              Account status 
              <span className={`flex items-center gap-1.5 ${user.accountStatus === 'active' ? 'text-emerald-600' : 'text-slate-600'} capitalize`}>
                <span className={`w-1.5 h-1.5 rounded-full ${user.accountStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                {user.accountStatus || 'Unknown'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};