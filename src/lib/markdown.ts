import { Marked, Renderer } from "marked";
import hljs from "highlight.js";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function encodeForData(s: string): string {
  return encodeURIComponent(s);
}

const renderer = new Renderer();

renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  const language = (lang || "").trim().toLowerCase();

  if (language === "mermaid") {
    return `<div class="mermaid-wrapper"><div class="mermaid">${escapeHtml(text)}</div></div>`;
  }

  let highlighted: string;
  let displayLang = language || "text";
  try {
    if (language && hljs.getLanguage(language)) {
      highlighted = hljs.highlight(text, { language, ignoreIllegals: true }).value;
    } else {
      const auto = hljs.highlightAuto(text);
      highlighted = auto.value;
      displayLang = auto.language || "text";
    }
  } catch {
    highlighted = escapeHtml(text);
  }

  return `<div class="code-block" data-lang="${escapeHtml(displayLang)}" data-code="${encodeForData(text)}">
    <div class="code-block__bar">
      <span class="code-block__lang">${escapeHtml(displayLang)}</span>
      <button type="button" class="code-block__copy" aria-label="Copy code">Copy</button>
    </div>
    <pre><code class="hljs language-${escapeHtml(language || "text")}">${highlighted}</code></pre>
  </div>`;
};

const configured = new Marked({
  breaks: true,
  gfm: true,
  renderer,
});

export function renderMarkdown(md: string): string {
  return configured.parse(md) as string;
}
