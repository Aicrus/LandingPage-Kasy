import { Braces, File, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";

const folderClass = "size-[1.1em] shrink-0 text-[#8da8c4] dark:text-[#90a4c0]";

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
      className={cn("size-[1.1em] shrink-0 object-contain", className)}
    />
  );
}

function FlutterConfigIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-[1.1em] shrink-0", className)}
      aria-hidden
    >
      <path fill="#54C5F8" d="m8.1 1.5 4.4 4.4-4.4 4.4-4.4-4.4L8.1 1.5Z" />
      <path fill="#01579B" d="M8.1 10.3 12.5 14.7H3.7l4.4-4.4Z" />
      <path fill="#29B6F6" d="M8.1 10.3 3.7 14.7h4.4V10.3Z" />
    </svg>
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
  const isFlutterConfig = name === "pubspec.yaml" || name === "analysis_options.yaml";

  if (ext === "dart") {
    return <DartFileIcon className={className} />;
  }

  if (isFlutterConfig) {
    return <FlutterConfigIcon className={className} />;
  }

  if (ext === "yaml" || ext === "yml") {
    return (
      <Braces
        className={cn("size-[1.1em] shrink-0 text-[#cb171e]", className)}
        strokeWidth={1.75}
        aria-hidden
      />
    );
  }

  return (
    <File
      className={cn("size-[1.1em] shrink-0 text-[#8b949e]", className)}
      strokeWidth={1.75}
      aria-hidden
    />
  );
}
