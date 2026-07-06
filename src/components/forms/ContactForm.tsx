"use client";

import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { POPULAR_COUNTRIES } from "@/constants";
import { useState } from "react";
import { toast } from "sonner";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact_form" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Message sent! We'll contact you soon.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Full Name" htmlFor="name" required>
        <Input id="name" name="name" required />
      </FormField>
      <FormField label="Phone" htmlFor="phone" required>
        <Input id="phone" name="phone" type="tel" required />
      </FormField>
      <FormField label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" />
      </FormField>
      <FormField label="Preferred Country" htmlFor="preferred_country">
        <select
          id="preferred_country"
          name="preferred_country"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="">Select country</option>
          {POPULAR_COUNTRIES.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Message" htmlFor="message">
        <Textarea id="message" name="message" rows={4} />
      </FormField>
      <SubmitButton loading={loading} className="w-full">
        Send Message
      </SubmitButton>
    </form>
  );
}
