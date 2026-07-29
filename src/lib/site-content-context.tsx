// Runtime source of truth for site content: fetches from api.content and
// makes it available to every section. Falls back to DEFAULT_SITE_CONTENT
// while loading, which keeps the site rendering with valid data even before
// the backend responds.
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { api } from "./api";
import { DEFAULT_SITE_CONTENT, type SiteContent } from "./site-content-default";

const SiteContentContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    let alive = true;
    api.content
      .get()
      .then((c) => {
        if (alive && c) setContent(c);
      })
      .catch(() => {
        /* fall back to defaults */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
