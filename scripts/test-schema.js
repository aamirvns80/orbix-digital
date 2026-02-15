
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const query = `
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'leads';
`;

pool.query(query, (err, res) => {
    if (err) {
        console.error("Query Error:", err);
    } else {
        if (res.rows.length > 0) {
            console.log("Table 'leads' exists.");
        } else {
            console.log("Table 'leads' DOES NOT exist.");
        }
    }
    pool.end();
});
