"use client";

import { AdminListPanel, type AdminListPanelProps } from "@/components/admin/AdminListPanel";
import { BlogForm } from "@/features/content/admin/BlogForm";
import { CounselorForm } from "@/components/admin/forms/CounselorForm";
import { CountryForm } from "@/features/catalog/admin/CountryForm";
import { CourseForm } from "@/features/catalog/admin/CourseForm";
import { FaqForm } from "@/features/content/admin/FaqForm";
import { ScholarshipForm } from "@/features/catalog/admin/ScholarshipForm";
import { TestimonialForm } from "@/features/content/admin/TestimonialForm";
import { ServiceForm } from "@/features/content/admin/ServiceForm";
import { UniversityForm } from "@/features/catalog/admin/UniversityForm";
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
