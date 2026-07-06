interface ConsultationConfirmationEmailProps {
  studentName: string;
  scheduledAt: string;
  meetingLink?: string;
}

export function ConsultationConfirmationEmail({
  studentName,
  scheduledAt,
  meetingLink,
}: ConsultationConfirmationEmailProps) {
  return (
    <div>
      <h1>Consultation Confirmed</h1>
      <p>Hi {studentName},</p>
      <p>Your consultation has been scheduled for <strong>{scheduledAt}</strong>.</p>
      {meetingLink && (
        <p>
          Join here: <a href={meetingLink}>{meetingLink}</a>
        </p>
      )}
    </div>
  );
}
