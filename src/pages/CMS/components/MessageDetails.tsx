// import { useParams, Link } from "react-router-dom";
// import { ArrowRight2, Add } from "iconsax-react";
// import { AdminLayout } from "@/components/layout/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { useMessageDetails } from "../apis/useMessages";

// export const MessageDetails = () => {
//   const { id } = useParams();
  
//   // 👉 Fetch real data (fallback to mock if loading/missing for preview)
//   const { data: message, isLoading } = useMessageDetails(id || "");

//   const title = message?.subject || "Happy New Month!";
//   const recipients = message?.recipients || "All users";
//   const body = message?.body || "New app update!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

//   const headerActions = (
//     <Button className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
//       <Link to="/dashboard/content/emails/compose" className="flex items-center">
//         <Add size="18" color="white" className="mr-2" /> Compose Email
//       </Link>
//     </Button>
//   );

//   return (
//     <AdminLayout 
//       title="Emails and Notifications" 
//       subtitle="Keep track of user subscriptions, churn rate, and your revenue."
//       headerActions={headerActions}
//     >
//       <div className="flex flex-col h-full max-w-5xl">
//         {/* Breadcrumbs */}
//         <div className="flex items-center gap-2 text-xs font-medium text-[#475467] mb-8">
//           <Link to="/dashboard/content" className="hover:text-slate-900">Content management</Link>
//           <ArrowRight2 size="12" color="#475467" />
//           <Link to="/dashboard/content/emails" className="hover:text-slate-900">Emails and Notifications</Link>
//           <ArrowRight2 size="12" color="#475467" />
//           <span className="text-[#135ED6]">{title}</span>
//         </div>

//         {/* Header */}
//         <h2 className="text-2xl font-bold text-slate-900 mb-6">
//           {isLoading ? "Loading..." : title}
//         </h2>

//         {/* Content Card */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex-1">
//           <div className="flex items-center gap-6 mb-8">
//             <span className="text-sm font-medium text-slate-900 w-20">Recipients</span>
//             <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#475467]">
//               {recipients}
//             </div>
//           </div>

//           <div className="prose prose-sm max-w-none text-[#475467] whitespace-pre-wrap">
//             {isLoading ? "Loading message content..." : body}
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight2, Add, Edit2, Trash } from "iconsax-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMessageDetails, useDeleteMessage } from "../apis/useMessages";

export const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: message, isLoading } = useMessageDetails(id || "");
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();

  const title = message?.subject || "Happy New Month!";
  // Extracts the array if it's a custom list, otherwise cleans up the group name
  const recipients = Array.isArray(message?.recipients) && message.recipients.length > 0
    ? message.recipients.join(", ") 
    : (message?.recipientGroup?.replace("_", " ") || "All users");
  const body = message?.body || "Loading content...";

  const handleDelete = () => {
    if (!id) return;
    deleteMessage(id, {
      onSuccess: () => {
        toast.success("Message deleted successfully.");
        navigate("/dashboard/content/emails");
      },
      onError: () => toast.error("Failed to delete message.")
    });
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button 
        variant="outline"
        onClick={() => navigate(`/dashboard/content/emails/compose?edit=${id}`)}
        className="text-[#475467] border-slate-200 hover:bg-slate-50"
      >
        <Edit2 size="18" className="mr-2" color="#475467" /> Edit
      </Button>
      <Button 
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        <Trash size="18" className="mr-2" color="#DC2626"/> {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      <div className="h-6 w-px bg-slate-200 mx-1"></div>
      <Button className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white">
        <Link to="/dashboard/content/emails/compose" className="flex items-center">
          <Add size="18" color="white" className="mr-2" /> Compose Email
        </Link>
      </Button>
    </div>
  );

  return (
    <AdminLayout 
      title="Emails and Notifications" 
      subtitle="Keep track of user subscriptions, churn rate, and your revenue."
      headerActions={headerActions}
    >
      <div className="flex flex-col h-full max-w-5xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#475467] mb-8">
          <Link to="/dashboard/content" className="hover:text-slate-900">Content management</Link>
          <ArrowRight2 size="12" color="#475467" />
          <Link to="/dashboard/content/emails" className="hover:text-slate-900">Emails and Notifications</Link>
          <ArrowRight2 size="12" color="#475467" />
          <span className="text-[#135ED6] line-clamp-1">{title}</span>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {isLoading ? "Loading..." : title}
        </h2>

        {/* Content Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 flex-1">
          <div className="flex items-center gap-6 mb-8">
            <span className="text-sm font-medium text-slate-900 w-20">Recipients</span>
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#475467]">
              {recipients}
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-[#475467] whitespace-pre-wrap">
            {isLoading ? "Loading message content..." : body}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};