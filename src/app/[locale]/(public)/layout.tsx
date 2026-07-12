import { getUser } from "@/lib/auth/get-user";
import { toNavbarUser } from "@/lib/auth/nav-user";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getUser();
  const user = authUser ? toNavbarUser(authUser) : null;

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
