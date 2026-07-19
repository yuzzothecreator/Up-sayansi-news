"use client";

import { useEffect } from "react";

type ShortcutOptions = {
  enabled?: boolean;
  preventDefault?: boolean;
};

export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {},
) {
  const { enabled = true, preventDefault = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      const parts = key.toLowerCase().split("+");
      const targetKey = parts[parts.length - 1];
      const needsMod = parts.includes("mod");

      if (needsMod && !isMod) return;
      if (event.key.toLowerCase() !== targetKey) return;

      if (preventDefault) event.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [key, callback, enabled, preventDefault]);
}
