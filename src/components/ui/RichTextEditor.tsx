import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Smile,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { cn } from "@/components/lib/utils";

const EMOJIS = [
  "😀", "😄", "😊", "😉", "😍", "🥳", "😎", "🤝",
  "👍", "👏", "🙌", "🙏", "💪", "🔥", "✨", "🎉",
  "🎁", "📢", "📌", "📈", "💰", "💳", "✅", "⚠️",
  "❤️", "⭐", "🚀", "⏰", "📅", "📩", "🔔", "💡",
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Write your message here...",
  disabled = false,
  className,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        trailingNode: false, // no empty <p> appended after lists in the sent email
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({
        // Email clients (Gmail, Outlook) block base64/data: images, so only
        // hosted images (http/https URLs) are allowed. Pasted image files are dropped.
        allowBase64: false,
        HTMLAttributes: { style: "max-width: 100%; height: auto;" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "rich-text min-h-[300px] outline-none text-sm text-[#475467] py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  // Load content that arrives after mount (e.g. editing an existing message).
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    // emitUpdate=false: otherwise TipTap fires an "update" on mount, our
    // onChange reports "" and wipes content loaded for an existing draft.
    if (editor && editor.isEditable === disabled) {
      editor.setEditable(!disabled, false);
    }
  }, [editor, disabled]);

  if (!editor) return null;

  return (
    <div className={cn("min-w-0 flex flex-col", className)}>
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
};

// ---------------------------------------------------------------------------

const Toolbar = ({ editor, disabled }: { editor: Editor; disabled: boolean }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      link: editor.isActive("link"),
      alignLeft: editor.isActive({ textAlign: "left" }),
      alignCenter: editor.isActive({ textAlign: "center" }),
      alignRight: editor.isActive({ textAlign: "right" }),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-2">
      <ToolButton label="Undo" onClick={() => chain().undo().run()} disabled={disabled || !state.canUndo}>
        <Undo2 size={16} />
      </ToolButton>
      <ToolButton label="Redo" onClick={() => chain().redo().run()} disabled={disabled || !state.canRedo}>
        <Redo2 size={16} />
      </ToolButton>

      <Divider />

      <ToolButton label="Heading" active={state.h2} disabled={disabled} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={16} />
      </ToolButton>
      <ToolButton label="Subheading" active={state.h3} disabled={disabled} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={16} />
      </ToolButton>

      <Divider />

      <ToolButton label="Bold (Ctrl+B)" active={state.bold} disabled={disabled} onClick={() => chain().toggleBold().run()}>
        <Bold size={16} />
      </ToolButton>
      <ToolButton label="Italic (Ctrl+I)" active={state.italic} disabled={disabled} onClick={() => chain().toggleItalic().run()}>
        <Italic size={16} />
      </ToolButton>
      <ToolButton label="Underline (Ctrl+U)" active={state.underline} disabled={disabled} onClick={() => chain().toggleUnderline().run()}>
        <Underline size={16} />
      </ToolButton>
      <ToolButton label="Strikethrough" active={state.strike} disabled={disabled} onClick={() => chain().toggleStrike().run()}>
        <Strikethrough size={16} />
      </ToolButton>

      <Divider />

      <ToolButton label="Bullet list" active={state.bulletList} disabled={disabled} onClick={() => chain().toggleBulletList().run()}>
        <List size={16} />
      </ToolButton>
      <ToolButton label="Numbered list" active={state.orderedList} disabled={disabled} onClick={() => chain().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </ToolButton>
      <ToolButton label="Quote" active={state.blockquote} disabled={disabled} onClick={() => chain().toggleBlockquote().run()}>
        <Quote size={16} />
      </ToolButton>

      <Divider />

      <ToolButton label="Align left" active={state.alignLeft} disabled={disabled} onClick={() => chain().setTextAlign("left").run()}>
        <AlignLeft size={16} />
      </ToolButton>
      <ToolButton label="Align center" active={state.alignCenter} disabled={disabled} onClick={() => chain().setTextAlign("center").run()}>
        <AlignCenter size={16} />
      </ToolButton>
      <ToolButton label="Align right" active={state.alignRight} disabled={disabled} onClick={() => chain().setTextAlign("right").run()}>
        <AlignRight size={16} />
      </ToolButton>

      <Divider />

      <LinkControl editor={editor} active={state.link} disabled={disabled} />
      {state.link && (
        <ToolButton label="Remove link" disabled={disabled} onClick={() => chain().extendMarkRange("link").unsetLink().run()}>
          <Unlink size={16} />
        </ToolButton>
      )}
      <ImageControl editor={editor} disabled={disabled} />
      <EmojiControl editor={editor} disabled={disabled} />

      <Divider />

      <ToolButton label="Clear formatting" disabled={disabled} onClick={() => chain().unsetAllMarks().clearNodes().run()}>
        <RemoveFormatting size={16} />
      </ToolButton>
    </div>
  );
};

const ToolButton = ({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()} // keep the editor selection
    onClick={onClick}
    className={cn(
      "h-8 w-8 inline-flex items-center justify-center rounded-md text-[#475467] transition-colors",
      "hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none",
      active && "bg-[#135ED6]/10 text-[#135ED6] hover:bg-[#135ED6]/15 hover:text-[#135ED6]"
    )}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />;

/** Closes a popover when clicking outside it or pressing Escape. */
const useDismiss = (open: boolean, close: () => void) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
};

const LinkControl = ({ editor, active, disabled }: { editor: Editor; active: boolean; disabled: boolean }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const ref = useDismiss(open, () => setOpen(false));

  const openPopover = () => {
    setUrl(editor.getAttributes("link").href ?? "");
    setOpen(true);
  };

  const apply = () => {
    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!href) {
      chain.unsetLink().run();
    } else if (editor.state.selection.empty && !active) {
      // Nothing selected: insert the URL itself as linked text.
      chain.insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      chain.setLink({ href }).run();
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <ToolButton label="Insert link" active={active || open} disabled={disabled} onClick={() => (open ? setOpen(false) : openPopover())}>
        <Link2 size={16} />
      </ToolButton>
      {open && (
        <div className="absolute right-0 top-9 z-20 flex w-72 items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
            placeholder="https://example.com"
            className="h-8 flex-1 rounded-md border border-slate-200 px-2 text-sm text-slate-900 outline-none focus:border-[#135ED6]"
          />
          <button
            type="button"
            onClick={apply}
            className="h-8 rounded-md bg-[#135ED6] px-3 text-xs font-medium text-white hover:bg-[#0F4BAB]"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

const EmojiControl = ({ editor, disabled }: { editor: Editor; disabled: boolean }) => {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <ToolButton label="Insert emoji" active={open} disabled={disabled} onClick={() => setOpen((o) => !o)}>
        <Smile size={16} />
      </ToolButton>
      {open && (
        <div className="absolute right-0 top-9 z-20 grid w-72 grid-cols-8 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                editor.chain().focus().insertContent(emoji).run();
                setOpen(false);
              }}
              className="h-8 w-8 rounded-md text-lg leading-none hover:bg-slate-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const ImageControl = ({ editor, disabled }: { editor: Editor; disabled: boolean }) => {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [error, setError] = useState("");
  const ref = useDismiss(open, () => setOpen(false));

  const openPopover = () => {
    setSrc("");
    setAlt("");
    setError("");
    setOpen(true);
  };

  const insert = () => {
    const url = src.trim();
    if (!isHttpUrl(url)) {
      setError("Enter a full image link starting with https://");
      return;
    }
    editor.chain().focus().setImage({ src: url, alt: alt.trim() || undefined }).run();
    setOpen(false);
  };

  const onEnter = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insert();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <ToolButton label="Insert image" active={open} disabled={disabled} onClick={() => (open ? setOpen(false) : openPopover())}>
        <ImagePlus size={16} />
      </ToolButton>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-80 space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <input
            autoFocus
            type="url"
            value={src}
            onChange={(e) => {
              setSrc(e.target.value);
              setError("");
            }}
            onKeyDown={onEnter}
            placeholder="Image link, e.g. https://site.com/banner.png"
            className="h-8 w-full rounded-md border border-slate-200 px-2 text-sm text-slate-900 outline-none focus:border-[#135ED6]"
          />
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onKeyDown={onEnter}
            placeholder="Description (shown if the image can't load)"
            className="h-8 w-full rounded-md border border-slate-200 px-2 text-sm text-slate-900 outline-none focus:border-[#135ED6]"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          {isHttpUrl(src.trim()) && (
            <img src={src.trim()} alt="" className="max-h-32 w-full rounded-md border border-slate-100 object-contain" />
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={insert}
              className="h-8 rounded-md bg-[#135ED6] px-3 text-xs font-medium text-white hover:bg-[#0F4BAB]"
            >
              Insert image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
