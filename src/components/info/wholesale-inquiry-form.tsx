"use client";

import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { WholesaleFormCopy } from "@/content/info";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { submitWholesaleInquiry, type WholesaleField, type WholesaleState } from "@/lib/contact/actions";
import { FormField } from "./form-field";
import { RichText } from "./rich-text";

/** Keep in sync with HONEYPOT_FIELD in src/lib/contact/actions.ts. */
const HONEYPOT_FIELD = "company_website";
const FIELD_ORDER: WholesaleField[] = ["business", "name", "email", "phone", "permit", "message"];

type Props = {
  copy: WholesaleFormCopy;
  className?: string;
};

/**
 * Wholesale application for stores (business, contact, email, phone, resale
 * permit number, message; no file upload). Client island around the
 * `submitWholesaleInquiry` Server Action; fires `generate_lead` once per
 * successful submission.
 */
export function WholesaleInquiryForm({ copy, className }: Props) {
  const [state, formAction, pending] = useActionState(submitWholesaleInquiry, null);
  const [dismissed, setDismissed] = useState<WholesaleState>(null);
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const handledRef = useRef<WholesaleState>(null);

  useEffect(() => {
    // Guard: effects re-run when a hidden route is shown again (Cache Components).
    if (!state || handledRef.current === state) return;
    handledRef.current = state;
    if (state.ok) {
      track("generate_lead", { form: "wholesale", source: "bulk-orders" });
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
  const id = (name: WholesaleField) => `${uid}-${name}`;

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
          id={id("business")}
          name="business"
          label={copy.business.label}
          required
          autoComplete="organization"
          maxLength={120}
          defaultValue={values.business}
          error={errors.business}
          className="sm:col-span-2"
        />
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
          id={id("phone")}
          name="phone"
          type="tel"
          label={copy.phone.label}
          required
          autoComplete="tel"
          inputMode="tel"
          maxLength={25}
          defaultValue={values.phone}
          error={errors.phone}
        />
        <FormField
          id={id("permit")}
          name="permit"
          label={copy.permit.label}
          hint={copy.permit.hint}
          required
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={40}
          defaultValue={values.permit}
          error={errors.permit}
        />
        <FormField
          as="textarea"
          id={id("message")}
          name="message"
          label={copy.message.label}
          optionalLabel={copy.optional}
          placeholder={copy.message.placeholder}
          rows={4}
          maxLength={5000}
          defaultValue={values.message}
          error={errors.message}
          className="sm:col-span-2"
        />

        <div className="flex flex-col gap-3 sm:col-span-2">
          <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto sm:self-start">
            {pending ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
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
