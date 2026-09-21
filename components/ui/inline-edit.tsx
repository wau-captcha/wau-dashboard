"use client";

import { Check, X } from "lucide-react";
import { useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Field } from "./field";
import { useUIText } from "./locale";
import { TextInput } from "./text-input";

export type InlineEditProps = {
  /** The stored value: editing starts from it, and cancelling returns to it. */
  value: string;
  /** Receives the edited value; the field stays disabled while it runs. */
  onSave: (value: string) => void | Promise<void>;
  label?: ReactNode;
  /** Helper text under the input. */
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  /** Before the value inside the input, e.g. "$" or an icon. */
  startAdornment?: ReactNode;
  maxLength?: number;
  disabled?: boolean;
  /** Spoken name of the input when there is no label. */
  "aria-label"?: string;
  className?: string;
};

/**
 * A value edited in place. Save and cancel only appear once the text differs from the
 * stored value; Enter saves and Escape cancels.
 */
export function InlineEdit({
  value,
  onSave,
  label,
  description,
  error,
  placeholder,
  startAdornment,
  maxLength,
  disabled,
  className,
  "aria-label": ariaLabel,
}: InlineEditProps) {
  const text = useUIText().inlineEdit;
  const [draft, setDraft] = useState(value);
  const [stored, setStored] = useState(value);
  const [saving, setSaving] = useState(false);
  // A value saved here, or changed elsewhere, becomes the one to edit from.
  if (stored !== value) {
    setStored(value);
    setDraft(value);
  }
  const changed = draft !== value;

  async function save() {
    if (!changed || saving) return;
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      void save();
    }
    if (event.key === "Escape") setDraft(value);
  }

  return (
    <Field label={label} description={description} error={error} className={cn("min-w-0", className)}>
      <div data-slot="inline-edit" className="flex items-center gap-2">
        <TextInput
          value={draft}
          onValueChange={setDraft}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          startAdornment={startAdornment}
          maxLength={maxLength}
          disabled={disabled || saving}
          aria-label={ariaLabel}
          className="min-w-0 flex-1"
        />
        {changed && (
          <>
            <Button type="button" variant="ghost" size="icon" aria-label={text.cancel} disabled={saving} onClick={() => setDraft(value)}>
              <X />
            </Button>
            <Button type="button" size="icon" aria-label={text.save} loading={saving} onClick={() => void save()}>
              <Check />
            </Button>
          </>
        )}
      </div>
    </Field>
  );
}
