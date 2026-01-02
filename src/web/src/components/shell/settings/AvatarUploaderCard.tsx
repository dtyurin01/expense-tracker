"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/Card";
import {
  ContextMenu,
  type ContextMenuItem,
} from "@/components/ui/contextMenu/ContextMenu";
import { FiImage } from "react-icons/fi";

export function AvatarUploaderCard(props: {
  isLoading: boolean;
  isUploading: boolean;
  onUpload: (file: File) => Promise<void>;
}) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const avatarMenuItems: ContextMenuItem[] = [
    { type: "label", label: "Avatar" },
    {
      label: "Choose file…",
      disabled: props.isUploading || props.isLoading,
      onSelect: () => {
        fileInputRef.current?.click();
      },
    },
  ];

  return (
    <Card className="flex flex-col md:min-h-72">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <FiImage className="size-4 text-muted-foreground" aria-hidden />
            <span>Avatar</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Right-click to choose a file, or drag & drop an image here. JPG, PNG
          or WebP. Max 5MB.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={props.isLoading || props.isUploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            e.currentTarget.value = "";

            await props.onUpload(file);
          }}
        />

        <ContextMenu items={avatarMenuItems}>
          <div
            role="button"
            tabIndex={0}
            aria-disabled={props.isLoading || props.isUploading}
            aria-busy={props.isUploading || undefined}
            className={
              "relative flex flex-1 items-center justify-center rounded-xl border border-dashed border-border bg-surface/5 px-4 py-6 text-center text-sm text-muted-foreground outline-none cursor-pointer" +
              (isDragOver ? " bg-surface/10" : "") +
              (props.isLoading || props.isUploading
                ? " pointer-events-none opacity-60"
                : "")
            }
            onDragEnter={(e) => {
              e.preventDefault();
              if (props.isLoading || props.isUploading) return;
              setIsDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (props.isLoading || props.isUploading) return;
              setIsDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragOver(false);
            }}
            onDrop={async (e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (props.isLoading || props.isUploading) return;

              const file = e.dataTransfer.files?.[0];
              if (!file) return;

              await props.onUpload(file);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            {props.isUploading
              ? "Uploading…"
              : "Drop image here (or right-click)"}
          </div>
        </ContextMenu>
      </CardContent>
    </Card>
  );
}
