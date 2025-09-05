"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/select/Select";

import {
  ExpenseCreateSchema,
  type ExpenseCreate,
  type ExpenseCreateInput,
} from "@/schemas/expense";
import type { Category } from "@/schemas/category";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (dto: ExpenseCreate) => void;
  categories: Category[];
};

export default function AddExpenseDialog({
  open,
  onOpenChange,
  onCreate,
  categories,
}: Props) {
  const makeDefaults = React.useCallback<() => ExpenseCreateInput>(
    () => ({
      categoryId: categories[0]?.id ?? "",
      amount: 0,
      occurredAt: new Date().toISOString().slice(0, 10),
      note: "",
    }),
    [categories]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseCreateInput, any, ExpenseCreate>({
    resolver: zodResolver(ExpenseCreateSchema),
    defaultValues: makeDefaults(),
    mode: "onSubmit",
  });

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
    reset(makeDefaults());
  };

  const onSubmit = (data: ExpenseCreate) => {
    onCreate({
      categoryId: data.categoryId,
      amount: data.amount,
      occurredAt: data.occurredAt,
      note: data.note?.trim() || undefined,
    });
    reset(makeDefaults());
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
          fixed inset-0 bg-black/50 backdrop-blur-[1px]
          data-[state=open]:animate-[dialog-overlay-show_250ms_ease-out]
          data-[state=closed]:animate-[dialog-overlay-hide_250ms_ease-in]
        "
        />
        <Dialog.Content
          className="
          fixed right-0 top-0 h-screen w-screen lg:w-[33vw]
          rounded-none lg:rounded-l-xl
          border-l border-border bg-surface shadow-2xl
          p-4 overflow-y-auto
          data-[state=open]:animate-[drawer-right-in_250ms_ease-out]
          data-[state=closed]:animate-[drawer-right-out_250ms_ease-in]
        "
        >
          <Dialog.Title className="text-lg font-semibold">
            Add expense
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Add expense
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm">Amount</label>
                <input
                  {...register("amount")}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-error">
                    {String(errors.amount.message)}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="mb-1 block text-sm">Category</label>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={categories.map((c) => ({
                        label: c.name,
                        value: c.id,
                      }))}
                    />
                  )}
                />
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-error">
                    {String(errors.categoryId.message)}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-sm">Date</label>
                <input
                  type="date"
                  {...register("occurredAt")}
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none"
                />
                {errors.occurredAt && (
                  <p className="mt-1 text-sm text-error">
                    {String(errors.occurredAt.message)}
                  </p>
                )}
              </div>

              {/* Note */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm">Note (optional)</label>
                <input
                  {...register("note")}
                  placeholder="Comment"
                  className="w-full rounded-xl border border-border bg-surface-2 px-3 py-2 outline-none"
                />
                {errors.note && (
                  <p className="mt-1 text-sm text-error">
                    {String(errors.note.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-1 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" radius="lg">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                variant="primary"
                radius="lg"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
