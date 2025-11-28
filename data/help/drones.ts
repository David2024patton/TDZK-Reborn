
export const DRONES = [
  { name: "Scout Drones", stats: { combat: 0, armor: 15, emp: 0 }, limit: 50, description: "Increases chance of finding ships/resources." },
  { name: "Combat Drones", stats: { combat: 10, armor: 10, emp: 0 }, limit: 50, description: "Standard offensive and defensive drone unit." },
  { name: "Shield Drones", stats: { combat: 0, armor: 14, emp: 0 }, limit: 25, description: "Defensive drone, takes damage first." },
  { name: "Resource Drones", stats: { combat: 0, armor: 8, emp: 0 }, limit: 10, description: "Collects additional resources per turn." },
  { name: "Repair Drones", stats: { combat: 0, armor: 10, emp: 0 }, limit: 20, description: "Repairs armor of alliance ships." },
  { name: "Mine Drones", stats: { combat: 50, armor: 10, emp: 0 }, limit: 25, description: "Explodes on contact when dropped." },
  { name: "EMP Drones", stats: { combat: 5, armor: 5, emp: "1-3" }, limit: 50, description: "Deals EMP damage, drains power." }
];
