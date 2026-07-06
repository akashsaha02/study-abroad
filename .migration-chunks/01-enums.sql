-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum (
  'student',
  'counselor',
  'admin',
  'super_admin'
);

create type lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'not_qualified',
  'converted_to_student',
  'lost'
);

create type application_status as enum (
  'profile_review',
  'documents_pending',
  'university_shortlisting',
  'application_submitted',
  'offer_received',
  'tuition_payment',
  'visa_documents',
  'visa_submitted',
  'visa_approved',
  'pre_departure',
  'completed',
  'rejected'
);

create type document_status as enum (
  'pending_review',
  'approved',
  'rejected',
  'needs_update'
);

create type consultation_status as enum (
  'requested',
  'scheduled',
  'completed',
  'cancelled'
);
