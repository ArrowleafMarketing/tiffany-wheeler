"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ContactFormCopy } from "@/content/info";
import { cn } from "@/lib/cn";
import { sendContactMessage, type ContactField, type ContactState } from "@/lib/contact/actions";
import { FormField } from "./form-field";
import { RichText } from "./rich-text";

/** Keep in sync with HONEYPOT_FIELD in src/lib/contact/actions.ts. */
const HONEYPOT_FIELD = "company_website";
const FIELD_ORDER: ContactField[] = ["name", "email", "topic", "order", "message"];

type Props = {
  copy: ContactFormCopy;
  topics: readonly { value: string; label: string }[];
  className?: string;
};

/**
 * "Send Tiffany a message" form. A small client island around the
 * `sendContactMessage` Server Action (useActionState), so it also works before
 * hydration. Errors are shown inline and focus moves to the first invalid field.
 */
export function ContactForm({ copy, topics, className }: Props) {
  const [state, formAction, pending] = useActionState(sendContactMessage, null);
  const [dismissed, setDismissed] = useState<ContactState>(null);
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const handledRef = useRef<ContactState>(null);

  useEffect(() => {
    // Guard: effects re-run when a hidden route is shown again (Cache Components).
    if (!state || handledRef.current === state) return;
    handledRef.current = state;
    if (state.ok) {
      successRef.current?.focus();
      return;
    }
    const first = FIELD_ORDER.find((f) => state.fieldErrors?.[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  if (state?.ok && dismissed !== state) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cn("rounded-(--radius-card) bg-forest-light p-5 outline-none sm:p-6", className)}
      >
        <p className="flex items-start gap-2 font-display text-xl font-semibold leading-snug text-ink">
          <CircleCheck aria-hidden className="mt-1 size-5 shrink-0 text-forest" />
          {state.message}
        </p>
        {state.detail ? <p className="mt-2 pl-7 text-body">{state.detail}</p> : null}
        <button
          type="button"
          onClick={() => setDismissed(state)}
          className="ml-7 mt-3 inline-flex min-h-11 items-center font-semibold text-periwinkle-text underline underline-offset-4 hover:text-ink"
        >
          {copy.another}
        </button>
      </div>
    );
  }

  const failed = state && !state.ok ? state : null;
  const errors = failed?.fieldErrors ?? {};
  const values = failed?.values ?? {};
  const id = (name: ContactField) => `${uid}-${name}`;

  return (
    <div className={className}>
      <div aria-live="polite">
        {failed ? (
          <p className="mb-5 flex items-start gap-2 rounded-(--radius-btn) bg-ember-light px-4 py-3 text-sm font-semibold text-ember-dark">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {failed.message}
          </p>
        ) : null}
      </div>

      {/* Remount with the echoed values after an error, so every field (the select too) keeps them. */}
      <form
        key={failed ? JSON.stringify(values) : "fresh"}
        ref={formRef}
        action={formAction}
        noValidate
        aria-label={copy.formLabel}
        className="relative grid gap-5 sm:grid-cols-2"
      >
        {/* Honeypot: off-screen and out of the tab order; people never fill it. */}
        <div aria-hidden className="absolute -left-[10000px] top-auto size-px overflow-hidden">
          <label htmlFor={`${uid}-hp`}>Leave this field blank</label>
          <input id={`${uid}-hp`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <FormField
          id={id("name")}
          name="name"
          label={copy.name.label}
          required
          autoComplete="name"
          maxLength={100}
          defaultValue={values.name}
          error={errors.name}
        />
        <FormField
          id={id("email")}
          name="email"
          type="email"
          label={copy.email.label}
          placeholder={copy.email.placeholder}
          required
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          defaultValue={values.email}
          error={errors.email}
        />
        <FormField
          as="select"
          id={id("topic")}
          name="topic"
          label={copy.topic.label}
          placeholder={copy.topic.placeholder}
          options={topics}
          required
          defaultValue={values.topic}
          error={errors.topic}
        />
        <FormField
          id={id("order")}
          name="order"
          label={copy.order.label}
          optionalLabel={copy.optional}
          hint={copy.order.hint}
          autoComplete="off"
          maxLength={40}
          defaultValue={values.order}
          error={errors.order}
        />
        <FormField
          as="textarea"
          id={id("message")}
          name="message"
          label={copy.message.label}
          placeholder={copy.message.placeholder}
          required
          maxLength={5000}
          defaultValue={values.message}
          error={errors.message}
          className="sm:col-span-2"
        />

        <div className="flex flex-col gap-3 sm:col-span-2">
          <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
            {pending ? (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden className="size-4" />
            )}
            {copy.submit}
          </Button>
          <p className="text-sm text-muted">
            <RichText text={copy.privacy} />
          </p>
        </div>
      </form>
    </div>
  );
}
