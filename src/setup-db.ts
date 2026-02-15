
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbName = 'marketing_agency';

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is not set in .env');
        process.exit(1);
    }

    // Connect to default 'postgres' database to create the new one
    const url = new URL(process.env.DATABASE_URL);
    url.pathname = 'postgres';

    const client = new Client({
        connectionString: url.toString(),
    });

    try {
        await client.connect();
        console.log(`🔌 Connected to postgres helper DB`);

        const checkRes = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (checkRes.rowCount === 0) {
            console.log(`🔨 Creating database "${dbName}"...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`✅ Database "${dbName}" created successfully!`);
        } else {
            console.log(`ℹ️ Database "${dbName}" already exists.`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.end();
    }
}

main();
