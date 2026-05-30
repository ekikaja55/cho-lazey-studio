export function initArtProtection() {
  if (typeof window === "undefined") return; // SSR guard

  // 1. Disable Right Click
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // 2. Disable image/element dragging
  document.addEventListener("dragstart", (e) => e.preventDefault());

  // 3. Keyboard shortcut protection
  document.addEventListener("keydown", (e) => {
    const key = e.key || "";

    // F12 — DevTools
    if (key === "F12") {
      e.preventDefault();
      return;
    }

    // Ctrl+Shift+I/J/C — Inspect
    if (
      e.ctrlKey &&
      e.shiftKey &&
      ["I", "J", "C"].includes(key.toUpperCase())
    ) {
      e.preventDefault();
      return;
    }

    // Ctrl+U — View Source
    if (e.ctrlKey && key.toUpperCase() === "U") {
      e.preventDefault();
      return;
    }

    // Ctrl+S — Save Page
    if (e.ctrlKey && key.toUpperCase() === "S") {
      e.preventDefault();
      showProtectionToast(
        "Saving this page is disabled to protect intellectual property.",
      );
      return;
    }

    // PrintScreen
    if (key === "PrintScreen") {
      document.body.style.visibility = "hidden";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(
          "Screenshots are disabled to protect the artwork.",
        );
      }
      showProtectionToast("Screenshots are disabled on this site.");
      setTimeout(() => {
        document.body.style.visibility = "visible";
      }, 1200);
    }
  });

  // 4. Blur on tab/window switch
  window.addEventListener("blur", () => {
    document.body.style.filter = "blur(20px)";
  });

  window.addEventListener("focus", () => {
    document.body.style.filter = "none";
  });
}

export function removeArtProtection() {
  if (typeof window === "undefined") return;
  window.removeEventListener("blur", () => {});
  window.removeEventListener("focus", () => {});
  // Note: contextmenu sama keydown itu anonim di initArtProtection;
}

function showProtectionToast(message) {
  const existing = document.getElementById("cho-protection-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "cho-protection-toast";
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(42, 36, 32, 0.92)",
    color: "#efeae4",
    padding: "12px 24px",
    borderRadius: "8px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: "14px",
    zIndex: "99999",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
    animation: "fadeIn 0.2s ease",
    pointerEvents: "none",
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
