import { authClient } from "./lib/auth-client";
import { db } from "./database/drizzle";

async function main() {
	console.log("Seeding admin user");
  const user = await authClient.signUp.email({
    email: "admin@example.com",
    password: "12345678",
    name: "Admin",
  });
	console.log(user);
	console.log("Completed");
}

main();
