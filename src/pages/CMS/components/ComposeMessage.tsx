// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRight2, TextBold, Link2, EmojiNormal, Trash } from "iconsax-react";
// import { AdminLayout } from "@/components/layout/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";
// import { useComposeMessage, useSaveDraft } from "../apis/useMessages";

// export const ComposeMessage = () => {
//   const navigate = useNavigate();
//   const { mutate: composeMessage, isPending } = useComposeMessage();
//   const { mutate: saveDraft, isPending: isDrafting } = useSaveDraft();
  
//   //  Updated state
//   const [recipientGroup, setRecipientGroup] = useState("all_users");
//   const [explicitRecipients, setExplicitRecipients] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");

// const buildPayload = () => {
//     const payload: any = {
//       channel: 'email',
//       recipientGroup,
//       subject,
//       body,
//     };

//     // If users typed custom emails, split them by comma and trim whitespace
//     if (explicitRecipients.trim()) {
//       payload.recipients = explicitRecipients
//         .split(',')
//         .map(email => email.trim())
//         .filter(email => email.length > 0);
//     }

//     return payload;
//   };

//   const handleSend = () => {
//     if (!subject || !body) {
//       toast.error("Please fill out the subject and body before sending.");
//       return;
//     }
//     if (recipientGroup === "custom" && !explicitRecipients.trim()) {
//       toast.error("Please provide at least one explicit recipient email.");
//       return;
//     }

//     composeMessage(buildPayload(), {
//       onSuccess: () => {
//         toast.success("Message sent successfully!");
//         navigate("/dashboard/content/emails");
//       },
//       onError: () => toast.error("Failed to send message. Please try again.")
//     });
//   };
// const handleSaveDraft = () => {
//     if (!subject && !body) {
//       toast.error("Please enter at least a subject or body to save a draft.");
//       return;
//     }

//     saveDraft(buildPayload(), {
//       onSuccess: () => {
//         toast.success("Draft saved successfully!");
//         navigate("/dashboard/content/emails");
//       },
//       onError: () => toast.error("Failed to save draft. Please try again.")
//     });
//   };
//   return (
//     <AdminLayout 
//       title="Emails and Notifications" 
//       subtitle="Keep track of user subscriptions, churn rate, and your revenue."
//     >
//       <div className="flex flex-col h-full max-w-5xl">
//         {/* Breadcrumbs */}
//         <div className="flex items-center gap-2 text-xs font-medium text-[#475467] mb-8">
//           <Link to="/dashboard/content" className="hover:text-slate-900">Content management</Link>
//           <ArrowRight2 size="12" color="#475467" />
//           <Link to="/dashboard/content/emails" className="hover:text-slate-900">Emails and Notifications</Link>
//           <ArrowRight2 size="12" color="#475467" />
//           <span className="text-[#135ED6]">Compose email</span>
//         </div>

//         {/* Compose Card */}
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
//           <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
//             <span className="text-sm font-semibold text-slate-900">New Notification</span>
//           </div>

//           <div className="p-6 flex flex-col flex-1 gap-6">
//             <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4">
//               <span className="text-sm font-medium text-slate-900">Recipients</span>
//               <Select value={recipientGroup} onValueChange={(val) => setRecipientGroup(val || "")}>
//                 <SelectTrigger className="w-60 text-[#475467]">
//                   <SelectValue placeholder="Select user group" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all_users">All users</SelectItem>
//                   <SelectItem value="active_users">Active users</SelectItem>
//                   <SelectItem value="inactive_users">Inactive users</SelectItem>
//                   <SelectItem value="subscribers">Subscribers</SelectItem>
//                   <SelectItem value="custom">Custom (Explicit Emails)</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             {recipientGroup === "custom" && (
//               <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4 animate-in fade-in slide-in-from-top-2">
//                 <span className="text-sm font-medium text-slate-900">Emails</span>
//                 <Input 
//                   value={explicitRecipients}
//                   onChange={(e) => setExplicitRecipients(e.target.value)}
//                   placeholder="user1@example.com, user2@example.com (comma separated)"
//                   className="border-none shadow-none focus-visible:ring-0 px-0 rounded-none text-slate-900 placeholder:text-[#475467]/50"
//                 />
//               </div>
//             )}
//             <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4">
//               <span className="text-sm font-medium text-slate-900">Subject</span>
//               <Input 
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 placeholder="Enter subject line..."
//                 className="border-none shadow-none focus-visible:ring-0 px-0 rounded-none text-slate-900 placeholder:text-[#475467]/50"
//               />
//             </div>

//             <div className="grid grid-cols-[100px_1fr] items-start gap-4 flex-1">
//               <span className="text-sm font-medium text-slate-900 pt-3">Body Text</span>
//               <textarea 
//                 value={body}
//                 onChange={(e) => setBody(e.target.value)}
//                 placeholder="Write your message here..."
//                 className="w-full h-full min-h-[300px] resize-none outline-none text-sm text-[#475467] placeholder:text-[#475467]/50 pt-3"
//               />
//             </div>
//           </div>

