import { ChevronDown, CircleAlert } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Common = {
  /** Unique element id (use useId()). Hint and error ids derive from it. */
  id: string;
  name: string;
  label: string;
  /** Rendered after the label on optional fields, e.g. "(optional)". */
  optionalLabel?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

type InputFieldProps = Common & {
  as?: "input";
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoCapitalize?: string;
  spellCheck?: boolean;
};

type TextareaFieldProps = Common & { as: "textarea"; rows?: number };

type SelectFieldProps = Common & {
  as: "select";
  options: readonly { value: string; label: string }[];
};

export type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const control =
  "w-full rounded-(--radius-btn) border-2 bg-paper px-4 text-base text-ink transition-colors placeholder:text-muted";

/**
 * Labelled form control (input, textarea or select) with an optional hint and
 * an inline error wired up through aria-describedby / aria-invalid. Plain
 * component: it renders inside the client form islands.
 */
export function FormField(props: FormFieldProps) {
  const { id, name, label, optionalLabel, required, hint, error, defaultValue, placeholder, maxLength, className } =
    props;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  // border-field is ≥3:1 on paper and cream-deep (WCAG 1.4.11 non-text contrast).
  const border = error ? "border-ember" : "border-field hover:border-ink/70";
  const shared = {
    id,
    name,
    required,
    defaultValue: defaultValue ?? "",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  } as const;

  let input: ReactNode;
  if (props.as === "textarea") {
    input = (
      <textarea
        {...shared}
        rows={props.rows ?? 6}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(control, border, "min-h-36 py-3 leading-relaxed")}
      />
    );
  } else if (props.as === "select") {
    input = (
      <div className="relative">
        <select {...shared} className={cn(control, border, "h-12 appearance-none pr-11")}>
          <option value="" disabled>
            {placeholder}
          </option>
          {props.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
      </div>
    );
  } else {
    input = (
      <input
        {...shared}
        type={props.type ?? "text"}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        autoCapitalize={props.autoCapitalize}
        spellCheck={props.spellCheck}
        className={cn(control, border, "h-12")}
      />
    );
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {!required && optionalLabel ? (
          <>
            {" "}
            <span className="font-normal text-muted">{optionalLabel}</span>
          </>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="-mt-0.5 mb-1.5 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {input}
      {error ? (
        <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-ember-dark">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
