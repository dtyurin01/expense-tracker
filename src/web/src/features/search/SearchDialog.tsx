"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FiSearch, FiX } from "react-icons/fi";
import { Button } from "@/components/ui/button/Button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (q: string) => void;
  placeholder?: string;
};

export default function SearchDialog({
  open,
  onOpenChange,
  onSubmit,
  placeholder = "Some text here...",
}: Props) {
  const [q, setQ] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(q);
    onOpenChange(false);
    setQ("");
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setQ("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed left-1/2 top-24 w-[min(90vw,720px)] -translate-x-1/2 rounded-2xl border border-border bg-surface px-2 py-1 shadow-xl">
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <Dialog.Description className="sr-only">
            Enter some text
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <FiSearch className=" size-5 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <Button type="submit" size="sm">
              Search
            </Button>
            <Dialog.Close asChild>
              <Button
                type="button"
                aria-label="Close"
                variant="ghost"
                size="icon"
                radius="md"
                className="text-muted-foreground hover:text-foreground w-8 h-10"
              >
                <FiX className="size-4" aria-hidden />
              </Button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
