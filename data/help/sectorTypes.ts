
export const SECTOR_TYPES = {
  types: [
    { name: "Deep Space", visibility: "100%", resources: "None", desc: "By far the most common sector type, these sectors are just your ordinary hunk of space, with very little in the way to obscure visibility or provide resources." },
    { name: "Solar Orbit", visibility: "120%", resources: "None", desc: "Ships in these sectors are in a relatively low solar orbit, where visibility is high and so are the temperatures. The only resources here are those that can survive the extreme heat; which is to say, almost nothing." },
    { name: "Asteroid Cluster", visibility: "40%", resources: "Ore (Excellent), Precious Metals (Good), Crystal (Fair)", desc: "Asteroids are the best place to find raw ore, but resourcers should be wary of collisions and low visibility conditions." },
    { name: "Dust Cloud", visibility: "60%", resources: "Ore (Good), Precious Metals (Fair), Crystal (Poor)", desc: "It's not the prettiest of sectors to be in, but dust clouds provide decent amounts of Ore and Precious Metals, though visibility is slightly murky." },
    { name: "Gas Cloud", visibility: "80%", resources: "Fuel (Good), Chemicals (Poor)", desc: "Ships should be careful not to ignite the Fuel in gas clouds, because there's plenty of it, though they're not much good for anything else." },
    { name: "Nebula", visibility: "0%", resources: "Fuel (Excellent), Chemicals (Fair), Ore (Fair), Precious Metals (Fair), Crystal (Poor)", desc: "The most beautiful of all the sector types, nebulas come with a price: with absolutely no visibility, it is hard to detect hostile ships. Of course, it's also easy to hide from hostile ships as well." },
    { name: "Debris Field", visibility: "20%", resources: "Machinery (Good), Precious Metals (Fair), Electronics (Poor), Crystal (Lousy)", desc: "These are the remains of ancient battlefields, destroyed ports and stations, and unknown relics. With the sheer amount of debris here, you'd be hard pressed to see anything but junk, though there is plenty of that to salvage." },
    { name: "Subspace Portal", visibility: "Unknown", resources: "Unknown", desc: "Legends tell of rare sectors that contain subspace portals: places where you can use your Subspace Jump Drive to jump to any sector in the known galaxy." }
  ],
  subtypes: [
    { name: "Ionized Particles (Dark Red)", effect: "Positive Accuracy Aura", desc: "Decreases accuracy of normal weapons (not drones) by 10. Leaks to adjacent sectors. Can be stacked with an artificial equivalent." },
    { name: "Incandescent Particles (Light Red)", effect: "Negative Accuracy Aura", desc: "Increases accuracy of normal weapons (not drones) by 10. Leaks to adjacent sectors. Can be stacked with an artificial equivalent." },
    { name: "Micro Singularity (Purple)", effect: "Jump Aura", desc: "Gives 50% chance of Subspace Jump Drive failures, leaks to adjacent sectors and gives 25% failure chance in those leaked sectors. Cannot be stacked with an artificial equivalent." },
    { name: "Gravity Well (Blue)", effect: "Movement Aura", desc: "Gives 50% chance of movement failure, leaks to adjacent sector and gives 25% failure chance in those sectors. Cannot be stacked with an artificial equivalent." },
    { name: "Dark Matter Cluster (Dark Grey)", effect: "Positive Visibility Aura", desc: "Decreases visibility in the sector by 10%. Leaks to adjacent sectors. Can be stacked with an artificial equivalent." },
    { name: "Radiation Belt (Light Grey)", effect: "Negative Visibility Aura", desc: "Increases visibility in the sector by 10%. Leaks to adjacent sectors. Can be stacked with an artificial equivalent." },
    { name: "Free Electrons (Yellow)", effect: "Positive Power Aura", desc: "Increases power requirements by 10%. Leaks to adjacent sectors. Can be stacked with an artificial equivalent." },
    { name: "Free Positrons (Dark Green)", effect: "Negative Power Aura", desc: "Decreases power requirements by 10%. Leaks to adjacent sectors. Can be stacked with an artificial equivalent." },
    { name: "Energized Fuel Particles (Turquoise)", effect: "Speed Aura", desc: "Decreases the turn cost of normal movement by 1. Does not leak to adjacent sectors. No artificial equivalent." },
    { name: "Normal", effect: "None", desc: "A normal sector has no aura effects." }
  ]
};
