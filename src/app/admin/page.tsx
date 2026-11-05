import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export const runtime = "nodejs";

export default async function AdminPage() {
  const isAdmin = await verifyAdminSession();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}