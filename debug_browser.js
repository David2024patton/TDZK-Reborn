
import { chromium } from 'patchright';
import path from 'path';
import fs from 'fs';
import { CONFIG } from './node_modules/notebooklm-mcp/dist/config.js';

async function debugBrowser() {
    console.log("--- Debugging Browser Access ---");
    const statePath = path.join(CONFIG.browserStateDir, 'state.json');
    console.log(`Loading state from: ${statePath}`);

    if (!fs.existsSync(statePath)) {
        console.error("❌ State file not found!");
        return;
    }

    const browser = await chromium.launch({
        headless: false, // Show the browser so the user can see!
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
        const context = await browser.newContext({
            storageState: statePath
        });

        const page = await context.newPage();

        const url = "https://notebooklm.google.com/notebook/13aed084-f09d-4365-bbdd-6974436c09f2?pli=1";
        console.log(`Navigating to: ${url}`);

        await page.goto(url);

        console.log("Waiting 10 seconds for page to load...");
        await page.waitForTimeout(10000);

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        const urlAfter = page.url();
        console.log(`URL after nav: ${urlAfter}`);

        if (urlAfter.includes('accounts.google.com')) {
            console.error("❌ Redirected to Login Page! Cookies are invalid or expired.");
        } else if (urlAfter.includes('notebooklm.google.com')) {
            console.log("✅ On NotebookLM domain.");

            // Check for specific error messages
            const content = await page.content();
            if (content.includes("You need access")) {
                console.error("❌ Access Denied screen detected.");
            } else if (content.includes("Notebook not found")) {
                console.error("❌ Notebook not found screen detected.");
            } else {
                console.log("✅ Content seems okay (no obvious error screens).");
            }
        }

        console.log("Closing browser in 5 seconds...");
        await page.waitForTimeout(5000);

    } catch (e) {
        console.error("Browser Error:", e);
    } finally {
        await browser.close();
    }
}

debugBrowser();
