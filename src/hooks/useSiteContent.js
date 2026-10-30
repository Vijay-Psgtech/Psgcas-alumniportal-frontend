import { useEffect, useState } from "react";
import { siteContentAPI } from "../services/api";

const mergeContent = (defaults, content) => {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return content ?? defaults;
  }

  return Object.fromEntries(
    Object.entries({ ...defaults, ...content }).map(([key, value]) => [
      key,
      defaults?.[key] &&
      value &&
      typeof defaults[key] === "object" &&
      typeof value === "object" &&
      !Array.isArray(defaults[key]) &&
      !Array.isArray(value)
        ? mergeContent(defaults[key], value)
        : value,
    ]),
  );
};

export default function useSiteContent(page, defaults) {
  const [content, setContent] = useState(defaults);

  useEffect(() => {
    let active = true;
    let updateVersion = 0;
    let latestRequest = 0;

    const refresh = async () => {
      const requestId = ++latestRequest;
      const versionAtStart = updateVersion;
      try {
        const response = await siteContentAPI.getPage(page);
        if (
          active &&
          requestId === latestRequest &&
          versionAtStart === updateVersion &&
          response.data.data
        ) {
          setContent(mergeContent(defaults, response.data.data));
        }
      } catch (error) {
        console.error(`Failed to load ${page} site content:`, error);
      }
    };

    const handleContentUpdate = (event) => {
      if (event.detail?.page === page && event.detail.content) {
        updateVersion += 1;
        latestRequest += 1;
        setContent(mergeContent(defaults, event.detail.content));
      }
    };
    const handleFocus = () => refresh();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    refresh();
    window.addEventListener("site-content:updated", handleContentUpdate);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      active = false;
      window.removeEventListener("site-content:updated", handleContentUpdate);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [page, defaults]);

  return content;
}

export { mergeContent };
