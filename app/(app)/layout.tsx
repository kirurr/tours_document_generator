import { AppSidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/signin");

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="grow">{children}</main>
      <Toaster position="top-center" />
			<div id="canvas-container" className="prose">

			</div>
    </div>
  );
}
