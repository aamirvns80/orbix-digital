
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const connectionString = process.env.DATABASE_URL;
console.log("Connection String:", connectionString);

const pool = new Pool({
    connectionString: connectionString,
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("Connection Error:", err);
    } else {
        console.log("Connection Success:", res.rows[0]);
    }
    pool.end();
});
