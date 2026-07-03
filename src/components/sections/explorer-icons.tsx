import { Braces, File, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";

const folderClass = "size-[1.28em] shrink-0 text-[#8da8c4] dark:text-[#90a4c0]";

export function ExplorerFolderIcon({
  open,
  className,
}: {
  open?: boolean;
  className?: string;
}) {
  const Icon = open ? FolderOpen : Folder;

  return <Icon className={cn(folderClass, className)} strokeWidth={1.75} aria-hidden />;
}

function DartFileIcon({ className }: { className?: string }) {
  return (
    <img
      src="/assets/icons/dart.webp"
      alt=""
      aria-hidden
      draggable={false}
      className={cn("size-[1.28em] shrink-0 object-contain", className)}
    />
  );
}

function fileExtension(name: string) {
  if (!name.includes(".")) return "";
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function ExplorerFileIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const ext = fileExtension(name);

  if (ext === "dart") {
    return <DartFileIcon className={className} />;
  }

  if (ext === "yaml" || ext === "yml") {
    return (
      <Braces
        className={cn("size-[1.28em] shrink-0 text-[#cb171e]", className)}
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  return (
    <File
      className={cn("size-[1.28em] shrink-0 text-[#8b949e]", className)}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}
