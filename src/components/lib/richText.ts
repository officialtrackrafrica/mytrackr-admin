import DOMPurify from "dompurify";

const HTML_TAG = /<\/?[a-z][\s\S]*>/i;

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Message bodies used to be plain text. Convert those into paragraphs so the
 * editor and the details view render them the same way as new HTML bodies.
 */
export const toHtml = (body: string | null | undefined): string => {
  if (!body) return "";
  if (HTML_TAG.test(body)) return body;

  return body
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
};

/** Clean HTML before rendering it with dangerouslySetInnerHTML. */
export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });

/** Plain-text version of an HTML body, for previews and empty checks. */
export const htmlToPlainText = (html: string | null | undefined): string => {
  if (!html) return "";
  if (!HTML_TAG.test(html)) return html;

  // Add spaces between blocks so "<p>a</p><p>b</p>" reads "a b", not "ab".
  const spaced = html.replace(/<\/(p|h[1-6]|li|blockquote)>|<br\s*\/?>/gi, "$& ");
  const doc = new DOMParser().parseFromString(spaced, "text/html");
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
};

/**
 * Plain-text version of an HTML body for the email's text part (`body`).
 * Keeps paragraphs, line breaks, list bullets and link URLs readable.
 */
export const htmlToEmailText = (html: string | null | undefined): string => {
  if (!html) return "";
  if (!HTML_TAG.test(html)) return html;

  const doc = new DOMParser().parseFromString(html, "text/html");

  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as HTMLElement;
    const inner = () => Array.from(el.childNodes).map(walk).join("");

    switch (el.tagName) {
      case "BR":
        return "\n";
      case "IMG": {
        const alt = el.getAttribute("alt");
        return alt ? `[${alt}]` : "";
      }
      case "A": {
        const text = inner();
        const href = el.getAttribute("href");
        return href && href !== text ? `${text} (${href})` : text;
      }
      case "LI": {
        const parent = el.parentElement;
        const marker =
          parent?.tagName === "OL"
            ? `${Array.from(parent.children).indexOf(el) + 1}. `
            : "- ";
        return `${marker}${inner().trim()}\n`;
      }
      case "UL":
      case "OL":
        return `${inner()}\n`;
      case "P":
      case "H1":
      case "H2":
      case "H3":
      case "H4":
      case "BLOCKQUOTE":
        return `${inner().trim()}\n\n`;
      default:
        return inner();
    }
  };

  return walk(doc.body)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
