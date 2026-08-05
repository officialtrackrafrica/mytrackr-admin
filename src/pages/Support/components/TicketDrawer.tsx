import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Paperclip2, EmojiNormal, Send2, DocumentText } from "iconsax-react";
import { Input } from "@/components/ui/input";
import { useTicketDetails, useReplyToTicket, useUpdateTicketStatus } from "../apis/useSupport";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string | undefined;
  initialTicket: any | null; // Used for skeleton/optimistic display while fetching full thread
}

export const TicketDrawer = ({ isOpen, onClose, ticketId, initialTicket }: TicketDrawerProps) => {
  const [replyMessage, setReplyMessage] = useState("");

  // 👉 Fetch full thread data
  const { data, isLoading } = useTicketDetails(ticketId);
  const ticket = data?.data || data?.ticket || initialTicket;
  
  // 👉 Mutations
  const { mutate: sendReply, isPending: isSending } = useReplyToTicket();
  const { mutate: updateStatus } = useUpdateTicketStatus();

  if (!ticket && !isOpen) return null;

  const handleSendReply = () => {
    if (!replyMessage.trim() || !ticketId) return;
    
    sendReply({ id: ticketId, message: replyMessage }, {
      onSuccess: () => {
        setReplyMessage("");
        toast.success("Reply sent successfully.");
      },
      onError: () => {
        toast.error("Failed to send reply.");
      }
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!ticketId) return;
    updateStatus({ id: ticketId, status: newStatus }, {
      onSuccess: () => toast.success(`Status updated to ${newStatus}`)
    });
  };

  const statusStr = (ticket?.status || "Open").toLowerCase();
  const statusStyles: Record<string, string> = {
    closed: "bg-emerald-50 text-emerald-700",
    resolved: "bg-emerald-50 text-emerald-700",
    "in progress": "bg-orange-50 text-orange-700",
    open: "bg-orange-50 text-orange-700",
    pending: "bg-yellow-50 text-yellow-700",
  };

  const dotColor = {
    closed: "bg-emerald-500",
    resolved: "bg-emerald-500",
    "in progress": "bg-orange-500",
    open: "bg-orange-500",
    pending: "bg-yellow-500",
  };

  const replies = data?.replies || ticket?.replies || [];
  const initialDate = ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "N/A";
  const updatedDate = ticket?.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : initialDate;

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Customer ticket"
      className="sm:max-w-[550px]"
    >
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* Ticket Metadata Grid */}
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div>
            <p className="text-xs font-medium text-[#475467] mb-1">Ticket ID</p>
            <p className="font-semibold text-slate-900 truncate" title={ticket?.ticketId || ticketId}>
              {ticket?.ticketId || ticketId?.substring(0, 8)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[#475467] mb-1">Category</p>
            <p className="font-semibold text-slate-900 capitalize">{ticket?.category || "General"}</p>
          </div>
          <div className="pr-4">
            <p className="text-xs font-medium text-[#475467] mb-1">Status</p>
            <Select value={statusStr} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-6 text-xs font-semibold px-2 py-0 border-transparent shadow-none bg-transparent hover:bg-slate-200/50 -ml-2 text-slate-900 focus:ring-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open / In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed / Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs font-medium text-[#475467] mb-1">Submitted</p>
            <p className="font-semibold text-slate-900">{initialDate}</p>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* Thread Header */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-6 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{ticket?.title || ticket?.subject}</h3>
              <p className="text-xs text-[#475467] mt-1">Updated {updatedDate}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusStyles}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
              {statusStr}
            </span>
          </div>

          {isLoading ? (
            <div className="text-center text-slate-500 py-10">Loading conversation...</div>
          ) : (
            <>
              {/* Initial User Message */}
              <div className="flex gap-4">
                <Avatar className="h-8 w-8 mt-1 border border-slate-200 shrink-0">
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                    {(ticket?.user?.name || ticket?.user?.firstName || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{ticket?.user?.name || ticket?.user?.firstName || "Unknown User"}</span>
                    <span className="text-xs text-[#475467]">{new Date(ticket?.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})}</span>
                  </div>
                  <p className="text-sm text-[#475467] leading-relaxed whitespace-pre-wrap">
                    {ticket?.description || ticket?.message}
                  </p>
                </div>
              </div>

              {/* Thread Replies */}
              {replies.map((reply: any) => (
                <div key={reply.id || reply._id} className="flex gap-4">
                  <Avatar className="h-8 w-8 mt-1 border border-slate-200 shrink-0">
                    {reply.isAdmin || reply.senderModel === "Admin" ? (
                      <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">M</AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
                        {(reply.sender?.name || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-sm">
                        {reply.isAdmin || reply.senderModel === "Admin" ? "MyTrackr Support" : (reply.sender?.name || "Customer")}
                      </span>
                      <span className="text-xs text-[#475467]">
                        {new Date(reply.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})}
                      </span>
                    </div>
                    <p className="text-sm text-[#475467] leading-relaxed whitespace-pre-wrap">
                      {reply.message}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Reply Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <button className="p-2 text-[#475467] hover:bg-slate-50 rounded-md transition-colors">
              <Paperclip2 size="18" color="#475467" />
            </button>
            <button className="p-2 text-[#475467] hover:bg-slate-50 rounded-md transition-colors">
              <EmojiNormal size="18" color="#475467" />
            </button>
            <Input 
              placeholder="Enter your reply here" 
              className="flex-1 border-none shadow-none focus-visible:ring-0 px-2 text-sm"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <button 
              onClick={handleSendReply}
              disabled={isSending || !replyMessage.trim()}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            >
              <Send2 size="18" color="currentColor" />
            </button>
          </div>
        </div>

      </div>
    </Drawer>
  );
};