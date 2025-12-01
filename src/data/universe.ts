import { SystemNode } from './types';

export interface SystemNode {
    id: number;
    name: string;
    x: number;
    y: number;
    region: string;
    connections: number[];
    wormholes: { sector: number, targetSystemId: number }[];
}

export const SYSTEMS: SystemNode[] = [
    // Core Worlds
    {
        id: 1,
        name: "Neo-Taenaria",
        x: 500,
        y: 300,
        region: "Core Worlds",
        connections: [2, 3, 9],
        wormholes: [
            { sector: 1002, targetSystemId: 2 },
            { sector: 1003, targetSystemId: 3 },
            { sector: 1009, targetSystemId: 9 }
        ]
    },
    {
        id: 2,
        name: "Derivia",
        x: 450,
        y: 350,
        region: "Core Worlds",
        connections: [1, 4, 9],
        wormholes: [
            { sector: 2001, targetSystemId: 1 },
            { sector: 2004, targetSystemId: 4 },
            { sector: 2009, targetSystemId: 9 }
        ]
    },
    {
        id: 3,
        name: "Zallus",
        x: 550,
        y: 350,
        region: "Core Worlds",
        connections: [1, 5, 9],
        wormholes: [
            { sector: 3001, targetSystemId: 1 },
            { sector: 3005, targetSystemId: 5 },
            { sector: 3009, targetSystemId: 9 }
        ]
    },
    {
        id: 9,
        name: "Nexus",
        x: 500,
        y: 400,
        region: "Core Worlds",
        connections: [1, 2, 3, 4, 5, 6],
        wormholes: [
            { sector: 9001, targetSystemId: 1 },
            { sector: 9002, targetSystemId: 2 },
            { sector: 9003, targetSystemId: 3 },
            { sector: 9004, targetSystemId: 4 },
            { sector: 9005, targetSystemId: 5 },
            { sector: 9006, targetSystemId: 6 }
        ]
    },

    // Inner Worlds
    {
        id: 4,
        name: "Kitara",
        x: 400,
        y: 450,
        region: "Inner Worlds",
        connections: [2, 9, 7],
        wormholes: [
            { sector: 4002, targetSystemId: 2 },
            { sector: 4009, targetSystemId: 9 },
            { sector: 4007, targetSystemId: 7 }
        ]
    },
    {
        id: 5,
        name: "Tamara",
        x: 600,
        y: 450,
        region: "Inner Worlds",
        connections: [3, 9, 8],
        wormholes: [
            { sector: 5003, targetSystemId: 3 },
            { sector: 5009, targetSystemId: 9 },
            { sector: 5008, targetSystemId: 8 }
        ]
    },
    {
        id: 6,
        name: "Chronos",
        x: 500,
        y: 500,
        region: "Inner Worlds",
        connections: [9, 7, 8, 10],
        wormholes: [
            { sector: 6009, targetSystemId: 9 },
            { sector: 6007, targetSystemId: 7 },
            { sector: 6008, targetSystemId: 8 },
            { sector: 6010, targetSystemId: 10 }
        ]
    },

    // Pleiora Nebula
    {
        id: 7,
        name: "Heart of Pleiora",
        x: 300,
        y: 500,
        region: "Pleiora Nebula",
        connections: [4, 6, 11],
        wormholes: [
            { sector: 7004, targetSystemId: 4 },
            { sector: 7006, targetSystemId: 6 },
            { sector: 7011, targetSystemId: 11 }
        ]
    },
    {
        id: 8,
        name: "Magnus",
        x: 700,
        y: 500,
        region: "Pleiora Nebula",
        connections: [5, 6, 12],
        wormholes: [
            { sector: 8005, targetSystemId: 5 },
            { sector: 8006, targetSystemId: 6 },
            { sector: 8012, targetSystemId: 12 }
        ]
    },

    // Outer Rim
    {
        id: 10,
        name: "Cryptos",
        x: 500,
        y: 600,
        region: "Outer Rim",
        connections: [6, 11, 12, 13],
        wormholes: [
            { sector: 10006, targetSystemId: 6 },
            { sector: 10011, targetSystemId: 11 },
            { sector: 10012, targetSystemId: 12 },
            { sector: 10013, targetSystemId: 13 }
        ]
    },
    {
        id: 11,
        name: "Imrasael",
        x: 350,
        y: 650,
        region: "Outer Rim",
        connections: [7, 10, 14],
        wormholes: [
            { sector: 11007, targetSystemId: 7 },
            { sector: 11010, targetSystemId: 10 },
            { sector: 11014, targetSystemId: 14 }
        ]
    },
    {
        id: 12,
        name: "Vanguard",
        x: 650,
        y: 650,
        region: "Outer Rim",
        connections: [8, 10, 15],
        wormholes: [
            { sector: 12008, targetSystemId: 8 },
            { sector: 12010, targetSystemId: 10 },
            { sector: 12015, targetSystemId: 15 }
        ]
    },

    // Pirate Territories
    {
        id: 13,
        name: "Skull's Haven",
        x: 500,
        y: 750,
        region: "Pirate Territories",
        connections: [10, 14, 15],
        wormholes: [
            { sector: 13010, targetSystemId: 10 },
            { sector: 13014, targetSystemId: 14 },
            { sector: 13015, targetSystemId: 15 }
        ]
    },
    {
        id: 14,
        name: "Black Market",
        x: 300,
        y: 750,
        region: "Pirate Territories",
        connections: [11, 13],
        wormholes: [
            { sector: 14011, targetSystemId: 11 },
            { sector: 14013, targetSystemId: 13 }
        ]
    },
    {
        id: 15,
        name: "Corsair's Rest",
        x: 700,
        y: 750,
        region: "Pirate Territories",
        connections: [12, 13],
        wormholes: [
            { sector: 15012, targetSystemId: 12 },
            { sector: 15013, targetSystemId: 13 }
        ]
    },

    // Independent Worlds
    {
        id: 16,
        name: "Freeport 7",
        x: 200,
        y: 400,
        region: "Independent Worlds",
        connections: [7],
        wormholes: [
            { sector: 16007, targetSystemId: 7 }
        ]
    },
    {
        id: 17,
        name: "Outpost Alpha",
        x: 800,
        y: 400,
        region: "Independent Worlds",
        connections: [8],
        wormholes: [
            { sector: 17008, targetSystemId: 8 }
        ]
    },
    {
        id: 18,
        name: "Hermit's Void",
        x: 500,
        y: 150,
        region: "Independent Worlds",
        connections: [1],
        wormholes: [
            { sector: 18001, targetSystemId: 1 }
        ]
    }
];

export const REGION_COLORS: Record<string, string> = {
    "Core Worlds": "#00ccff",
    "Inner Worlds": "#00ff88",
    "Pleiora Nebula": "#aa00ff",
    "Outer Rim": "#ffaa00",
    "Pirate Territories": "#ff0000",
    "Independent Worlds": "#aaaaaa"
};
