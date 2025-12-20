import { authClient } from "./lib/auth-client";
import { db } from "./database/drizzle";
import { customFieldTable, user } from "./database/schema";
import { eq } from "drizzle-orm";
import { CustomField } from "./custom-fields/schema";

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

  console.log("Done");

  const customFields: CustomField[] = [
    {
      id: 1,
      name: "tourists",
      displayName: "Туристы",
      description: "Список туристов",
      type: "multiple",
    },
		{
    id: 2,
    name: "name",
    displayName: "Имя",
    description: "Полное имя туриста",
    type: "single",
  },
  {
    id: 3,
    name: "age",
    displayName: "Возраст",
    description: "Возраст туриста",
    type: "single",
  },
  {
    id: 4,
    name: "email",
    displayName: "Email",
    description: "Электронная почта туриста",
    type: "single",
  },
  {
    id: 5,
    name: "phone",
    displayName: "Телефон",
    description: "Контактный номер телефона туриста",
    type: "single",
  },
  {
    id: 6,
    name: "dateOfBirth",
    displayName: "Дата рождения",
    description: "Дата рождения туриста",
    type: "single",
  },
  {
    id: 7,
    name: "passport",
    displayName: "Паспорт",
    description: "Номер паспорта туриста",
    type: "single",
  },
  ];

	console.log('Inserting custom fields');
  const inserted = await db.insert(customFieldTable).values(customFields).onConflictDoNothing();
	console.log(inserted);
	console.log('Completed');

  process.exit(0);
}

main();
