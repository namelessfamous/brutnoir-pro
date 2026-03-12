"use client";

/**
 * brutnoir-os · GlobalStyles
 * Injects CSS custom properties for the design system.
 * Works in any React environment (no styled-jsx / Next.js required).
 */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .nf-os-root {
    font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
    background: #0a0a0b;
    color: #f5f0e8;
    -webkit-font-smoothing: antialiased;
  }

  /* Scanline overlay texture */
  .nf-os-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: #0a0a0b; }
  ::-webkit-scrollbar-thumb { background: #333340; border: 1px solid #c8f53c; }

  /* Window drag cursor */
  .nf-window-titlebar { cursor: grab; }
  .nf-window-titlebar:active { cursor: grabbing; }

  /* Animations */
  @keyframes bn-fadeIn    { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes nf-fadeIn    { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes nf-slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bn-slideUp   { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes nf-dockBounce { 0%,100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-12px) scale(1.15); } }
  @keyframes nf-pulse     { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes nf-spin      { to { transform: rotate(360deg); } }
  @keyframes nf-notification { from { opacity:0; transform: translateX(100%); } to { opacity:1; transform: translateX(0); } }

  /* Selection */
  ::selection { background: #c8f53c; color: #0a0a0b; }
`;

export function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
