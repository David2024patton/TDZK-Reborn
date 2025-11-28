
export const EQUIPMENT = [
  // Auras
  { type: "Aura", name: "Baryon Flood Generator", cost: "2,000,000", desc: "Generates Drone Aura in sector." },
  { type: "Aura", name: "Energy Dampening Field", cost: "2,000,000", desc: "Generates Visibility Aura in sector." },
  { type: "Aura", name: "Gravitron Disruption Field", cost: "2,000,000", desc: "Generates Damage Aura in sector." },
  { type: "Aura", name: "Interdiction Field", cost: "2,000,000", desc: "Generates Movement Aura in sector." },
  { type: "Aura", name: "Ion Stream Emitter", cost: "2,000,000", desc: "Generates Repair Aura in sector." },
  { type: "Aura", name: "Positron Collection System", cost: "2,000,000", desc: "Generates Power Aura in sector." },
  { type: "Aura", name: "Radiation Pulse Emitter", cost: "2,000,000", desc: "Generates Accuracy Aura in sector." },
  { type: "Aura", name: "Subspace Anchor Field", cost: "2,000,000", desc: "Generates Jump Aura in sector." },

  // Defensive
  { type: "Defensive", name: "Ablative Armor", cost: "2,000,000", desc: "Reduces Particle weapon effectiveness 25%." },
  { type: "Defensive", name: "Active Defense Grid", cost: "15,000,000", desc: "Reduces Rocket damage by 50%." },
  { type: "Defensive", name: "Angled Armor Plating", cost: "17,500,000", desc: "Reduces Torpedo damage by 50%." },
  { type: "Defensive", name: "Concussive Dampener", cost: "2,000,000", desc: "Reduces Concussive weapon effectiveness 25%." },
  { type: "Defensive", name: "Force Deflector Shields", cost: "17,500,000", desc: "Reduces Cannon damage by 50%." },
  { type: "Defensive", name: "Overflow Shields", cost: "15,000,000", desc: "Reduces Fusion damage by 50%." },
  { type: "Defensive", name: "Refractive Shields", cost: "2,000,000", desc: "Reduces Energy weapon effectiveness 25%." },
  { type: "Defensive", name: "Structural Integrity Field Generator", cost: "2,000,000", desc: "50% chance to dissipate criticals." },

  // Miscellaneous
  { type: "Miscellaneous", name: "Cloaking Device", cost: "5,000,000 * Ship Size", desc: "-100 Visibility, +100 Initiative if undetected." },
  { type: "Miscellaneous", name: "Drone Transponder", cost: "5,000,000 * Ship Size", desc: "50% chance to avoid dropped drones." },
  { type: "Miscellaneous", name: "Extended Ammunition Rack", cost: "12,500,000", desc: "+50% Secondary Weapon ammunition capacity." },
  { type: "Miscellaneous", name: "Scanners", cost: "1,000,000", desc: "+25 scan checks, scan adjacent sectors." },
  { type: "Miscellaneous", name: "Signature Dampener", cost: "5,000,000", desc: "Doubles signature difficulty vs scanners." },
  { type: "Miscellaneous", name: "Signature Scanners", cost: "10,000,000", desc: "Detect/plot starship ion trails." },
  { type: "Miscellaneous", name: "Spatial Rift Generator", cost: "2,000,000", desc: "Negates Anchor/Interdiction, +10 Initiative." },
  { type: "Miscellaneous", name: "Subspace Jump Drive", cost: "2,500,000 * Ship Size", desc: "Jump to any sector in system." },

  // Offensive
  { type: "Offensive", name: "Advanced Homing", cost: "20,000,000", desc: "+20 Accuracy for Missile secondaries." },
  { type: "Offensive", name: "Advanced Reprogramming Module", cost: "7,500,000", desc: "Reprogram 20 drones/turn, auto-reprogram." },
  { type: "Offensive", name: "Armor-Piercing Warheads", cost: "25,000,000", desc: "+50 minimum damage for Torpedoes." },
  { type: "Offensive", name: "Beam Regulators", cost: "25,000,000", desc: "Beam weapons use 40% less Power." },
  { type: "Offensive", name: "Grooved Slugs", cost: "15,000,000", desc: "Projectiles: +20 Acc, +10% Crit, +20 Pen." },
  { type: "Offensive", name: "Harmonic Amplifiers", cost: "20,000,000", desc: "+50% shield/drone damage for Flux/EMP." },
  { type: "Offensive", name: "Mass Driver", cost: "20,000,000", desc: "+25% damage range for Concussion weapons." },
  { type: "Offensive", name: "Particle Accelerator", cost: "20,000,000", desc: "+25% damage range for Particle weapons." },
  { type: "Offensive", name: "Positron Gap Generator", cost: "15,000,000", desc: "Drains power from blocked EMP damage." },
  { type: "Offensive", name: "Proximity Warheads", cost: "25,000,000", desc: "Rockets: +10 Acc, 2x damage." },
  { type: "Offensive", name: "Shaped Charges", cost: "25,000,000", desc: "Fusion: +10% Crit, enables Massive Crits." },
  { type: "Offensive", name: "Singularity Generator", cost: "20,000,000", desc: "Plasma: +10% Crit, 2x Crit Multiplier." },
  { type: "Offensive", name: "Tetra Shells", cost: "10,000,000", desc: "+40 minimum Drone damage for Flak." },
  { type: "Offensive", name: "Trimedadine Laser Lenses", cost: "25,000,000", desc: "Triples all Laser weapon damage." },
  { type: "Offensive", name: "Wave Intensifier", cost: "20,000,000", desc: "+25% damage range for Energy weapons." },

  // Repair & Resource
  { type: "Repair", name: "Energy Transfer Module", cost: "1,000,000", desc: "Recharge ally Shields/Power remotely." },
  { type: "Repair", name: "External Repair Module", cost: "2,000,000 * Ship Size", desc: "+2 Armor repair per drone." },
  { type: "Repair", name: "Internal Repair Module", cost: "25,000,000 * Ship Size", desc: "Auto-repair, +25 recharge rates." },
  { type: "Resourcing", name: "External Resourcing Module", cost: "2,500,000 * Ship Size", desc: "+25 Resourcing rate + size bonus." },
  { type: "Resourcing", name: "Improved Processing Module", cost: "1,000,000", desc: "+2 Resourcing rate per drone." },
  { type: "Resourcing", name: "Micro Extractor Module", cost: "5,000,000", desc: "Converts 3 Ore to 1 Crystal." },
  { type: "Resourcing", name: "Micro Factory Module", cost: "5,000,000", desc: "Converts 2 Precious Metals to Machinery." },
  { type: "Resourcing", name: "Micro Purifier Module", cost: "3,000,000", desc: "Converts 2 Ore to 1 Precious Metal." },
  { type: "Resourcing", name: "Micro Refinery Module", cost: "2,500,000", desc: "Converts 2 Fuel to 1 Chemical." },
  { type: "Resourcing", name: "Resource Scanners", cost: "7,500,000", desc: "Find new goods in resourceable sectors." }
];
