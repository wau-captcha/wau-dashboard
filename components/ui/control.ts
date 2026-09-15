/**
 * Class names shared by every form control so inputs, selects and pickers line up exactly.
 * See DESIGN.md › Form controls.
 */

export type ControlSize = "sm" | "md";

/** Height per size. `md` (40px) for forms, `sm` (32px) for toolbars and filters. */
export const controlHeight: Record<ControlSize, string> = {
  sm: "h-8",
  md: "h-10",
};

/**
 * A box that wraps a native input plus adornments.
 * Focus, invalid and disabled states are read from the element inside.
 */
export const controlBox =
  "flex w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-input-bg text-body text-foreground " +
  "transition-[border-color,box-shadow] duration-150 " +
  "focus-within:border-focus-border focus-within:shadow-focus " +
  "has-[[data-invalid]]:border-error-border has-[[aria-invalid=true]]:border-error-border " +
  "has-[[data-invalid]]:focus-within:shadow-error has-[[aria-invalid=true]]:focus-within:shadow-error " +
  "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";

/** A button that looks like an input (select, combobox and date triggers). */
export const controlTrigger =
  "flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-md border border-input bg-input-bg px-3 text-left text-body text-foreground " +
  "outline-none transition-[border-color,box-shadow,background-color] duration-150 select-none " +
  "hover:bg-muted/30 focus-visible:border-focus-border focus-visible:shadow-focus " +
  "data-[popup-open]:border-focus-border " +
  "data-[invalid]:border-error-border aria-[invalid=true]:border-error-border " +
  "data-[invalid]:focus-visible:shadow-error aria-[invalid=true]:focus-visible:shadow-error " +
  "disabled:cursor-not-allowed disabled:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50";

/** The bare input that sits inside `controlBox`. */
export const controlInput =
  "h-full w-full min-w-0 flex-1 bg-transparent px-3 text-body text-foreground outline-none " +
  "placeholder:text-muted-foreground/50 disabled:cursor-not-allowed pointer-coarse:text-base";

/** Small icon button placed inside a control, e.g. clear, reveal password, open calendar. */
export const controlIconButton =
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none " +
  "transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus " +
  "disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4";

/** Icon or text shown before/after the input, e.g. a search icon or a unit. */
export const controlAdornment =
  "flex h-full shrink-0 items-center text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4";

/** Floating panel used by selects, comboboxes, menus and popovers. */
export const popupSurface =
  "rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none";

/** Open/close transition for anchored popups. */
export const popupMotion =
  "origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-smooth-out " +
  "data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 " +
  "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-100";

/** A selectable row inside a popup list. */
export const popupItem =
  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body font-medium text-foreground outline-none " +
  "transition-colors data-[highlighted]:bg-card-hover data-[highlighted]:text-accent-foreground " +
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
