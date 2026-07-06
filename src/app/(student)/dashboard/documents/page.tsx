import { PageHeader } from "@/components/common/PageHeader";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth/get-user";
import { getStudentByProfileId, getStudentDocuments } from "@/lib/services/students";

export default async function StudentDocumentsPage() {
  const user = await getUser();
  const student = user ? await getStudentByProfileId(user.id) : null;
  const documents = student ? await getStudentDocuments(student.id) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Upload and manage your application documents." />
      {student && <DocumentUpload studentId={student.id} />}
      {documents.length === 0 ? (
        <EmptyState title="No documents uploaded" description="Upload your first document above." />
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{doc.document_type}</p>
                  <p className="text-sm text-muted-foreground">{doc.file_name}</p>
                  {doc.review_note && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Note: {doc.review_note}
                    </p>
                  )}
                </div>
                <StatusBadge status={doc.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
