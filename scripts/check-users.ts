
import { db } from "../src/db";
import { users } from "../src/db/schema/users";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function main() {
    console.log("Checking Users...");
    try {
        const allUsers = await db.select().from(users);
        console.log("Found users:", allUsers.length);
        allUsers.forEach(u => {
            console.log(`User: ${u.email}, Role: ${u.role}, CompanyID: ${u.companyId}`);
        });
    } catch (error) {
        console.error("DB Error:", error);
    } finally {
        process.exit(0);
    }
}

main();
