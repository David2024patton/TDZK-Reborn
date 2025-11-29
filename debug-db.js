import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const config = {
    connectionString: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@data.itak.live:5432/${process.env.POSTGRES_DB}`,
    // ssl: { rejectUnauthorized: false }
};

console.log("Connecting with:", config.connectionString.replace(/:[^:@]+@/, ':***@'));

const pool = new pg.Pool(config);

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("Connection Error:", err);
    } else {
        console.log("Connected!", res.rows[0]);
    }
    pool.end();
});
