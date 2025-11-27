
export interface PageContent {
  title: string;
  subtitle: string;
  content: string | { label: string; url?: string; desc?: string }[]; // String for text, Array for downloads/links
  type?: 'text' | 'list' | 'form' | 'external';
}

export const SITE_CONTENT: Record<string, PageContent> = {
  "Web Board": {
    title: "Galactic Forums",
    subtitle: "COMMUNITY_UPLINK_V2",
    type: 'external',
    content: "The Web Board is the central hub for alliance politics, trade discussions, and general community interaction.\n\nExternal Link Established...\nRedirecting to secure frequency..."
  },
  "Register!": {
    title: "New Pilot Registration",
    subtitle: "ENLISTMENT_PROTOCOL",
    type: 'form',
    content: "Join the ranks of thousands of pilots in the galaxy. Choose your race wisely, for it will determine your strengths and weaknesses in the void."
  },
  "Donate!": {
    title: "Support TDZK",
    subtitle: "SERVER_MAINTENANCE_FUND",
    type: 'text',
    content: "TDZK is a free-to-play game run by dedicated enthusiasts. Server costs, bandwidth, and development time are funded entirely by donations from players like you.\n\nDonating grants you 'Supporter Status', which includes:\n- A custom forum badge\n- Access to the 'Supporter's Lounge' on the Web Board\n- The warm fuzzy feeling of keeping the universe alive.\n\nAll donations are processed securely via PayPal."
  },
  "Advertise with us!": {
    title: "Advertising Opportunities",
    subtitle: "COMMERCIAL_DATA_STREAM",
    type: 'text',
    content: "Reach thousands of dedicated sci-fi strategy gamers.\n\nWe offer banner placement (468x60) and sidebar skyscraper ads (120x600).\n\nFor rates and demographics, please contact admin@tdzk.net."
  },
  "Changelog": {
    title: "System Changelog",
    subtitle: "PATCH_NOTES_ARCHIVE",
    type: 'text',
    content: "v2.6.1 (Current)\n- Fixed issue with 50x20 alliance tags not rendering flush with player tags.\n- Updated splash screen assets.\n- Optimized galaxy map rendering performance.\n\nv2.6.0\n- Added 'Hall of Fame' historical archives.\n- Revamped 'Statistics' view with new visual interface.\n- Implemented 'Standard Player Template' for sector views.\n\nv2.5.9\n- Adjusted 'Sniv' race drone reprogramming rate.\n- Fixed bug in Port raiding calculation.\n- Added new 'Siege' class weapons."
  },
  "Discord": {
    title: "Comms Relay",
    subtitle: "REALTIME_CHAT_PROTOCOL",
    type: 'external',
    content: "Join the official TDZK Discord server for real-time chat, voice comms, and instant support.\n\nInvite Link: https://discord.gg/tdzk-retro"
  },
  "Forum Rules": {
    title: "Communication Protocols",
    subtitle: "CODE_OF_CONDUCT",
    type: 'text',
    content: "1. No Spamming.\n2. No Harassment or Hate Speech.\n3. Keep roleplay within the designated sectors.\n4. Bug exploitation is grounds for immediate banishment.\n5. Multiple accounts are strictly prohibited (The 'Multi' Rule).\n6. Respect the Admins and Moderators.\n\nFailure to follow these protocols will result in immediate termination of your connection."
  },
  "ToA": {
    title: "Terms of Agreement",
    subtitle: "LEGAL_BINDING",
    type: 'text',
    content: "By accessing Taenaria Derivia Zallus Kitara (TDZK), you agree to the following terms:\n\n1. You are at least 13 years of age.\n2. You will not use automation, scripts, or bots to play the game.\n3. You acknowledge that all game accounts are property of TDZK.\n4. TDZK is not responsible for loss of data due to server crashes or resets.\n5. We reserve the right to terminate service to anyone for any reason."
  },
  "Privacy Policy": {
    title: "Data Privacy",
    subtitle: "ENCRYPTION_LEVEL_5",
    type: 'text',
    content: "We collect your email address solely for account verification and password recovery. We do not sell, trade, or otherwise transfer your data to outside parties.\n\nCookies are used to maintain your login session. By playing, you consent to our cookie usage."
  },
  "Downloads": {
    title: "Data Bank",
    subtitle: "FILE_ARCHIVE",
    type: 'list',
    content: [
      { label: "TDZK Desktop Wallpaper Pack", desc: "High-res starfields and ship renders (Zip, 15MB)" },
      { label: "WinAmp Skin - TDZK Retro", desc: "Classic skin for WinAmp 2.x" },
      { label: "IRC Client (mIRC Script)", desc: "Pre-configured script for connecting to game chat" },
      { label: "Sector Calculator Tool", desc: "Excel sheet for trade route optimization" }
    ]
  },
  "Merchandise": {
    title: "Supply Depot",
    subtitle: "PHYSICAL_ASSETS",
    type: 'external',
    content: "Get your official TDZK gear at CafePress.\n\n- T-Shirts (Faction Logos)\n- Mousepads\n- Coffee Mugs\n\nVisit: http://www.cafepress.com/tdzk"
  },
  "Redial: News & Tools": {
    title: "Redial Network",
    subtitle: "EXTERNAL_DB_LINK",
    type: 'text',
    content: "Redial.net is the premiere fan-site for TDZK information.\n\nFeatures:\n- Dynamic Station List\n- Trade Route Calculator\n- Player Interviews\n- Archive of Round I-VI History"
  },
  "History Book": {
    title: "Galactic History",
    subtitle: "CHRONICLES",
    type: 'text',
    content: "The universe has been reset 12 times. This book contains the history of the previous universes.\n\nRound I: The Beginning\nRound II: Rise of the Zallun\nRound III: The Great War\nRound IV: The Economic Collapse\n...\n[Archives Corrupted - Data Recovery In Progress]"
  }
};
