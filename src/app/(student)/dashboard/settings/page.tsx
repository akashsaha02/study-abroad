import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { signOut } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Account and password settings." />
      <Card>
        <CardContent className="space-y-4 p-6">
          <h3 className="font-semibold">Account</h3>
          <p className="text-sm text-muted-foreground">
            To change your password, use the forgot password flow from the login page.
          </p>
          <form action={signOut}>
            <Button type="submit" variant="destructive">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