//           {/* Bottom Toolbar */}
//           <div className="p-4 border-t border-slate-200 flex items-center justify-between">
//             <div className="flex items-center gap-6">
//               <Button 
//                 onClick={handleSend} 
//                 disabled={isPending}
//                 className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white px-6"
//               >
//                 {isPending ? "Sending..." : "Send Message"}
//               </Button>
//               <Button 
//                 onClick={handleSaveDraft} 
//                 disabled={isPending || isDrafting}
//                 variant="outline"
//                 className="text-[#475467] border-slate-200"
//               >
//                 {isDrafting ? "Saving..." : "Save as draft"}
//               </Button>
//               <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
//                 <button className="text-[#475467] hover:text-slate-900"><TextBold size="18" color="#475467" /></button>
//                 <button className="text-[#475467] hover:text-slate-900"><Link2 size="18" color="#475467" /></button>
//                 <button className="text-[#475467] hover:text-slate-900"><EmojiNormal size="18" color="#475467" /></button>
//               </div>
//             </div>
            
//             <button 
//               onClick={() => navigate("/dashboard/content/emails")} 
//               className="p-2 text-[#475467] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
//             >
//               <Trash size="20" color="currentColor" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// };

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight2, Trash } from "iconsax-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { htmlToEmailText, htmlToPlainText, toHtml } from "@/components/lib/richText";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  useComposeMessage, 
  useSaveDraft, 
  useMessageDetails, 
  type ComposeMessagePayload,
} from "../apis/useMessages";
import { AttachmentField } from "./AttachmentField";
import { attachmentFromMessage, type Attachment } from "./attachment";

