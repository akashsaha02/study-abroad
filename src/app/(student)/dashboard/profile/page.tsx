import { PageHeader } from "@/components/common/PageHeader";
import { StudentProfileForm } from "@/components/forms/StudentProfileForm";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId } from "@/lib/services/students";

export default async function StudentProfilePage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Manage your personal and education information."
      />
      <StudentProfileForm
        profile={user?.profile ?? null}
        student={student}
      />
    </div>
  );
}
