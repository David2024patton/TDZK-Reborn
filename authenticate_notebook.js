
import { AuthManager } from "./node_modules/notebooklm-mcp/dist/auth/auth-manager.js";
import { CONFIG } from "./node_modules/notebooklm-mcp/dist/config.js";

async function main() {
    console.log("Starting authentication setup...");

    // Initialize AuthManager
    const authManager = new AuthManager();

    // Define a progress callback
    const sendProgress = (message, step, total) => {
        console.log(`[${step}/${total}] ${message}`);
    };

    try {
        // Force headless false for interactive login
        CONFIG.headless = false;

        console.log("Opening browser for login. Please check the opened window.");
        console.log("You will need to sign in to your Google account.");
        console.log("The browser will close automatically once you reach NotebookLM.");

        const success = await authManager.performSetup(sendProgress, false); // false = not headless (visible)

        if (success) {
            console.log("Authentication successful! Browser state saved.");
            console.log("You can now restart your MCP server or IDE to use the authenticated session.");
        } else {
            console.error("Authentication failed.");
        }
    } catch (error) {
        console.error("Error during authentication:", error);
    }
}

main();
