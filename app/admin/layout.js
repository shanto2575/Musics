import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Admin layout session check failed:", error);
  }

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/discover");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="pb-28 lg:pl-64">
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
