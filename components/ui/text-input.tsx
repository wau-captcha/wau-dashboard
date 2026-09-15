"use client";

import { Input } from "@base-ui/react/input";
import { Eye, EyeOff, X } from "lucide-react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  controlAdornment,
  controlBox,
  controlHeight,
  controlIconButton,
  controlInput,
  type ControlSize,
} from "./control";

export type TextInputProps = Omit<Input.Props, "className" | "size"> & {
  size?: ControlSize;
  /** Icon or text before the value, e.g. <Search /> or "https://". */
  startAdornment?: ReactNode;
  /** Icon or text after the value, e.g. a unit. */
  endAdornment?: ReactNode;
  /** Shows a clear button while the input has a value. */
  clearable?: boolean;
  onClear?: () => void;
  /** Marks the input invalid when it is not inside a Field with an error. */
  invalid?: boolean;
  /** Classes for the outer box (width, margins). */
  className?: string;
  /** Classes for the inner <input>. */
  inputClassName?: string;
};

/**
 * Single-line text input. `type="password"` adds a show/hide toggle.
 * Accepts every native input prop; use `onValueChange(value)` or `onChange(event)`.
 */
export function TextInput({
  size = "md",
  type = "text",
  startAdornment,
  endAdornment,
  clearable,
  onClear,
  invalid,
  className,
  inputClassName,
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  ...props
}: TextInputProps) {
  const [revealed, setRevealed] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(() => String(defaultValue ?? ""));
  const currentValue = value !== undefined ? String(value) : uncontrolledValue;
  const isPassword = type === "password";
  const showClear = clearable && !disabled && !readOnly && currentValue.length > 0;

  function clear(event: MouseEvent<HTMLButtonElement>) {
    const input = event.currentTarget.parentElement?.querySelector("input");
    if (!input) return;
    // Use the native setter so React and Base UI receive a real input event.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
    onClear?.();
  }

  return (
    <div data-slot="text-input" className={cn(controlBox, controlHeight[size], className)}>
      {startAdornment && <span className={cn(controlAdornment, "pl-3")}>{startAdornment}</span>}
      <Input
        type={isPassword && revealed ? "text" : type}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next, details) => {
          if (value === undefined) setUncontrolledValue(next);
          onValueChange?.(next, details);
        }}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        className={cn(
          controlInput,
          startAdornment && "pl-2",
          (endAdornment || showClear || isPassword) && "pr-1.5",
          inputClassName,
        )}
        {...props}
      />
      {showClear && (
        <button
          type="button"
          aria-label="Xóa nội dung"
          onMouseDown={(event) => event.preventDefault()}
          onClick={clear}
          className={cn(controlIconButton, !isPassword && !endAdornment && "mr-2")}
        >
          <X className="size-3.5" />
        </button>
      )}
      {isPassword && (
        <button
          type="button"
          aria-label={revealed ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={revealed}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setRevealed((shown) => !shown)}
          className={cn(controlIconButton, !endAdornment && "mr-2")}
        >
          {revealed ? <EyeOff /> : <Eye />}
        </button>
      )}
      {endAdornment && <span className={cn(controlAdornment, "pl-1.5 pr-3")}>{endAdornment}</span>}
    </div>
  );
}
