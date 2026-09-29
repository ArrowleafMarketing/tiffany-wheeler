"use client";

import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useId, useRef } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { subscribe, type SubscribeState } from "@/lib/leads/actions";
import { markSubscribed } from "@/lib/leads/prompt-state";

/** Keep in sync with HONEYPOT_FIELD in src/lib/leads/actions.ts. */
const HONEYPOT_FIELD = "favorite_color";

export type EmailCaptureFormProps = {
  variant: "section" | "compact";
  /** Light text and controls for dark backgrounds. */
  inverted?: boolean;
  /** Where the signup came from (analytics + list source), e.g. "home", "footer". */
  source: string;
  labels: {
    inputLabel: string;
    placeholder: string;
    button: string;
    /** Names the form for assistive tech when there is no visible heading tied to it. */
    formLabel?: string;
  };
  /** Id of a visible heading that names the form (preferred over `labels.formLabel`). */
  labelledBy?: string;
  /** Shown under the success message (section variant). */
  successFollowUp?: string;
  successCta?: { label: string; href: string };
  /** Called once after a successful signup (e.g. the bottom sheet swaps its buttons). */
  onSuccess?: () => void;
  className?: string;
};

/**
 * Email-only signup island. Uses the `subscribe` Server Action directly with
 * useActionState, so the form also works before hydration (progressive
 * enhancement); the success/lead event fires once per successful submission.
 */
export function EmailCaptureForm({
  variant,
  inverted,
  source,
  labels,
  successFollowUp,
  successCta,
  labelledBy,
  onSuccess,
  className,
}: EmailCaptureFormProps) {
  const [state, formAction, pending] = useActionState(subscribe, null);
  const id = useId();
  const inputId = `${id}-email`;
  const errorId = `${id}-error`;
  const trackedRef = useRef<SubscribeState>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const compact = variant === "compact";

  useEffect(() => {
    // Guard: effects re-run when a hidden route is shown again (Cache Components).
    if (!state?.ok || trackedRef.current === state) return;
    trackedRef.current = state;
    track("generate_lead", { source, form: variant });
    markSubscribed();
    onSuccess?.();
    successRef.current?.focus();
  }, [state, source, variant, onSuccess]);

  if (state?.ok) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cn(
          "outline-none",
          compact ? "flex min-h-12 items-center gap-2" : "rounded-(--radius-card) p-5 sm:p-6",
          !compact && (inverted ? "bg-white/10 ring-1 ring-white/20" : "bg-forest-light"),
          className,
        )}
      >
        <p
          className={cn(
            "flex items-start gap-2 font-semibold",
            compact ? "text-sm" : "text-lg",
            inverted ? "text-white" : "text-ink",
          )}
        >
          <CircleCheck
            aria-hidden
            className={cn("mt-0.5 shrink-0", compact ? "size-4" : "size-5", inverted ? "text-gold" : "text-forest")}
          />
          {state.message}
        </p>
        {!compact && successFollowUp ? (
          <p className={cn("mt-2 pl-7", inverted ? "text-white/80" : "text-body")}>{successFollowUp}</p>
        ) : null}
        {!compact && successCta ? (
          <ButtonLink
            href={successCta.href}
            variant={inverted ? "night" : "primary"}
            className="mt-4 ml-7"
          >
            {successCta.label}
          </ButtonLink>
        ) : null}
      </div>
    );
  }

  const error = state && !state.ok ? state.message : null;

  return (
    <form
      action={formAction}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : labels.formLabel}
      className={cn("relative", className)}
    >
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="variant" value={variant} />

      {/* Honeypot: off-screen and out of the tab order; people never fill it. */}
      <div aria-hidden className="absolute -left-[10000px] top-auto size-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>Leave this field blank</label>
        <input id={`${id}-hp`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <label
        htmlFor={inputId}
        className={cn(
          compact ? "sr-only" : "mb-2 block text-sm font-semibold",
          inverted ? "text-white/90" : "text-ink",
        )}
      >
        {labels.inputLabel}
      </label>
      <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col gap-3 sm:flex-row")}>
        <input
          id={inputId}
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="send"
          placeholder={labels.placeholder}
          defaultValue={state?.email ?? ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "min-w-0 rounded-(--radius-btn) border-2 px-4 text-base transition-colors",
            // Column layout on phones for the section: a flex-1 basis would collapse the height.
            compact ? "h-12 flex-1" : "h-14 w-full sm:w-auto sm:flex-1",
            // Section on a dark band: a solid white field reads best. Compact on
            // a dark footer: a translucent field. Light backgrounds: paper.
            inverted && !compact && "bg-white text-ink placeholder:text-muted focus-visible:outline-gold",
            inverted && compact && "bg-white/10 text-white placeholder:text-white/65 focus-visible:outline-gold",
            !inverted && "bg-paper text-ink placeholder:text-muted",
            // Light backgrounds: the field border needs 3:1 against the page (border-field), not a hairline.
            error
              ? inverted
                ? "border-ember-light"
                : "border-ember"
              : inverted
                ? compact
                  ? "border-white/30"
                  : "border-transparent"
                : "border-field",
          )}
        />
        <Button
          type="submit"
          variant={inverted ? "night" : "primary"}
          size={compact ? "md" : "lg"}
          disabled={pending}
          className={cn("shrink-0", inverted && "focus-visible:outline-gold")}
        >
          {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
          {labels.button}
        </Button>
      </div>
      <p
        id={errorId}
        aria-live="polite"
        className={cn(
          "flex items-start gap-1.5 text-sm font-medium",
          error && (compact ? "mt-1.5" : "mt-2"),
          inverted ? "text-ember-light" : "text-ember-dark",
        )}
      >
        {error ? (
          <>
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </>
        ) : null}
      </p>
    </form>
  );
}
