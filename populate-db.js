import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { Pool } = pg;

const connectionString = process.env.DATABASE_URI || `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

// Log masked connection string
const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ':***@');
log("Connection String: " + maskedConnectionString);
log("POSTGRES_USER: " + process.env.POSTGRES_USER);

const pool = new Pool({
    connectionString,
    ssl: false
});

const SYSTEMS = [
    { id: 1, name: "Neo-Taenaria", x: 500, y: 300, region: "Core Worlds", connections: [2, 3, 9], wormholeSector: 10099 },
    { id: 2, name: "Derivia", x: 450, y: 350, region: "Core Worlds", connections: [1, 4, 9], wormholeSector: 20099 },
    { id: 3, name: "Zallus", x: 550, y: 350, region: "Core Worlds", connections: [1, 5, 9], wormholeSector: 30099 },
    { id: 9, name: "Nexus", x: 500, y: 400, region: "Core Worlds", connections: [1, 2, 3, 4, 5, 6], wormholeSector: 90099 },
    { id: 4, name: "Kitara", x: 400, y: 450, region: "Inner Worlds", connections: [2, 9, 7], wormholeSector: 40099 },
    { id: 5, name: "Tamara", x: 600, y: 450, region: "Inner Worlds", connections: [3, 9, 8], wormholeSector: 50099 },
    { id: 6, name: "Chronos", x: 500, y: 500, region: "Inner Worlds", connections: [9, 7, 8, 10], wormholeSector: 60099 },
    { id: 7, name: "Heart of Pleiora", x: 300, y: 500, region: "Pleiora Nebula", connections: [4, 6, 11], wormholeSector: 70099 },
    { id: 8, name: "Magnus", x: 700, y: 500, region: "Pleiora Nebula", connections: [5, 6, 12], wormholeSector: 80099 },
    { id: 10, name: "Cryptos", x: 500, y: 600, region: "Outer Rim", connections: [6, 11, 12, 13], wormholeSector: 100099 },
    { id: 11, name: "Imrasael", x: 350, y: 650, region: "Outer Rim", connections: [7, 10, 14], wormholeSector: 110099 },
    { id: 12, name: "Vanguard", x: 650, y: 650, region: "Outer Rim", connections: [8, 10, 15], wormholeSector: 120099 },
    { id: 13, name: "Skull's Haven", x: 500, y: 750, region: "Pirate Territories", connections: [10, 14, 15], wormholeSector: 130099 },
    { id: 14, name: "Black Market", x: 300, y: 750, region: "Pirate Territories", connections: [11, 13], wormholeSector: 140099 },
    { id: 15, name: "Corsair's Rest", x: 700, y: 750, region: "Pirate Territories", connections: [12, 13], wormholeSector: 150099 },
    { id: 16, name: "Freeport 7", x: 200, y: 400, region: "Independent Worlds", connections: [7], wormholeSector: 160099 },
    { id: 17, name: "Outpost Alpha", x: 800, y: 400, region: "Independent Worlds", connections: [8], wormholeSector: 170099 },
    { id: 18, name: "Hermit's Void", x: 500, y: 150, region: "Independent Worlds", connections: [1], wormholeSector: 180099 }
];

const SECTOR_TYPES = {
    EMPTY: 'Empty',
    PORT: 'Port',
    PLANET: 'Planet',
    BOTH: 'Port & Planet',
    ASTEROID: 'Asteroid Field',
    NEBULA: 'Nebula',
    WORMHOLE: 'Wormhole'
};

const rand = (n) => Math.sin(n) * 10000 - Math.floor(Math.sin(n) * 10000);

import fs from 'fs';

const logFile = 'populate_debug.log';
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};
const error = (msg) => {
    console.error(msg);
    fs.appendFileSync(logFile, 'ERROR: ' + msg + '\n');
};

async function populate() {
    try {
        log("Connecting to database...");
        await pool.connect();
        log("Connected.");

        // 1. Populate Systems
        log("Populating Systems...");
        for (const sys of SYSTEMS) {
            await pool.query(`
                INSERT INTO systems (id, name, x, y, region, wormhole_sector)
                VALUES ($1, $2, $3, $4, $5, $6)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    x = EXCLUDED.x,
                    y = EXCLUDED.y,
                    region = EXCLUDED.region,
                    wormhole_sector = EXCLUDED.wormhole_sector
            `, [sys.id, sys.name, sys.x, sys.y, sys.region, sys.wormholeSector]);
        }
        log("Systems populated.");

        // 2. Populate Sectors
        log("Populating Sectors...");
        for (const sys of SYSTEMS) {
            const systemBaseSector = sys.id * 10000;

            for (let i = 0; i < 100; i++) {
                const sectorNum = systemBaseSector + i;
                const r = rand(sectorNum);
                let type = SECTOR_TYPES.EMPTY;
                let isWormhole = false;

                if (sectorNum === sys.wormholeSector) {
                    type = SECTOR_TYPES.WORMHOLE;
                    isWormhole = true;
                } else {
                    if (r > 0.8) type = SECTOR_TYPES.PORT;
                    else if (r > 0.9) type = SECTOR_TYPES.PLANET;
                    else if (r > 0.95) type = SECTOR_TYPES.BOTH;
                    else if (r < 0.1) type = SECTOR_TYPES.ASTEROID;
                    else if (r < 0.2 && r > 0.1) type = SECTOR_TYPES.NEBULA;
                }

                await pool.query(`
                    INSERT INTO sectors (system_id, sector_number, sector_type, is_wormhole)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (sector_number) DO UPDATE SET
                        system_id = EXCLUDED.system_id,
                        sector_type = EXCLUDED.sector_type,
                        is_wormhole = EXCLUDED.is_wormhole
                `, [sys.id, sectorNum, type, isWormhole]);
            }
        }
        log("Sectors populated.");

    } catch (err) {
        error(err);
    } finally {
        await pool.end();
    }
}

populate().catch(err => {
    error("Unhandled error: " + err);
    process.exit(1);
});
