"use client";

import { useEffect } from "react";

function scrollToHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return;

  const target = document.getElementById(hash);
  if (target) {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

export function ChangelogHashScroll() {
  useEffect(() => {
    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
