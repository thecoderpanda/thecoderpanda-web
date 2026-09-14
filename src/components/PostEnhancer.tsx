"use client";

import { useEffect } from "react";

export function PostEnhancer() {
  useEffect(() => {
    // ---- mermaid ----
    const mermaidNodes = document.querySelectorAll<HTMLElement>("div.mermaid");
    if (mermaidNodes.length > 0) {
      (async () => {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          securityLevel: "loose",
          fontFamily:
            "'Inter', 'Geist', system-ui, -apple-system, sans-serif",
          themeVariables: {
            primaryColor: "#faf9f7",
            primaryTextColor: "#1a1a1a",
            primaryBorderColor: "#1a1a1a",
            lineColor: "#4a4a4a",
            secondaryColor: "#f0ede8",
            tertiaryColor: "#eef2f5",
            background: "#faf9f7",
            fontSize: "15px",
          },
        });
        for (let i = 0; i < mermaidNodes.length; i++) {
          const node = mermaidNodes[i];
          if (node.dataset.processed === "true") continue;
          const src = node.textContent || "";
          try {
            const id = `mmd-${Date.now()}-${i}`;
            const { svg } = await mermaid.render(id, src);
            node.innerHTML = svg;
            node.dataset.processed = "true";
          } catch (err) {
            node.innerHTML = `<pre class="mermaid-error">Mermaid render error: ${String(
              (err as Error)?.message || err
            )}</pre>`;
          }
        }
      })();
    }

    // ---- copy buttons ----
    const buttons = document.querySelectorAll<HTMLButtonElement>(
      ".code-block__copy"
    );
    const cleanups: (() => void)[] = [];
    buttons.forEach((btn) => {
      const handler = async () => {
        const wrapper = btn.closest<HTMLElement>(".code-block");
        const encoded = wrapper?.dataset.code || "";
        const text = encoded ? decodeURIComponent(encoded) : "";
        try {
          await navigator.clipboard.writeText(text);
          const prev = btn.textContent;
          btn.textContent = "Copied";
          btn.classList.add("is-copied");
          window.setTimeout(() => {
            btn.textContent = prev || "Copy";
            btn.classList.remove("is-copied");
          }, 1600);
        } catch {
          btn.textContent = "Failed";
          window.setTimeout(() => (btn.textContent = "Copy"), 1600);
        }
      };
      btn.addEventListener("click", handler);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
