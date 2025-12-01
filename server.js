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
            const systemWormholes = wormholesResult.rows
                .filter(w => w.system_id === sys.id)
                .map(w => ({
                    sector: w.sector_number,
                    targetSystemId: w.target_system_id
                }));

            return {
                ...sys,
                wormholes: systemWormholes
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

        // 1. Get current sector to check for wormhole
        const currentSectorRes = await pool.query('SELECT * FROM sectors WHERE id = $1', [player.current_sector_id]);
        if (currentSectorRes.rows.length === 0) return res.status(500).json({ error: 'Current sector invalid' });
        const currentSector = currentSectorRes.rows[0];

        // 2. Check if we are at a valid wormhole for the target system
        const isAtValidWormhole = currentSector.sector_type === 'Wormhole' && currentSector.target_system_id === targetSystemId;

        // 3. Check generic connection if not at a wormhole
        if (!isAtValidWormhole && !player.is_admin) {
            const connRes = await pool.query('SELECT * FROM system_connections WHERE system_id = $1 AND connected_system_id = $2', [player.current_system_id, targetSystemId]);
            if (connRes.rows.length === 0) {
                return res.status(400).json({ error: 'Systems not connected and not at a valid wormhole' });
            }
        }

        // Find destination wormhole (entrance from the other side)
        // Ideally, we land on the wormhole sector in the target system that points back to us?
        // Or just any safe spot? 
        // The previous logic landed on "the wormhole" in the target system.
        // Now there are multiple. We should land on the one that points back to our current system (reciprocal).

        const targetWormholeRes = await pool.query(
            "SELECT * FROM sectors WHERE system_id = $1 AND sector_type = 'Wormhole' AND target_system_id = $2",
            [targetSystemId, player.current_system_id]
        );

        let targetSectorId;
        if (targetWormholeRes.rows.length > 0) {
            targetSectorId = targetWormholeRes.rows[0].id;
        } else {
            // Fallback: Find ANY wormhole in target system
            const anyWormhole = await pool.query("SELECT * FROM sectors WHERE system_id = $1 AND sector_type = 'Wormhole' LIMIT 1", [targetSystemId]);
            if (anyWormhole.rows.length > 0) {
                targetSectorId = anyWormhole.rows[0].id;
            } else {
                return res.status(500).json({ error: 'Target system has no wormhole to land on' });
            }
        }

        // Update player
        await pool.query('UPDATE pilots SET current_sector_id = $1 WHERE id = $2', [targetSectorId, player.id]);

        // Get the sector number we landed in
        const landedSectorRes = await pool.query('SELECT sector_number FROM sectors WHERE id = $1', [targetSectorId]);
        const landedSectorNumber = landedSectorRes.rows[0].sector_number;

        res.json({ success: true, currentSystem: targetSystemId, currentSector: landedSectorNumber });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Register Endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, email, race, shipType } = req.body;

    // Race to System Mapping
    const STARTING_SYSTEMS = {
        'Derivian': 2, // Derivia
        'Zallun': 3,   // Zallus
        'Kitaran': 4,  // Kitara
        'Tamaran': 5,  // Tamara
        'Sniv': 11,    // Imrasael
        'Wraith': 13,  // Skull's Haven
        'Quelaar': 12  // Vanguard
    };

    const startSystemId = STARTING_SYSTEMS[race] || 1; // Default to Neo-Taenaria
    const startSector = (startSystemId * 1000) + 99; // e.g., 2099 for Derivia

    // Get Sector ID for starting location
    let startSectorId;
    try {
        const sectorRes = await pool.query('SELECT id FROM sectors WHERE sector_number = $1', [startSector]);
        if (sectorRes.rows.length > 0) {
            startSectorId = sectorRes.rows[0].id;
        } else {
            // Fallback to admin sector if generation failed
            startSectorId = 5818;
        }

        const result = await pool.query(
            `INSERT INTO pilots (username, password_hash, email, race, ship_type, current_sector_id, pilot_level, experience, credits_on_hand, turns)
             VALUES ($1, $2, $3, $4, $5, $6, 1, 0, 1000, 1000)
             RETURNING id, username`,
            [username, password, email, race, shipType, startSectorId]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Username or Email already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for: '${username}' with password: '${password}'`);

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM pilots WHERE username = $1', [username]);
        console.log(`Found ${result.rows.length} users for '${username}'`);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log(`User found: ${user.username}, Hash: ${user.password_hash}`);
            // Simple password check (plaintext for prototype as requested)
            if (user.password_hash === password) {
                // Update Online Status
                await pool.query('UPDATE pilots SET is_online = true, last_active = NOW() WHERE id = $1', [user.id]);

                res.json({
                    success: true,
                    username: user.username,
                    isAdmin: user.is_admin
                });
            } else {
                console.log("Password mismatch");
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } else {
            console.log("User not found in DB");
            res.status(401).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Online Players Endpoint
app.get('/api/online-players', async (req, res) => {
    try {
        // Count players active in last 15 minutes
        const onlineResult = await pool.query(`
            SELECT count(*) as count FROM pilots 
            WHERE last_active > NOW() - INTERVAL '15 minutes'
        `);

        // Count total registered players
        const totalResult = await pool.query('SELECT count(*) as count FROM pilots');

        res.json({
            count: parseInt(onlineResult.rows[0].count),
            total: parseInt(totalResult.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch online count' });
    }
});

// GET /api/sector/:sectorNumber - Get sector details
app.get('/api/sector/:sectorNumber', async (req, res) => {
    const { sectorNumber } = req.params;
    try {
        // 1. Get Sector Info
        const sectorResult = await pool.query('SELECT * FROM sectors WHERE sector_number = $1', [sectorNumber]);
        if (sectorResult.rows.length === 0) {
            return res.status(404).json({ error: 'Sector not found' });
        }
        const sectorData = sectorResult.rows[0];

        // 2. Get Pilots in Sector
        const pilotsResult = await pool.query(`
            SELECT username, pilot_level, id 
            FROM pilots 
            WHERE current_sector_id = $1
        `, [sectorData.id]);

        // 3. Get Deployables (Forces) in Sector
        const deployablesResult = await pool.query(`
            SELECT * FROM deployables WHERE current_sector_id = $1
        `, [sectorData.id]);

        res.json({
            ...sectorData,
            pilots: pilotsResult.rows,
            forces: deployablesResult.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Debug Endpoint - List all users
app.get('/api/debug/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, current_sector_id FROM pilots');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.listen(port, () => {
    console.log(`Game server running on port ${port}`);
});
