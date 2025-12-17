import { authClient } from "./lib/auth-client";
import { db } from "./database/drizzle";
import { user } from "./database/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding admin user");
  const insertedUser = await authClient.signUp.email({
    email: "admin@example.com",
    password: "12345678",
    name: "Admin",
  });
  console.log(insertedUser);
  console.log("Completed");

	console.log("Updating admin user");
  await db
    .update(user)
    .set({ isAdmin: true })
    .where(eq(user.email, "admin@example.com"));
	console.log("Completed");

	console.log("Done")
	process.exit(0);
}

main();
