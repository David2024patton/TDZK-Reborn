
import fs from 'fs';
import path from 'path';

const profileDir = 'C:\\Users\\rated\\AppData\\Local\\notebooklm-mcp\\Data\\chrome_profile';

console.log(`Checking profile dir: ${profileDir}`);

if (fs.existsSync(profileDir)) {
    try {
        console.log("Removing old Chrome profile directory...");
        fs.rmSync(profileDir, { recursive: true, force: true });
        console.log("✅ Successfully removed profile directory.");
    } catch (e) {
        console.error(`❌ Failed to remove profile directory: ${e.message}`);
        console.log("Please manually close any Chrome processes that might be using this directory.");
    }
} else {
    console.log("Profile directory does not exist (clean slate).");
}
