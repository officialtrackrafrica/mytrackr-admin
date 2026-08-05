import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchNormal, Sms, Monitor } from "iconsax-react";
import { toast } from "sonner";
import { useProfile, useChangePassword, useAuditLogs } from "./apis/useSettings";
import { PaginationBar } from "@/components/ui/PaginationBar";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  
  // 👉 1. Profile Data
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const user = profileData?.user || profileData?.data || profileData;

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // 👉 2. Password State & Mutation
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password updated successfully.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: () => toast.error("Failed to update password. Please check your current password."),
      }
    );
  };

  // 👉 3. Audit Logs Data
  const [logsPage, setLogsPage] = useState(1);
  const { data: logsData, isLoading: isLoadingLogs } = useAuditLogs({ page: logsPage, limit: 10 });
  const logs = logsData?.logs || logsData?.data || [];
  const logsTotalPages = logsData?.pagination?.totalPages || 1;
  const unreadLogsCount = logs.filter((log: any) => !log.read).length || 0;

  const headerActions = (
    <div className="relative w-64">
      <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2" color="#475467" />
      <Input 
        placeholder="Search" 
        className="pl-9 h-10 border-slate-200 text-sm text-slate-900 focus-visible:ring-[#135ED6]"
      />
    </div>
  );

  return (
    <AdminLayout 
      title="Settings" 
      headerActions={headerActions}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Tabs Bar */}
        <div className="px-8 border-b border-slate-200 flex items-center gap-6 text-sm font-medium pt-4 shrink-0">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-3 px-1 transition-colors relative ${
              activeTab === "personal" 
                ? 'text-[#0F4BAB] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F4BAB]' 
                : 'text-[#475467] hover:text-slate-900'
            }`}
          >
            Personal details
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`pb-3 px-1 transition-colors relative ${
              activeTab === "password" 
                ? 'text-[#0F4BAB] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F4BAB]' 
                : 'text-[#475467] hover:text-slate-900'
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setActiveTab("system")}
            className={`pb-3 px-1 transition-colors relative flex items-center gap-2 ${
              activeTab === "system" 
                ? 'text-[#0F4BAB] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0F4BAB]' 
                : 'text-[#475467] hover:text-slate-900'
            }`}
          >
            System log
            {unreadLogsCount > 0 && (
              <span className="flex items-center justify-center bg-slate-100 text-slate-600 text-xs rounded-full px-2 py-0.5 font-medium border border-slate-200">
                {unreadLogsCount}
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-8 flex-1 overflow-y-auto">
          {activeTab === "personal" ? (
            /* 👉 Personal Details View */
            <div className="max-w-4xl animate-in fade-in duration-300">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Personal details</h3>
                  <p className="text-sm text-[#475467] mt-1">Update your photo and personal details here.</p>
                </div>
                <Button className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
                  Edit profile
                </Button>
              </div>

              {isLoadingProfile ? (
                <div className="py-12 text-[#475467]">Loading profile...</div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="pb-6 border-b border-slate-100">
                    <Avatar className="h-16 w-16 border border-slate-200">
                      <AvatarImage src={user?.avatar || "https://i.pravatar.cc/150"} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-xl">
                        {(firstName?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-center gap-8 py-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-[#475467]">First name</span>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="max-w-md border-slate-200 shadow-sm" />
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-center gap-8 py-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-[#475467]">Last name</span>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="max-w-md border-slate-200 shadow-sm" />
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-center gap-8 py-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-[#475467]">Phone number</span>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="max-w-md border-slate-200 shadow-sm" />
                  </div>

                  <div className="grid grid-cols-[200px_1fr] items-center gap-8 py-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-[#475467]">Email address</span>
                    <div className="relative max-w-md w-full">
                      <Sms size="16" color="#475467" className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 border-slate-200 shadow-sm w-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "password" ? (
            /* 👉 Password View */
            <div className="max-w-4xl animate-in fade-in duration-300">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900">Password</h3>
                <p className="text-sm text-[#475467] mt-1">Please enter your current password to change your password.</p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-[200px_1fr] items-center gap-8 py-4 border-b border-slate-100">
                  <span className="text-sm font-medium text-[#475467]">Current password</span>
                  <Input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="********" 
                    className="max-w-md border-slate-200 shadow-sm text-lg tracking-widest" 
                  />
                </div>

                <div className="grid grid-cols-[200px_1fr] items-start gap-8 py-4 border-b border-slate-100">
                  <span className="text-sm font-medium text-[#475467] pt-2">New password</span>
                  <div>
                    <Input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="********" 
                      className="max-w-md border-slate-200 shadow-sm text-lg tracking-widest" 
                    />
                    <p className="text-xs text-[#475467] mt-2">Your new password must be more than 8 characters.</p>
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] items-center gap-8 py-4 border-b border-slate-100">
                  <span className="text-sm font-medium text-[#475467]">Confirm new password</span>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="********" 
                    className="max-w-md border-slate-200 shadow-sm text-lg tracking-widest" 
                  />
                </div>

                <div className="flex justify-end py-4">
                  <Button 
                    onClick={handleUpdatePassword} 
                    disabled={isChangingPassword}
                    className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white"
                  >
                    {isChangingPassword ? "Updating..." : "Update password"}
                  </Button>
                </div>

                {/* Where you're logged in section */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Where you're logged in</h3>
                      <p className="text-sm text-[#475467] mt-1">We'll alert you via {email || 'your email'} if there is any unusual activity on your account.</p>
                    </div>
                    <button className="text-sm font-medium text-[#135ED6] hover:text-[#0F4BAB]">View all</button>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex gap-4">
                      <Monitor size="24" color="#475467" className="mt-1" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">2018 Macbook Pro 15-inch</p>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1.5 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active now
                          </span>
                        </div>
                        <p className="text-xs text-[#475467] mt-1">Melbourne, Australia • 22 Jan at 10:40am</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* 👉 System Log View */
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900">System Log</h3>
                <p className="text-sm text-[#475467] mt-1">Monitor recent administrative and system activities.</p>
              </div>

              {isLoadingLogs ? (
                <div className="py-12 text-[#475467]">Loading system logs...</div>
              ) : logs.length === 0 ? (
                <div className="py-12 text-center border border-slate-100 rounded-lg text-[#475467]">No system logs found.</div>
              ) : (
                <div className="flex flex-col gap-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[#475467] border-b border-slate-200 font-medium">
                      <tr>
                        <th className="px-6 py-4">Action</th>
                        <th className="px-6 py-4">User / IP</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {logs.map((log: any) => (
                        <tr key={log.id || log._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-900">{log.action || log.description}</td>
                          <td className="px-6 py-4 text-[#475467]">{log.userEmail || log.ipAddress || "System"}</td>
                          <td className="px-6 py-4 text-[#475467]">
                            {new Date(log.createdAt || Date.now()).toLocaleString('en-US', { 
                              month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' 
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                  <div className="pt-2">
                    <PaginationBar 
                      currentPage={logsPage} 
                      totalPages={logsTotalPages} 
                      onNext={() => setLogsPage(p => p + 1)} 
                      onPrevious={() => setLogsPage(p => p - 1)} 
                    />
                  </div>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};