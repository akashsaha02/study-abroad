interface ApplicationStatusEmailProps {
  status: string;
  note?: string;
}

export function ApplicationStatusEmail({ status, note }: ApplicationStatusEmailProps) {
  const label = status.replace(/_/g, " ");
  return (
    <div>
      <h1>Application Status Update</h1>
      <p>
        Your application status has been updated to <strong>{label}</strong>.
      </p>
      {note && <p><strong>Note:</strong> {note}</p>}
    </div>
  );
}
