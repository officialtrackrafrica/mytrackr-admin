import { useState, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Home, User, CardPos, MessageQuestion, Element3, Setting2, Logout, Folder2, ArrowUp2, ArrowDown2 } from "iconsax-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/Logowhite.svg"


interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
}

export const AdminLayout = ({ 
  children, 
  title = "Welcome back", 
  subtitle = "Manage your users, transactions, ROI and webapp traffic.", 
  headerActions
}: AdminLayoutProps) => {

  const location = useLocation(); // Get current route
  const [isContentOpen, setIsContentOpen] = useState(
    location.pathname.includes("/dashboard/content")
  );
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="flex h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0F4BAB] text-white flex flex-col m-3 rounded-2xl overflow-hidden shrink-0 shadow-lg">
        <div className="p-3 flex items-center gap-3">
          <img src={logo} alt="" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {/* Active State */}
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${location.pathname === '/dashboard' ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'}`}>
            <Home size="20" variant="Bold" color="white" /> Dashboard
          </Link>
          
          {/* Inactive States */}
          <Link to="/dashboard/users" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${isActive('/users') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'}`}>
  <User size="20" color="white" /> User Management
</Link>
          <Link to="/dashboard/billing" className={`flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-[#135ED6] hover:text-white rounded-xl font-medium text-sm transition-colors ${isActive('/billing') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'}`}>
            <CardPos size="20" color="white" /> Subscription & Billings
          </Link>
          <div>
            <button 
              onClick={() => setIsContentOpen(!isContentOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-[#135ED6] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Folder2 size="20" color="white" /> Content Management
              </div>
              {isContentOpen ? <ArrowUp2 size="16" color="#475467" /> : <ArrowDown2 size="16" color="#475467" />}
            </button>

            {isContentOpen && (
              <div className="pl-9 mt-1 space-y-1">
                <Link 
                  to="/dashboard/content/emails" 
                  className={`block py-2.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/emails') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'
                  }`}
                >
                  Emails & Notifications
                </Link>
                <Link 
                  to="/dashboard/content/faqs" 
                  className={`block py-2.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/faqs') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'
                  }`}
                >
                  FAQs & Policies
                </Link>
                
              </div>
            )}
          </div>

          <Link to="/dashboard/support" className={`flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-[#135ED6] hover:text-white rounded-xl font-medium text-sm transition-colors ${isActive('/support') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'}`}>
            <MessageQuestion size="20" color="white" /> Support and feedback
          </Link>
          <Link to="/dashboard/categorization" className={`flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-[#135ED6] hover:text-white rounded-xl font-medium text-sm transition-colors ${isActive('/categorization') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'}`}>
            <Element3 size="20" color="white" /> Categorization Rules
          </Link>
          <Link to="/dashboard/settings" className={`flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-[#135ED6] hover:text-white rounded-xl font-medium text-sm transition-colors ${isActive('/settings') ? 'bg-[#135ED6] text-white' : 'text-slate-300 hover:bg-[#135ED6] hover:text-white'}`}>
            <Setting2 size="20" color="white" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center justify-center gap-2 w-full py-3 px-4 text-slate-300 hover:text-white hover:bg-[#135ED6] rounded-xl transition-colors text-sm font-medium">
            <Logout size="20" color="white" /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center justify-between flex-1 pr-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
            </div>
            
            {/*  Render actions safely here */}
            {headerActions && (
              <div className="flex items-center gap-3">
                {headerActions}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-100 text-[#0F4BAB] font-bold">OA</AvatarFallback>
            </Avatar>
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
               {/* Bell Icon Placeholder */}
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
               <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-50"></span>
            </button>
          </div>
        </header>

        {/* Page Content (The Dashboard Component renders here) */}
        <div className="flex-1 overflow-y-auto p-8 pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};