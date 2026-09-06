/** Disambiguates students → profiles embed (profile_id vs assigned_counselor_id). */
export const STUDENT_PROFILE_EMBED = "profiles!students_profile_id_fkey";

export const STUDENTS_WITH_PROFILE =
  `*, ${STUDENT_PROFILE_EMBED}(full_name, email, phone)` as const;

export const STUDENTS_WITH_PROFILE_BASIC =
  `*, ${STUDENT_PROFILE_EMBED}(full_name, email)` as const;

export const STUDENTS_WITH_PROFILE_DETAIL =
  `*, ${STUDENT_PROFILE_EMBED}(full_name, email, phone, id)` as const;

export const DOCUMENTS_WITH_STUDENT =
  `*, students(id, ${STUDENT_PROFILE_EMBED}(full_name))` as const;

export const APPLICATIONS_WITH_STUDENT =
  `*, students(${STUDENT_PROFILE_EMBED}(full_name)), universities(name), countries(name)` as const;

export const APPLICATION_DETAIL_SELECT =
  `*, students(${STUDENT_PROFILE_EMBED}(full_name, email)), universities(name), countries(name), courses(title)` as const;

export const APPLICATIONS_COUNSELOR_SELECT =
  `*, students(${STUDENT_PROFILE_EMBED}(full_name)), universities(name)` as const;

export const CONSULTATIONS_LIST_SELECT =
  `*, leads(name), students(${STUDENT_PROFILE_EMBED}(full_name)), counselors:profiles!consultations_counselor_id_fkey(full_name)` as const;

export const STUDENTS_ID_EMAIL_SELECT =
  `id, ${STUDENT_PROFILE_EMBED}(full_name, email)` as const;

export const DOCUMENT_WITH_STUDENT_EMAIL =
  `*, students(${STUDENT_PROFILE_EMBED}(email))` as const;

export const APPLICATION_WITH_STUDENT_EMAIL =
  `*, students(${STUDENT_PROFILE_EMBED}(email))` as const;
