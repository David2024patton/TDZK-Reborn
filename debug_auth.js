
import { AuthManager } from "./node_modules/notebooklm-mcp/dist/auth/auth-manager.js";
import { CONFIG } from "./node_modules/notebooklm-mcp/dist/config.js";
import fs from 'fs';

async function debugAuth() {
    console.log("--- Debugging NotebookLM Auth ---");
    console.log(`Configured Browser State Dir: ${CONFIG.browserStateDir}`);

    const authManager = new AuthManager();
    const statePath = authManager.getStatePath();

    console.log(`State Path found: ${statePath}`);

    if (statePath) {
        try {
            const stats = fs.statSync(statePath);
            console.log(`State file size: ${stats.size} bytes`);
            console.log(`State file modified: ${stats.mtime}`);

            const stateData = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
            console.log(`Cookies count: ${stateData.cookies ? stateData.cookies.length : 0}`);

            const criticalCookies = [
                "SID", "HSID", "SSID", "APISID", "SAPISID",
                "__Secure-OSID", "__Secure-1PSID", "__Secure-3PSID"
            ];

            const foundCookies = stateData.cookies.map(c => c.name);
            const missing = criticalCookies.filter(c => !foundCookies.includes(c));

            if (missing.length > 0) {
                console.error(`❌ Missing critical cookies: ${missing.join(', ')}`);
            } else {
                console.log("✅ All critical cookies present in state file.");
            }

            // Check expiry of a few
            const osid = stateData.cookies.find(c => c.name === '__Secure-OSID');
            if (osid) {
                console.log(`__Secure-OSID expires: ${new Date(osid.expires * 1000).toISOString()}`);
                if (osid.expires < Date.now() / 1000) {
                    console.error("❌ __Secure-OSID is EXPIRED!");
                } else {
                    console.log("✅ __Secure-OSID is valid.");
                }
            }

        } catch (e) {
            console.error("Error reading state file:", e);
        }
    } else {
        console.error("❌ No state file found by AuthManager.");
    }
}

debugAuth();
