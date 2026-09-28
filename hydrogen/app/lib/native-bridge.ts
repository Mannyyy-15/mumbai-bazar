export const isNative = false;

export async function hapticImpact(style: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(style === "light" ? 10 : style === "medium" ? 25 : 40);
    } catch {}
  }
}

export async function hapticSuccess() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([15, 40, 20]);
    } catch {}
  }
}

type BackHandler = () => boolean;
const backHandlers: { priority: number; handler: BackHandler }[] = [];

export function registerBackHandler(priority: number, handler: BackHandler): () => void {
  const entry = { priority, handler };
  backHandlers.push(entry);
  backHandlers.sort((a, b) => b.priority - a.priority);

  return () => {
    const idx = backHandlers.indexOf(entry);
    if (idx !== -1) backHandlers.splice(idx, 1);
  };
}

export function initializeNativeApp() {}
