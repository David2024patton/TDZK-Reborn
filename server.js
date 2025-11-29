import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const connString = process.env.DATABASE_URI || `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@data.itak.live:5432/${process.env.POSTGRES_DB}`;
console.log("Using connection:", connString.replace(/:[^:@]+@/, ':***@'));

const pool = new pg.Pool({
    connectionString: connString,
    // ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing query', err.stack);
        }
        console.log("Database connected successfully:", result.rows[0]);
    });
});

// GET /api/systems - Fetch all systems and their connections
app.get('/api/systems', async (req, res) => {
    console.log("GET /api/systems called");
    try {
        console.log("Querying systems...");
        const systemsResult = await pool.query('SELECT * FROM systems');
        console.log("Systems found:", systemsResult.rows.length);

        console.log("Querying connections...");
        const connectionsResult = await pool.query('SELECT * FROM system_connections');
        console.log("Connections found:", connectionsResult.rows.length);

        const systems = systemsResult.rows.map(sys => {
            const connections = connectionsResult.rows
                .filter(c => c.system_id === sys.id)
                .map(c => c.connected_system_id);

            return {
                ...sys,
                connections
            };
        });

        console.log("Querying wormholes...");
        const wormholesResult = await pool.query("SELECT * FROM sectors WHERE sector_type = 'Wormhole'");
        console.log("Wormholes found:", wormholesResult.rows.length);

        const systemsWithWormholes = systems.map(sys => {
            const wormhole = wormholesResult.rows.find(w => w.system_id === sys.id);
            return {
                ...sys,
                wormholeSector: wormhole ? wormhole.sector_number : undefined
            };
        });

        res.json(systemsWithWormholes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/player/:username - Get player state
app.get('/api/player/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const result = await pool.query(`
            SELECT p.*, s.sector_number as current_sector_number, sys.id as current_system_id, sys.name as current_system_name
            FROM pilots p
            LEFT JOIN sectors s ON p.current_sector_id = s.id
            LEFT JOIN systems sys ON s.system_id = sys.id
            WHERE p.username = $1
        `, [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/move - Move to a sector
app.post('/api/move', async (req, res) => {
    const { username, targetSectorNumber } = req.body;

    try {
        // 1. Get player
        const playerRes = await pool.query('SELECT * FROM pilots WHERE username = $1', [username]);
        if (playerRes.rows.length === 0) return res.status(404).json({ error: 'Player not found' });
        const player = playerRes.rows[0];

        // 2. Check turns
        if (player.pilot_level < 99 && player.turns <= 0 && !player.is_admin) { // Simple check
            // Turns logic to be added
        }

        // 3. Find target sector ID
        let targetSectorRes = await pool.query('SELECT * FROM sectors WHERE sector_number = $1', [targetSectorNumber]);
        let targetSectorId;

        if (targetSectorRes.rows.length === 0) {
            return res.status(400).json({ error: 'Sector does not exist (only wormholes populated currently)' });
        } else {
            targetSectorId = targetSectorRes.rows[0].id;
        }

        // 4. Update player
        await pool.query('UPDATE pilots SET current_sector_id = $1 WHERE id = $2', [targetSectorId, player.id]);

        // Return new state
        res.json({ success: true, currentSector: targetSectorNumber });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/warp - Warp to system
app.post('/api/warp', async (req, res) => {
    const { username, targetSystemId } = req.body;

    try {
        const playerRes = await pool.query(`
            SELECT p.*, s.system_id as current_system_id 
            FROM pilots p 
            JOIN sectors s ON p.current_sector_id = s.id 
            WHERE username = $1`, [username]);

        if (playerRes.rows.length === 0) return res.status(404).json({ error: 'Player not found' });
        const player = playerRes.rows[0];

        // Check connection
        const connRes = await pool.query('SELECT * FROM system_connections WHERE system_id = $1 AND connected_system_id = $2', [player.current_system_id, targetSystemId]);
        if (connRes.rows.length === 0 && !player.is_admin) {
            return res.status(400).json({ error: 'Systems not connected' });
        }

        // Find wormhole in target system
        const wormholeRes = await pool.query("SELECT * FROM sectors WHERE system_id = $1 AND sector_type = 'Wormhole'", [targetSystemId]);
        if (wormholeRes.rows.length === 0) return res.status(500).json({ error: 'Target system has no wormhole' });

        const targetSectorId = wormholeRes.rows[0].id;

        // Update player
        await pool.query('UPDATE pilots SET current_sector_id = $1 WHERE id = $2', [targetSectorId, player.id]);

        res.json({ success: true, currentSystem: targetSystemId, currentSector: wormholeRes.rows[0].sector_number });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Game server running on port ${port}`);
});
