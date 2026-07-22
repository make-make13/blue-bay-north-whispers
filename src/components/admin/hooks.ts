// Draft autosave + unsaved-changes guard for admin forms.
import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker } from "@tanstack/react-router";

const DRAFT_PREFIX = "gb.admin.draft.";

export function useDraft<T>(
  key: string | null,
  currentValue: T,
  setValue: (v: T) => void,
) {
  const restored = useRef(false);
  const storageKey = key ? DRAFT_PREFIX + key : null;

  // Restore once on mount if a draft exists.
  useEffect(() => {
    if (!storageKey || restored.current) return;
    restored.current = true;
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as T;
        setValue(parsed);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Save on every change (debounced by React batching).
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(currentValue));
    } catch {
      /* ignore */
    }
  }, [storageKey, currentValue]);

  const clear = useCallback(() => {
    if (!storageKey || typeof window === "undefined") return;
    window.localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { clear };
}

export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty || typeof window === "undefined") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  useBlocker({
    shouldBlockFn: () => {
      if (!dirty) return false;
      return !window.confirm("Вы не сохранили изменения. Уйти со страницы?");
    },
    enableBeforeUnload: false,
  });
}

export function useDirtyState<T>(initial: T): [
  T,
  (v: T | ((prev: T) => T)) => void,
  { dirty: boolean; reset: (v: T) => void },
] {
  const [snapshot, setSnapshot] = useState<T>(initial);
  const [value, setInner] = useState<T>(initial);
  const setValue = useCallback((v: T | ((p: T) => T)) => {
    setInner((prev) => (typeof v === "function" ? (v as (p: T) => T)(prev) : v));
  }, []);
  const reset = useCallback((v: T) => {
    setSnapshot(v);
    setInner(v);
  }, []);
  const dirty = JSON.stringify(snapshot) !== JSON.stringify(value);
  return [value, setValue, { dirty, reset }];
}
