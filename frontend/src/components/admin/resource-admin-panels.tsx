"use client";

import { AdminListPanel, type AdminListPanelProps } from "@/components/admin/AdminListPanel";
import { BlogForm } from "@/components/admin/forms/BlogForm";
import { CounselorForm } from "@/components/admin/forms/CounselorForm";
import { CountryForm } from "@/components/admin/forms/CountryForm";
import { CourseForm } from "@/components/admin/forms/CourseForm";
import { FaqForm } from "@/components/admin/forms/FaqForm";
import { ScholarshipForm } from "@/components/admin/forms/ScholarshipForm";
import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { UniversityForm } from "@/components/admin/forms/UniversityForm";
import type {
  BlogPost,
  Counselor,
  Country,
  Course,
  Faq,
  Scholarship,
  Service,
  Testimonial,
  University,
} from "@/types";

type ListPanelProps<T extends { id: string }> = Omit<AdminListPanelProps<T>, "renderForm">;

interface ProfileOption {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface CountryOption {
  id: string;
  name: string;
}

interface UniversityOption {
  id: string;
  name: string;
  country_id?: string;
}

export function CountriesAdminPanel(props: ListPanelProps<Country>) {
  return (
    <AdminListPanel
      {...props}
      renderForm={(formProps) => <CountryForm {...formProps} />}
    />
  );
}

export function UniversitiesAdminPanel(
  props: ListPanelProps<University> & { countries: CountryOption[] }
) {
  const { countries, ...panelProps } = props;
  return (
    <AdminListPanel
      {...panelProps}
      renderForm={(formProps) => <UniversityForm {...formProps} countries={countries} />}
    />
  );
}

export function CoursesAdminPanel(
  props: ListPanelProps<Course> & { universities: CountryOption[] }
) {
  const { universities, ...panelProps } = props;
  return (
    <AdminListPanel
      {...panelProps}
      renderForm={(formProps) => <CourseForm {...formProps} universities={universities} />}
    />
  );
}

export function ScholarshipsAdminPanel(
  props: ListPanelProps<Scholarship> & {
    universities: CountryOption[];
    countries: CountryOption[];
  }
) {
  const { universities, countries, ...panelProps } = props;
  return (
    <AdminListPanel
      {...panelProps}
      renderForm={(formProps) => (
        <ScholarshipForm {...formProps} universities={universities} countries={countries} />
      )}
    />
  );
}

export function BlogAdminPanel(props: ListPanelProps<BlogPost>) {
  return (
    <AdminListPanel {...props} renderForm={(formProps) => <BlogForm {...formProps} />} />
  );
}

export function FaqsAdminPanel(
  props: ListPanelProps<Faq> & { countries: CountryOption[] }
) {
  const { countries, ...panelProps } = props;
  return (
    <AdminListPanel
      {...panelProps}
      renderForm={(formProps) => <FaqForm {...formProps} countries={countries} />}
    />
  );
}

export function TestimonialsAdminPanel(
  props: ListPanelProps<Testimonial> & {
    countries: CountryOption[];
    universities: UniversityOption[];
  }
) {
  const { countries, universities, ...panelProps } = props;
  return (
    <AdminListPanel
      {...panelProps}
      renderForm={(formProps) => (
        <TestimonialForm {...formProps} countries={countries} universities={universities} />
      )}
    />
  );
}

export function ServicesAdminPanel(props: ListPanelProps<Service>) {
  return (
    <AdminListPanel
      {...props}
      renderForm={(formProps) => <ServiceForm {...formProps} />}
    />
  );
}

export function CounselorsAdminPanel(
  props: ListPanelProps<Counselor> & {
    counselorProfiles: ProfileOption[];
    availableProfiles: ProfileOption[];
  }
) {
  const { counselorProfiles, availableProfiles, ...panelProps } = props;
  return (
    <AdminListPanel
      {...panelProps}
      renderForm={(formProps) => {
        const profileOptions = formProps.initial
          ? counselorProfiles.filter((p) => p.id === formProps.initial!.profile_id)
          : availableProfiles;
        return <CounselorForm {...formProps} profileOptions={profileOptions} />;
      }}
    />
  );
}
