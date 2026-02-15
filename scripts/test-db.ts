
import { db } from "../src/db";
import { leads } from "../src/db/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("DATABASE_URL start:", process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + "..." : "undefined");

async function main() {
    console.log("Testing DB Connection...");
    try {
        const result = await db.select().from(leads).limit(1);
        console.log("DB Connection Success. Found leads:", result.length);

        console.log("Attempting insertion...");
        const [inserted] = await db.insert(leads).values({
            email: "test-" + Date.now() + "@example.com",
            firstName: "Test",
            lastName: "User",
            source: "test_script",
            status: "new",
            score: 10
        }).returning();
        console.log("Insertion Success:", inserted.id);

        console.log("Cleaning up...");
        await db.delete(leads).where(eq(leads.id, inserted.id));
        console.log("Cleanup Success");

    } catch (error) {
        console.error("DB Error:", error);
    } finally {
        process.exit(0);
    }
}

main();
