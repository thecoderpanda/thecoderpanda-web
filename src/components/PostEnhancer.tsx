"use client";

import { useEffect } from "react";

const MAGNIFY_ICON = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="11" cy="11" r="7"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  <line x1="11" y1="8" x2="11" y2="14"/>
  <line x1="8" y1="11" x2="14" y2="11"/>
</svg>
`;

function openLightbox(sourceSvg: SVGElement) {
  const overlay = document.createElement("div");
  overlay.className = "mermaid-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const stage = document.createElement("div");
  stage.className = "mermaid-lightbox__stage";

  const cloned = sourceSvg.cloneNode(true) as SVGElement;
  cloned.removeAttribute("style");
  cloned.setAttribute("width", "1200");
  cloned.removeAttribute("height");
  stage.appendChild(cloned);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "mermaid-lightbox__close";
  close.textContent = "Close ✕";

  const controls = document.createElement("div");
  controls.className = "mermaid-lightbox__controls";

  const out = document.createElement("button");
  out.type = "button";
  out.className = "mermaid-lightbox__btn";
  out.textContent = "−";
  out.setAttribute("aria-label", "Zoom out");

  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "mermaid-lightbox__btn";
  reset.textContent = "⤢";
  reset.setAttribute("aria-label", "Reset zoom");

  const zoomLabel = document.createElement("span");
  zoomLabel.className = "mermaid-lightbox__zoom";
  zoomLabel.textContent = "100%";

  const inBtn = document.createElement("button");
  inBtn.type = "button";
  inBtn.className = "mermaid-lightbox__btn";
  inBtn.textContent = "+";
  inBtn.setAttribute("aria-label", "Zoom in");

  controls.appendChild(out);
  controls.appendChild(reset);
  controls.appendChild(zoomLabel);
  controls.appendChild(inBtn);

  overlay.appendChild(close);
  overlay.appendChild(stage);
  overlay.appendChild(controls);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  let zoom = 1;
  const apply = () => {
    cloned.style.transform = `scale(${zoom})`;
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  };
  apply();

  const cleanup = () => {
    document.body.style.overflow = "";
    overlay.remove();
    window.removeEventListener("keydown", onKey);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") cleanup();
    else if (e.key === "+" || e.key === "=") {
      zoom = Math.min(zoom + 0.25, 4);
      apply();
    } else if (e.key === "-") {
      zoom = Math.max(zoom - 0.25, 0.4);
      apply();
    } else if (e.key === "0") {
      zoom = 1;
      apply();
    }
  };
  window.addEventListener("keydown", onKey);

  close.addEventListener("click", cleanup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target === stage) cleanup();
  });
  inBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    zoom = Math.min(zoom + 0.25, 4);
    apply();
  });
  out.addEventListener("click", (e) => {
    e.stopPropagation();
    zoom = Math.max(zoom - 0.25, 0.4);
    apply();
  });
  reset.addEventListener("click", (e) => {
    e.stopPropagation();
    zoom = 1;
    apply();
  });

  stage.addEventListener(
    "wheel",
    (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      zoom = Math.min(4, Math.max(0.4, zoom + delta));
      apply();
    },
    { passive: false }
  );
}

function attachMagnifier(wrapper: HTMLElement) {
  if (wrapper.dataset.magnifyReady === "true") return;
  const svg = wrapper.querySelector<SVGElement>("svg");
  if (!svg) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mermaid-magnify";
  btn.setAttribute("aria-label", "Zoom diagram");
  btn.setAttribute("title", "Zoom diagram");
  btn.innerHTML = MAGNIFY_ICON;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox(svg);
  });
  wrapper.appendChild(btn);
  wrapper.dataset.magnifyReady = "true";
}

export function PostEnhancer() {
  useEffect(() => {
    // ---- mermaid ----
    const wrappers = document.querySelectorAll<HTMLElement>(
      "div.mermaid-wrapper"
    );
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
            fontSize: "16px",
          },
          flowchart: { useMaxWidth: true, htmlLabels: true },
          sequence: { useMaxWidth: true },
          gantt: { useMaxWidth: true },
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
        wrappers.forEach((w) => attachMagnifier(w));
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
