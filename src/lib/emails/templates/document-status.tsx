interface DocumentStatusEmailProps {
  documentType: string;
  status: string;
  note?: string;
}

export function DocumentStatusEmail({
  documentType,
  status,
  note,
}: DocumentStatusEmailProps) {
  return (
    <div>
      <h1>Document Status Update</h1>
      <p>
        Your <strong>{documentType}</strong> has been <strong>{status}</strong>.
      </p>
      {note && <p><strong>Note:</strong> {note}</p>}
    </div>
  );
}
