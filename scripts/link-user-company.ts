
import { db } from "../src/db";
import { users } from "../src/db/schema/users";
import { companies } from "../src/db/schema/companies";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Linking User to Company...");
    const userEmail = "aamirvns860@gmail.com";

    try {
        // 1. Get User
        const [user] = await db.select().from(users).where(eq(users.email, userEmail));
        if (!user) {
            console.error("User not found:", userEmail);
            return;
        }
        console.log("Found user:", user.email);

        // 2. Get or Create Company
        let [company] = await db.select().from(companies).limit(1);

        if (!company) {
            console.log("No company found. Creating one...");
            [company] = await db.insert(companies).values({
                name: "Test Client Company",
            }).returning();
            console.log("Created company:", company.name);
        } else {
            console.log("Using existing company:", company.name);
        }

        // 3. Update User
        await db.update(users)
            .set({ companyId: company.id })
            .where(eq(users.id, user.id));

        console.log(`Successfully linked user ${user.email} to company ${company.name}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit(0);
    }
}

main();
