
export interface SystemNode {
    id: number;
    name: string;
    x: number;
    y: number;
    region: string;
    connections: number[];
    wormholeSector?: number; // The sector in this system that leads to the wormhole network
}

export const SYSTEMS: SystemNode[] = [
    // Core Worlds
    { id: 1, name: "Neo-Taenaria", x: 500, y: 300, region: "Core Worlds", connections: [2, 3, 9], wormholeSector: 10099 },
    { id: 2, name: "Derivia", x: 450, y: 350, region: "Core Worlds", connections: [1, 4, 9], wormholeSector: 20099 },
    { id: 3, name: "Zallus", x: 550, y: 350, region: "Core Worlds", connections: [1, 5, 9], wormholeSector: 30099 },
    { id: 9, name: "Nexus", x: 500, y: 400, region: "Core Worlds", connections: [1, 2, 3, 4, 5, 6], wormholeSector: 90099 },

    // Inner Worlds
    { id: 4, name: "Kitara", x: 400, y: 450, region: "Inner Worlds", connections: [2, 9, 7], wormholeSector: 40099 },
    { id: 5, name: "Tamara", x: 600, y: 450, region: "Inner Worlds", connections: [3, 9, 8], wormholeSector: 50099 },
    { id: 6, name: "Chronos", x: 500, y: 500, region: "Inner Worlds", connections: [9, 7, 8, 10], wormholeSector: 60099 },

    // Pleiora Nebula
    { id: 7, name: "Heart of Pleiora", x: 300, y: 500, region: "Pleiora Nebula", connections: [4, 6, 11], wormholeSector: 70099 },
    { id: 8, name: "Magnus", x: 700, y: 500, region: "Pleiora Nebula", connections: [5, 6, 12], wormholeSector: 80099 },

    // Outer Rim
    { id: 10, name: "Cryptos", x: 500, y: 600, region: "Outer Rim", connections: [6, 11, 12, 13], wormholeSector: 100099 },
    { id: 11, name: "Imrasael", x: 350, y: 650, region: "Outer Rim", connections: [7, 10, 14], wormholeSector: 110099 },
    { id: 12, name: "Vanguard", x: 650, y: 650, region: "Outer Rim", connections: [8, 10, 15], wormholeSector: 120099 },

    // Pirate Territories
    { id: 13, name: "Skull's Haven", x: 500, y: 750, region: "Pirate Territories", connections: [10, 14, 15], wormholeSector: 130099 },
    { id: 14, name: "Black Market", x: 300, y: 750, region: "Pirate Territories", connections: [11, 13], wormholeSector: 140099 },
    { id: 15, name: "Corsair's Rest", x: 700, y: 750, region: "Pirate Territories", connections: [12, 13], wormholeSector: 150099 },

    // Independent Worlds
    { id: 16, name: "Freeport 7", x: 200, y: 400, region: "Independent Worlds", connections: [7], wormholeSector: 160099 },
    { id: 17, name: "Outpost Alpha", x: 800, y: 400, region: "Independent Worlds", connections: [8], wormholeSector: 170099 },
    { id: 18, name: "Hermit's Void", x: 500, y: 150, region: "Independent Worlds", connections: [1], wormholeSector: 180099 }
];

export const REGION_COLORS: Record<string, string> = {
    "Core Worlds": "#00ccff",
    "Inner Worlds": "#00ff88",
    "Pleiora Nebula": "#aa00ff",
    "Outer Rim": "#ffaa00",
    "Pirate Territories": "#ff0000",
    "Independent Worlds": "#aaaaaa"
};
