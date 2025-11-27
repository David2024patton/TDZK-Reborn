
import { chromium } from 'patchright';
import path from 'path';
import fs from 'fs';
import { CONFIG } from './node_modules/notebooklm-mcp/dist/config.js';

async function debugSelectors() {
    console.log("--- Debugging Selectors ---");
    const statePath = path.join(CONFIG.browserStateDir, 'state.json');

    const browser = await chromium.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
        const context = await browser.newContext({
            storageState: statePath
        });

        const page = await context.newPage();
        // Use the URL with pli=1
        const url = "https://notebooklm.google.com/notebook/13aed084-f09d-4365-bbdd-6974436c09f2?pli=1";
        console.log(`Navigating to: ${url}`);

        await page.goto(url);

        console.log("Waiting 15 seconds for page to load...");
        await page.waitForTimeout(15000);

        // Dump all textareas
        const textareas = await page.$$('textarea');
        console.log(`Found ${textareas.length} textareas.`);

        for (let i = 0; i < textareas.length; i++) {
            const el = textareas[i];
            const classAttr = await el.getAttribute('class');
            const placeholder = await el.getAttribute('placeholder');
            const ariaLabel = await el.getAttribute('aria-label');
            const isVisible = await el.isVisible();

            console.log(`Textarea ${i}:`);
            console.log(`  Class: ${classAttr}`);
            console.log(`  Placeholder: ${placeholder}`);
            console.log(`  Aria-Label: ${ariaLabel}`);
            console.log(`  Visible: ${isVisible}`);
        }

        // Dump HTML to file
        const html = await page.content();
        fs.writeFileSync('page_dump.html', html);
        console.log("Dumped HTML to page_dump.html");

        console.log("Closing browser in 5 seconds...");
        await page.waitForTimeout(5000);

    } catch (e) {
        console.error("Browser Error:", e);
    } finally {
        await browser.close();
    }
}

debugSelectors();
