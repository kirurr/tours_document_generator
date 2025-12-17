import SignInForm from "@/components/SignInForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const { data: session } = await authClient.getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1>Авторизация</h1>
          </CardTitle>
					<CardDescription>
						Войдите в систему с помощью вашего аккаунта.
					</CardDescription>
        </CardHeader>
				<CardContent>
					<SignInForm />
				</CardContent>
      </Card>
    </main>
  );
}
