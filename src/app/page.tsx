import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const role = session.user.role;

  if (role === "admin") {
    redirect("/admin");
  }

  if (role === "customer") {
    redirect("/customer");
  }

  redirect("/auth/login");
}