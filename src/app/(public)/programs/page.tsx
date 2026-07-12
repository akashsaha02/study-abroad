import { redirect } from "next/navigation";

/** Programs merged into /courses — keep this route as a permanent redirect. */
export default function ProgramsPage() {
  redirect("/courses");
}
