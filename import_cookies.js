
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { CONFIG } from './node_modules/notebooklm-mcp/dist/config.js';

async function importCookies() {
    try {
        const cookiesPath = path.resolve('cookies.txt');
        if (!fs.existsSync(cookiesPath)) {
            console.error('cookies.txt not found!');
            return;
        }

        const fileStream = fs.createReadStream(cookiesPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        const cookies = [];

        for await (const line of rl) {
            if (line.startsWith('#') || !line.trim()) {
                continue;
            }

            const parts = line.split('\t');
            if (parts.length < 7) {
                continue;
            }

            // Netscape format:
            // domain, flag, path, secure, expiration, name, value
            const [domain, flag, pathStr, secureStr, expirationStr, name, value] = parts;

            // Filter for relevant domains to avoid bloating the state
            if (!domain.includes('google') && !domain.includes('notebooklm')) {
                continue;
            }

            const expires = parseInt(expirationStr, 10);
            const secure = secureStr === 'TRUE';

            cookies.push({
                name,
                value,
                domain,
                path: pathStr,
                expires: expires === 0 ? -1 : expires,
                httpOnly: false, // Netscape format doesn't specify, default to false
                secure: secure,
                sameSite: 'Lax' // Default to Lax
            });
        }

        console.log(`Parsed ${cookies.length} relevant cookies.`);

        // Construct Playwright state object
        const state = {
            cookies: cookies,
            origins: []
        };

        // Ensure directory exists
        const stateDir = CONFIG.browserStateDir;
        if (!fs.existsSync(stateDir)) {
            fs.mkdirSync(stateDir, { recursive: true });
        }

        const statePath = path.join(stateDir, 'state.json');
        fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

        console.log(`Successfully imported cookies to: ${statePath}`);
        console.log('You can now restart the MCP server.');

    } catch (error) {
        console.error('Error importing cookies:', error);
    }
}

importCookies();