export const ComposeMessage = () => {
  const navigate = useNavigate();
  
  // 👉 1. Check if we are in Edit Mode
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  // 👉 2. Fetch existing data and setup mutations
  const { data: existingMessage, isLoading: isFetching } = useMessageDetails(editId || "");
  const { mutate: composeMessage, isPending: isComposing } = useComposeMessage();
  const { mutate: saveDraft, isPending: isDrafting } = useSaveDraft();

  const isPending = isComposing || isDrafting;
  
  // State
  const [recipientGroup, setRecipientGroup] = useState("all_users");
  const [explicitRecipients, setExplicitRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState(""); // editor HTML
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  // 👉 3. Auto-populate fields when data arrives
  useEffect(() => {
    if (isEditMode && existingMessage) {
      setSubject(existingMessage.subject || "");
      // Prefer the rich version; older messages only have plain-text `body`.
      setBodyHtml(existingMessage.bodyHtml || toHtml(existingMessage.body));
      setAttachment(attachmentFromMessage(existingMessage));
      
      // Intelligently map recipients back to dropdown or custom input
      const rec = existingMessage.recipients || "";
      const knownGroups = ["all_users", "active_users", "inactive_users", "subscribers"];
      
      if (knownGroups.includes(rec)) {
        setRecipientGroup(rec);
      } else if (rec) {
        setRecipientGroup("custom");
        setExplicitRecipients(Array.isArray(rec) ? rec.join(", ") : rec);
      }
    }
  }, [existingMessage, isEditMode]);

  const buildPayload = (): ComposeMessagePayload => {
    const payload: ComposeMessagePayload = {
      channel: 'email',
      recipientGroup,
      subject,
      body: htmlToEmailText(bodyHtml), // plain-text fallback
      bodyHtml,
    };

    if (attachment) {
      payload.attachment = attachment.data;
      // A data URL doesn't carry the file name, so send it alongside.
      payload.metadata = {
        attachmentName: attachment.name,
        attachmentType: attachment.type,
        attachmentSize: attachment.size,
      };
    }

    if (recipientGroup === "custom" && explicitRecipients.trim()) {
      payload.recipients = explicitRecipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);
    }

    return payload;
  };

  const hasBody = htmlToPlainText(bodyHtml).trim().length > 0 || /<img\s/i.test(bodyHtml);

  const handleSend = () => {
    if (!subject || !hasBody) {
      toast.error("Please fill out the subject and body before sending.");
      return;
    }
    if (recipientGroup === "custom" && !explicitRecipients.trim()) {
      toast.error("Please provide at least one explicit recipient email.");
      return;
    }

    // 👉 4. New message or a draft being sent: both go to POST /admin/messages/compose
    composeMessage(buildPayload(), {
      onSuccess: () => {
        toast.success("Message sent successfully!");
        navigate("/dashboard/content/emails");
      },
      onError: () => toast.error("Failed to send message. Please try again.")
    });
  };

  const handleSaveDraft = () => {
    if (!subject && !hasBody) {
      toast.error("Please enter at least a subject or body to save a draft.");
      return;
    }

    const payload = buildPayload();

    // Removing the draft's existing attachment needs an explicit empty value on PATCH.
    if (isEditMode && !attachment && existingMessage?.attachment) {
      payload.attachment = "";
    }

    if (isEditMode && editId) {
      // PATCH /admin/messages/drafts/:id
      saveDraft(
        { id: editId, ...payload },
        {
          onSuccess: () => {
            toast.success("Draft updated successfully!");
            navigate("/dashboard/content/emails");
          },
          onError: () => toast.error("Failed to update draft.")
        }
      );
    } else {
      saveDraft(payload, {
        onSuccess: () => {
          toast.success("Draft saved successfully!");
          navigate("/dashboard/content/emails");
        },
        onError: () => toast.error("Failed to save draft. Please try again.")
      });
    }
  };

  return (
    <AdminLayout 
      title="Emails and Notifications" 
      subtitle="Keep track of user subscriptions, churn rate, and your revenue."
    >
      <div className="flex flex-col max-w-5xl pb-2">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#475467] mb-8">
          <Link to="/dashboard/content" className="hover:text-slate-900">Content management</Link>
          <ArrowRight2 size="12" color="#475467" />
          <Link to="/dashboard/content/emails" className="hover:text-slate-900">Emails and Notifications</Link>
          <ArrowRight2 size="12" color="#475467" />
          <span className="text-[#135ED6]">{isEditMode ? "Edit email" : "Compose email"}</span>
        </div>

        {/* Compose Card */}
        {/* No overflow-hidden / flex-1 here: in a flex column that lets the card
            shrink to the viewport and clip the footer (the Send button). */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 rounded-t-xl flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-900">
              {isEditMode ? "Edit Notification" : "New Notification"}
            </span>
          </div>

          {isFetching ? (
            <div className="min-h-[300px] flex items-center justify-center text-[#475467]">
              Loading message data...
            </div>
          ) : (
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4">
                <span className="text-sm font-medium text-slate-900">Recipients</span>
                <Select value={recipientGroup} onValueChange={(val) => setRecipientGroup(val || "")}>
                  <SelectTrigger className="w-60 text-[#475467]">
                    <SelectValue placeholder="Select user group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_users">All users</SelectItem>
                    <SelectItem value="active_users">Active users</SelectItem>
                    <SelectItem value="inactive_users">Inactive users</SelectItem>
                    <SelectItem value="subscribers">Subscribers</SelectItem>
                    <SelectItem value="custom">Custom (Explicit Emails)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {recipientGroup === "custom" && (
                <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4 animate-in fade-in slide-in-from-top-2">
                  <span className="text-sm font-medium text-slate-900">Emails</span>
                  <Input 
                    value={explicitRecipients}
                    onChange={(e) => setExplicitRecipients(e.target.value)}
                    placeholder="user1@example.com, user2@example.com (comma separated)"
                    className="border-none shadow-none focus-visible:ring-0 px-0 rounded-none text-slate-900 placeholder:text-[#475467]/50"
                  />
                </div>
              )}
              <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-slate-100 pb-4">
                <span className="text-sm font-medium text-slate-900">Subject</span>
                <Input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject line..."
                  className="border-none shadow-none focus-visible:ring-0 px-0 rounded-none text-slate-900 placeholder:text-[#475467]/50"
                />
              </div>

              <div className="grid grid-cols-[100px_1fr] items-start gap-4">
                <span className="text-sm font-medium text-slate-900 pt-2">Body Text</span>
                <RichTextEditor
                  value={bodyHtml}
                  onChange={setBodyHtml}
                  disabled={isPending}
                  placeholder="Write your message here..."
                />
              </div>

              <div className="grid grid-cols-[100px_1fr] items-start gap-4 border-t border-slate-100 pt-4">
                <span className="text-sm font-medium text-slate-900 pt-2">Attachment</span>
                <AttachmentField value={attachment} onChange={setAttachment} disabled={isPending} />
              </div>
            </div>
          )}

          {/* Bottom Toolbar: sticks to the bottom of the screen so Send is always reachable.
              -bottom-8 cancels the layout's p-8 so nothing scrolls visibly under the bar */}
          <div className="sticky -bottom-8 z-10 p-4 bg-white border-t border-slate-200 rounded-b-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                onClick={handleSend} 
                disabled={isPending || isFetching}
                className="bg-[#135ED6] hover:bg-[#0F4BAB] text-white px-6"
              >
                {isComposing ? "Sending..." : "Send Message"}
              </Button>
              <Button 
                onClick={handleSaveDraft} 
                disabled={isPending || isFetching}
                variant="outline"
                className="text-[#475467] border-slate-200"
              >
                {isDrafting ? "Saving..." : isEditMode ? "Update Draft" : "Save as draft"}
              </Button>
            </div>
            
            <button 
              type="button"
              title="Discard"
              aria-label="Discard"
              onClick={() => navigate("/dashboard/content/emails")} 
              className="p-2 text-[#475467] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash size="20" color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};