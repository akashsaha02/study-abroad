import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { DocumentVault } from "@/components/dashboard/DocumentVault";
import { EmptyState } from "@/components/common/EmptyState";
import { emptyStateIcons } from "@/constants/empty-state-icons";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId, getStudentDocuments } from "@/lib/services/students";
import type { Document } from "@/types";

export default async function StudentDocumentsPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const documents = student ? await getStudentDocuments(student.id) : [];

  return (
    <PageStack>
      <PageHeader
        compact
        title="Document Vault"
        description="Securely upload and track passports, transcripts, LORs, and more."
      />
      {student ? (
        <DocumentVault
          studentId={student.id}
          documents={documents as Document[]}
        />
      ) : (
        <EmptyState
          title="Complete your profile first"
          description="Your document vault unlocks once your student profile is set up."
          icon={emptyStateIcons.documents}
        />
      )}
    </PageStack>
  );
}
