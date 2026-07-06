import { signOut } from "@/lib/auth/actions";

export async function POST() {
  await signOut();
}
