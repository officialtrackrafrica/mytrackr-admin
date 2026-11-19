export interface Attachment {
  /** What goes in the payload's `attachment` field: a data URL (new files) or a URL from the backend. */
  data: string;
  name: string;
  type: string;
  size?: number;
}

/** Keep in step with the backend's request body limit (base64 adds ~33%). */
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

/** Turn what the backend returns for a saved message back into an Attachment. */
export const attachmentFromMessage = (message: {
  attachment?: string | null;
  metadata?: Record<string, unknown> | null;
}): Attachment | null => {
  if (!message.attachment) return null;
  const meta = message.metadata ?? {};
  const fromUrl = message.attachment.startsWith("data:")
    ? undefined
    : decodeURIComponent(message.attachment.split("?")[0].split("/").pop() || "");
  const dataUrlType = message.attachment.match(/^data:([^;,]+)/)?.[1];
  return {
    data: message.attachment,
    name: (meta.attachmentName as string) || fromUrl || "Attachment",
    type: (meta.attachmentType as string) || dataUrlType || "",
    size: typeof meta.attachmentSize === "number" ? meta.attachmentSize : undefined,
  };
};
