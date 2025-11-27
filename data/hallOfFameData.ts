
export interface HoFEntry {
  rank: number;
  banner?: string; // Seed for generating an image
  name: string;
  race?: string;
  guild?: string; // For player rows (Alliance tag)
  leader?: string; // For alliance rows
  members?: number; // For alliance rows
  level?: number; // For player rows
  value: string; // The main stat (EXP, Kills, etc)
  secondary?: string; // Secondary stat (Avg EXP, Kills Avg)
}

export type CategoryKey = 'experience' | 'kills' | 'pirated' | 'raids' | 'avg_kills';

export interface RoundData {
  id: string;
  name: string;
  alliances: Record<string, HoFEntry[]>;
  players: Record<string, HoFEntry[]>;
}

// Helper to generate a banner URL
const getBanner = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\s/g, '')}/100/30`;
const getTag = (seed: string) => `https://picsum.photos/seed/${seed.replace(/\s/g, '')}tag/50/20`;

export const HOF_DATA: RoundData[] = [
  {
    id: 'VII',
    name: 'Round VII',
    alliances: {
      experience: [
        { rank: 1, banner: "LoF", name: "Lords of Fear - The Pyrites", leader: "snuff", members: 29, value: "10,384,275,510", secondary: "358,078,465" },
        { rank: 2, banner: "GTG", name: "Galactic Trade Guild", leader: "iYRe", members: 29, value: "9,568,715,286", secondary: "329,955,699" },
        { rank: 3, banner: "Phoenix", name: "Phoenix Talon", leader: "GNU Order", members: 29, value: "9,454,317,362", secondary: "326,010,943" },
        { rank: 4, banner: "Silver", name: "Silver Horde", leader: "Gryffin", members: 28, value: "9,095,198,335", secondary: "324,828,511" },
        { rank: 5, banner: "LoF2", name: "Lords of Fear", leader: "LordFear", members: 30, value: "8,351,646,634", secondary: "278,388,221" },
        { rank: 6, banner: "Horde", name: "Silver Horde.", leader: "Greven", members: 30, value: "8,253,004,976", secondary: "275,100,165" },
        { rank: 7, banner: "ASC", name: "Aerodyne Siege Corporation", leader: "JshWright", members: 30, value: "8,089,284,101", secondary: "269,642,803" },
        { rank: 8, banner: "AL", name: "Armada Lusitana", leader: "Camoes", members: 27, value: "7,894,330,329", secondary: "292,382,604" },
        { rank: 9, banner: "Shin", name: "Shinsengumi", leader: "Dagrim", members: 26, value: "7,670,688,719", secondary: "295,026,489" },
        { rank: 10, banner: "Shin2", name: "Shinsen Gumi", leader: "Ace Lee", members: 30, value: "7,097,978,604", secondary: "236,599,286" },
      ],
      kills: [
        { rank: 1, banner: "Sigma", name: "Sigma Tau Sigma", leader: "Baron Troskey", members: 26, value: "2,226", secondary: "5,434,971,646" },
        { rank: 2, banner: "Shin2", name: "Shinsen Gumi", leader: "Ace Lee", members: 30, value: "2,058", secondary: "7,097,978,604" },
        { rank: 3, banner: "Silver", name: "Silver Horde", leader: "Gryffin", members: 28, value: "1,686", secondary: "9,095,198,335" },
        { rank: 4, banner: "LoF", name: "Lords of Fear", leader: "LordFear", members: 30, value: "1,391", secondary: "8,351,646,634" },
        { rank: 5, banner: "GTG", name: "Galactic Trade Guild", leader: "iYRe", members: 29, value: "1,362", secondary: "9,568,715,286" },
        { rank: 6, banner: "Hark", name: "House Harkonnen", leader: "Ishan", members: 29, value: "960", secondary: "4,913,026,242" },
        { rank: 7, banner: "KAOS", name: "KAOS", leader: "Silkk", members: 26, value: "935", secondary: "4,436,740,743" },
        { rank: 8, banner: "Horde", name: "Silver Horde.", leader: "Greven", members: 30, value: "879", secondary: "8,253,004,976" },
        { rank: 9, banner: "ASC", name: "Aerodyne Siege Corporation", leader: "JshWright", members: 30, value: "826", secondary: "8,089,284,101" },
        { rank: 10, banner: "KAOS2", name: "KAOS.", leader: "ZmaniacZ", members: 29, value: "706", secondary: "3,274,333,492" },
      ],
      pirated: [
        { rank: 1, banner: "Phoenix", name: "Phoenix Talon", leader: "GNU Order", members: 29, value: "244", secondary: "Ships" },
        { rank: 2, banner: "Sigma", name: "Sigma Tau Sigma", leader: "Baron Troskey", members: 26, value: "133", secondary: "Ships" },
        { rank: 3, banner: "GC", name: "Galactic Corsairs", leader: "Pitchoun", members: 23, value: "117", secondary: "Ships" },
        { rank: 4, banner: "ASC", name: "Aerodyne Siege Corporation", leader: "JshWright", members: 30, value: "106", secondary: "Ships" },
        { rank: 5, banner: "Shin2", name: "Shinsen Gumi", leader: "Ace Lee", members: 30, value: "81", secondary: "Ships" },
      ],
      raids: [
        { rank: 1, banner: "ASC", name: "Aerodyne Siege Corporation", leader: "JshWright", members: 30, value: "4,722", secondary: "Ports" },
        { rank: 2, banner: "ASS", name: "Aerodyne Siege Syndicate", leader: "Helios", members: 25, value: "2,626", secondary: "Ports" },
        { rank: 3, banner: "Horde", name: "Silver Horde.", leader: "Exar", members: 28, value: "865", secondary: "Ports" },
        { rank: 4, banner: "Shin", name: "Shinsengumi", leader: "Dagrim", members: 26, value: "758", secondary: "Ports" },
      ]
    },
    players: {
      experience: [
        { rank: 1, banner: "Phoenix", guild: "Phoenix", name: "JUDGE", race: "Tamaran", level: 91, value: "1,391,931,090" },
        { rank: 2, banner: "LoF", guild: "LoF", name: "badmax", race: "Tamaran", level: 80, value: "930,153,285" },
        { rank: 3, banner: "Kiisu", guild: "", name: "Kiisukata", race: "Tamaran", level: 80, value: "925,339,088" },
        { rank: 4, banner: "GC", guild: "GC", name: "Grunvald Jeriko", race: "Tamaran", level: 78, value: "862,112,271" },
        { rank: 5, banner: "GTG", guild: "GTG", name: "zzz", race: "Wraith", level: 76, value: "781,840,267" },
        { rank: 6, banner: "GC", guild: "GC", name: "Pitchoun", race: "Kitaran", level: 76, value: "766,400,231" },
        { rank: 7, banner: "LoF", guild: "LoF", name: "connie", race: "Tamaran", level: 75, value: "752,653,093" },
        { rank: 8, banner: "Horde", guild: "Horde", name: "KANGUR", race: "Tamaran", level: 75, value: "747,796,983" },
        { rank: 9, banner: "LoF", guild: "LoF", name: "Fireball", race: "Kitaran", level: 75, value: "735,146,689" },
        { rank: 10, banner: "GTG", guild: "GTG", name: "Spektor", race: "Kitaran", level: 74, value: "725,053,535" },
      ],
      avg_kills: [
        { rank: 1, banner: "Eix", guild: "", name: "Eix", race: "Zallun", level: 56, value: "52.57", secondary: "7 Kills" },
        { rank: 2, banner: "Shin", guild: "Shin", name: "Ivotsed Iramaga", race: "Wraith", level: 50, value: "50.61", secondary: "18 Kills" },
        { rank: 3, banner: "Scatter", guild: "", name: "Scatterplot", race: "Kitaran", level: 23, value: "47.43", secondary: "7 Kills" },
        { rank: 4, banner: "Phoenix", guild: "Phoenix", name: "Jenkamees", race: "Wraith", level: 68, value: "45.8", secondary: "10 Kills" },
        { rank: 5, banner: "Mike", guild: "", name: "Mike Hunt", race: "Derivian", level: 52, value: "44.35", secondary: "17 Kills" },
      ],
      kills: [
        { rank: 1, banner: "Sigma", guild: "Sigma", name: "louisn", race: "Derivian", level: 49, value: "582", secondary: "15.22 Avg" },
        { rank: 2, banner: "Shin", guild: "Shin", name: "IWNK", race: "Sniv", level: 62, value: "347", secondary: "11.39 Avg" },
        { rank: 3, banner: "Sigma", guild: "Sigma", name: "Baron Troskey", race: "Derivian", level: 53, value: "305", secondary: "13.69 Avg" },
        { rank: 4, banner: "Pete", guild: "", name: "Pete", race: "Derivian", level: 52, value: "298", secondary: "11.06 Avg" },
        { rank: 5, banner: "Shin", guild: "Shin", name: "Kingpin", race: "Derivian", level: 60, value: "276", secondary: "10.3 Avg" },
      ],
      pirated: [
        { rank: 1, banner: "Chech", guild: "Phoenix", name: "Nova Chechman", race: "Kitaran", level: 60, value: "105", secondary: "Ships" },
        { rank: 2, banner: "Sigma", guild: "Sigma", name: "DragonHeart!", race: "Derivian", level: 51, value: "94", secondary: "Ships" },
        { rank: 3, banner: "GC", guild: "GC", name: "CLF", race: "Derivian", level: 65, value: "91", secondary: "Ships" },
        { rank: 4, banner: "Phoenix", guild: "Phoenix", name: "Subversion", race: "Kitaran", level: 51, value: "89", secondary: "Ships" },
        { rank: 5, banner: "YA", guild: "", name: "Grim Reaper", race: "Sniv", level: 72, value: "57", secondary: "Ships" },
      ],
      raids: [
        { rank: 1, banner: "ASC", guild: "ASC", name: "Zodiac", race: "Zallun", level: 40, value: "1,149", secondary: "Ports" },
        { rank: 2, banner: "ASC", guild: "ASC", name: "Helios", race: "Zallun", level: 44, value: "951", secondary: "Ports" },
        { rank: 3, banner: "ASC", guild: "ASC", name: "Parag0n", race: "Derivian", level: 51, value: "919", secondary: "Ports" },
      ]
    }
  },
  {
    id: 'VIII',
    name: 'Round VIII',
    alliances: { experience: [], kills: [], pirated: [], raids: [] },
    players: { experience: [], avg_kills: [], kills: [], pirated: [], raids: [] }
  },
  {
    id: 'IX',
    name: 'Round IX',
    alliances: { experience: [], kills: [], pirated: [], raids: [] },
    players: { experience: [], avg_kills: [], kills: [], pirated: [], raids: [] }
  },
  {
    id: 'X',
    name: 'Round X',
    alliances: { experience: [], kills: [], pirated: [], raids: [] },
    players: { experience: [], avg_kills: [], kills: [], pirated: [], raids: [] }
  },
  {
    id: 'XI',
    name: 'Round XI',
    alliances: { experience: [], kills: [], pirated: [], raids: [] },
    players: { experience: [], avg_kills: [], kills: [], pirated: [], raids: [] }
  }
];
