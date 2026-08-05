import { useState, useEffect } from "react";
import { SearchNormal, Filter, Export, Add, More, SearchZoomIn } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DataTable, type ColumnDef } from "@/components/ui/DataTable";
import { useUpdateUserStatus, useUsers } from "./apis/useUser";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SortFilterModal } from "./components/SortFilterModal";
import { CreateUserDrawer } from "./components/CreateUserDrawer";

export const UserManagement = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const { data, isLoading, isError } = useUsers({
        page,
        limit: 20,
        search: debouncedSearch || undefined,
        sortBy: "createdAt",
        sortOrder: "DESC",
    });

    const users = data?.users || data || [];
    const totalPages = data?.totalPages || 1;
    const totalUsers = data?.total || 0;
const { mutate: changeUserStatus } = useUpdateUserStatus();

  //  3. Create a helper function for the click handler
  const handleStatusChange = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    
    changeUserStatus(
      { id, status: newStatus },
      {
        onSuccess: () => toast.success(`User successfully ${newStatus}`),
        onError: () => toast.error("Failed to update user status")
      }
    );
  };
    //  1. Define Columns once
    const columns: ColumnDef<any>[] = [
        {
            key: 'checkbox',
            label: '',
            headerClassName: 'w-12 pl-6',
            cellClassName: 'pl-6',
            render: () => <input type="checkbox" className="rounded border-slate-300 text-[#0F4BAB] focus:ring-[#0F4BAB]" />
        },
        {
            key: 'users',
            label: 'Users',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-blue-100 text-[#0F4BAB] text-xs font-bold">
                            {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
                        <span className="text-slate-500 text-xs">{user.email}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'createdAt',
            label: 'Date Created',
            cellClassName: 'text-slate-600 text-sm',
            render: (user) => new Date(user.createdAt).toLocaleDateString()
        },
        {
            key: 'plan',
            label: 'Plan',
            cellClassName: 'text-slate-600 text-sm capitalize',
            render: (user) => user.plan?.name || 'None'
        },
        {
            key: 'transactions',
            label: 'Transactions',
            cellClassName: 'text-slate-600 text-sm',
            render: (user) => user.transactionCount || 0
        },
        {
            key: 'banks',
            label: 'Banks',
            cellClassName: 'text-slate-600 text-sm capitalize',
            render: (user) => user.bankConnectionStatus?.replace('_', ' ') || 'None'
        },
        {
            key: 'actions',
            label: 'Actions',
            headerClassName: 'text-right pr-6',
            cellClassName: 'text-right pr-6',
            render: (item: any) => (
                <div className="flex items-center justify-end gap-3">
                    <button className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors">
                        Reset password
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors outline-none cursor-pointer flex items-center justify-center">
                            <More size="18" className="rotate-90" color="#1A1A1A" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                                <Link to={`/dashboard/users/${item.id || item._id}`} className="w-full cursor-pointer">
                                    View details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                onClick={() => handleStatusChange(item.id || item._id, item.accountStatus)}
                className="cursor-pointer"
              >
                {item.accountStatus === 'suspended' ? 'Activate user account' : 'Suspend user account'}
              </DropdownMenuItem>
                            <DropdownMenuItem>Change plan</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete user account</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    ];

    //  2. Define Empty State
    const emptyState = (
        <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <SearchZoomIn size="40" color="#0F4BAB" variant="Bulk" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No users found</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
                Your search "{search}" did not match any users. Please try again or create a new user account.
            </p>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSearch("")}>Clear search</Button>
                <Button className="bg-[#0F4BAB] hover:bg-[#135ED6] text-white">Create user account</Button>
            </div>
        </div>
    );

    return (
        <AdminLayout
            title="User Management"
            subtitle="Keep track of user information"
            headerActions={(
                <>
                    <Button variant="outline" className="text-[#0F4BAB] border-[#0F4BAB] hover:bg-blue-50">
                        <Export size="18" className="mr-2" color="#0F4BAB" /> Export
                    </Button>
                    <Button className="bg-[#0F4BAB] hover:bg-[#135ED6] text-white" onClick={() => setIsCreateUserOpen(true)}>
                        <Add size="18" className="mr-2" color="white" /> Create user account
                    </Button>
                </>
            )}
        >
            <div className="h-full flex flex-col">
                {/* Main Content Area */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">All Users</span>
                            <span className="bg-[#0F4BAB] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                {totalUsers}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <SearchNormal size="16" className="absolute left-3 top-1/2 -translate-y-1/2 " color="#475467"/>
                                <Input
                                    placeholder="Search by email or username"
                                    className="pl-9 h-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="h-9 px-3 text-slate-600" onClick={() => setIsFilterOpen(true)}>
                                <Filter size="16" className="mr-2" color="#475467"/> Sort & Filter
                            </Button>
                        </div>
                    </div>

                    {isError ? (
                        <div className="p-12 text-center text-red-500">Error loading users. Please try again.</div>
                    ) : (
                        /* 3. Plug it all into the DataTable */
                        <DataTable
                            columns={columns}
                            data={users}
                            isLoading={isLoading}
                            emptyState={emptyState}
                            keyExtractor={(item) => item._id || item.id}
                            pagination={
                                <PaginationBar
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onNext={() => setPage(p => p + 1)}
                                    onPrevious={() => setPage(p => p - 1)}
                                />
                            }
                        />
                    )}
                </div>
            </div>
            <SortFilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

      <CreateUserDrawer 
        isOpen={isCreateUserOpen} 
        onClose={() => setIsCreateUserOpen(false)} 
      />
        </AdminLayout>
    );
};