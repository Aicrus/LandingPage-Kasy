"use client";

import type { ComponentProps } from "react";

export function HashLink({ href, onClick, ...props }: ComponentProps<"a">) {
  return (
    <a
      href={href}
      onClick={(e) => {
        const id = href?.match(/#(.+)$/)?.[1];
        const target = id ? document.getElementById(id) : null;

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }

        onClick?.(e);
      }}
      {...props}
    />
  );
}
