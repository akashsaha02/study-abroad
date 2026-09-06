import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function StudentWritePage() {
  redirect(ROUTES.dashboard);
}
