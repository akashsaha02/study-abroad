import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function StudentSettingsPage() {
  redirect(ROUTES.dashboardProfile);
}
