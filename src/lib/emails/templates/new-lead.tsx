interface NewLeadEmailProps {
  name: string;
  phone: string;
  email?: string | null;
  preferredCountry?: string | null;
  source?: string;
  message?: string | null;
}

export function NewLeadEmail({
  name,
  phone,
  email,
  preferredCountry,
  source,
  message,
}: NewLeadEmailProps) {
  return (
    <div>
      <h1>New Lead Received</h1>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Phone:</strong> {phone}</p>
      <p><strong>Email:</strong> {email ?? "N/A"}</p>
      <p><strong>Country:</strong> {preferredCountry ?? "N/A"}</p>
      <p><strong>Source:</strong> {source ?? "website"}</p>
      {message && <p><strong>Message:</strong> {message}</p>}
    </div>
  );
}
