import { useRef } from "react";
import { FileText, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { MAX_ATTACHMENT_BYTES, type Attachment } from "./attachment";

// image/* lets phones offer the gallery and camera; the rest opens the file manager.
const ACCEPT = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.zip";

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const formatSize = (bytes?: number) => {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImage = (a: Attachment) =>
  a.type.startsWith("image/") ||
  a.data.startsWith("data:image/") ||
  /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(a.data);

interface AttachmentFieldProps {
  value: Attachment | null;
  onChange: (value: Attachment | null) => void;
  disabled?: boolean;
}

export const AttachmentField = ({ value, onChange, disabled = false }: AttachmentFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again after removing it
    if (!file) return;

    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast.error(`"${file.name}" is too large. The limit is ${formatSize(MAX_ATTACHMENT_BYTES)}.`);
      return;
    }

    try {
      const data = await readAsDataUrl(file);
      onChange({ data, name: file.name, type: file.type || "application/octet-stream", size: file.size });
    } catch {
      toast.error("Couldn't read that file. Please try another one.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={onPick} />

      {value ? (
        <div className="flex max-w-md items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 pr-3">
          {isImage(value) ? (
            <img src={value.data} alt="" className="h-12 w-12 shrink-0 rounded-md border border-slate-200 bg-white object-cover" />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-[#135ED6]">
              <FileText size={22} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <a
              href={value.data}
              download={value.name}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm font-medium text-slate-900 hover:underline"
              title={value.name}
            >
              {value.name}
            </a>
            <span className="text-xs text-[#475467]">{formatSize(value.size)}</span>
          </div>
          <button
            type="button"
            title="Replace file"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="text-xs font-medium text-[#135ED6] hover:underline disabled:opacity-40"
          >
            Replace
          </button>
          <button
            type="button"
            title="Remove attachment"
            aria-label="Remove attachment"
            disabled={disabled}
            onClick={() => onChange(null)}
            className="rounded-md p-1 text-[#475467] hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-[#475467] hover:border-[#135ED6] hover:text-[#135ED6] disabled:opacity-40"
        >
          <Paperclip size={16} />
          Attach image or file
          <span className="text-xs text-[#475467]/70">(max {formatSize(MAX_ATTACHMENT_BYTES)})</span>
        </button>
      )}
    </div>
  );
};
