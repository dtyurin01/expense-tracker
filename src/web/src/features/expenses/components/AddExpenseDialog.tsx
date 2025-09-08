"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button/Button";
import { Select, SelectItem } from "@/components/ui/select/Select";
import { Input } from "@/components/ui/input/Input";

import {
  ExpenseCreateSchema,
  type ExpenseCreate,
  type ExpenseCreateInput,
} from "@/schemas/expense";
import type { Category } from "@/schemas/category";
import { toLocalISO } from "@/lib/date-io";
import { DatePicker } from "@/components/ui/date/DatePicker";
import { FiPlusCircle } from "react-icons/fi";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (dto: ExpenseCreate) => void;
  categories: ReadonlyArray<Category> | (() => ReadonlyArray<Category>);
};

export default function AddExpenseDialog(props: Props) {
  const { open, onOpenChange, onCreate, categories } = props;

  const categoriesRef = React.useRef<ReadonlyArray<Category>>(
    typeof categories === "function" ? categories() : categories
  );
  const cats = categoriesRef.current;

  const makeDefaults = React.useCallback(
    (): ExpenseCreateInput => ({
      categoryId: cats[0]?.id ?? "",
      amount: 0,
      occurredAt: toLocalISO(new Date()),
      note: "",
    }),
    [cats]
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
            <div className="flex items-center gap-2">
              <FiPlusCircle className="size-5" aria-hidden />
              <span>Add expense</span>
            </div>
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Add expense
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-3 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Amount */}
              <div>
                <Input
                  label="Amount"
                  placeholder="0.00"
                  inputMode="decimal"
                  {...register("amount", { valueAsNumber: true })}
                  block
                  size="md"
                  radius="lg"
                  status={errors.amount ? "error" : "default"}
                  errorText={
                    errors.amount ? String(errors.amount.message) : undefined
                  }
                />
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
                      block
                      onValueChange={field.onChange}
                      placeholder="Choose a category"
                    >
                      {cats.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-error">
                    {String(errors.categoryId.message)}
                  </p>
                )}
              </div>

              {/* Date */}
              <div className="col-span-full sm:col-span-2">
                <Controller
                  name="occurredAt"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      min="2020-01-01"
                      ui={{
                        size: "md",
                        radius: "lg",
                        tone: errors.occurredAt ? "destructive" : "brand",
                      }}
                      className={
                        errors.occurredAt ? "ring-1 ring-destructive/40" : ""
                      }
                    ></DatePicker>
                  )}
                ></Controller>
              </div>

              {/* Note */}
              <div className="sm:col-span-2">
                <Input
                  label="Note (optional)"
                  placeholder="Comment"
                  {...register("note")}
                  block
                  size="md"
                  radius="lg"
                  status={errors.note ? "error" : "default"}
                  errorText={
                    errors.note ? String(errors.note.message) : undefined
                  }
                />
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
