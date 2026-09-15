import { z } from "zod";

/**
 * What the contact form accepts. The caps are generous for a person and
 * tight for a script: a name fits on one line, a message fits in an inbox,
 * and the reply address has to be one Resend can set as Reply-To.
 */
export const contactSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  message: z.string().trim().min(1).max(5000),
  name: z.string().trim().min(1).max(120),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function parseContact(formData: FormData): ContactInput | null {
  const result = contactSchema.safeParse({
    email: formData.get("email"),
    message: formData.get("message"),
    name: formData.get("name"),
  });
  return result.success ? result.data : null;
}
