# Walkthrough - Attack Flow Refinement

The attack flow has been refined to streamline player-versus-player combat while maintaining confirmation steps for other interactions.

## Changes

### 1. CenterPanel.tsx
- **Conditional Logic**: Modified `handleTriggerAction` to check if the target is a ship (player).
  - **Player Ships**: Directly triggers `CombatView`, bypassing the "Engage Enemy" modal.
  - **Planets/Others**: Opens the `ActionModal` ("Engage Enemy" / "Tactical Raid") for confirmation.
- **ActionModal Update**: Added `onConfirm` prop to `ActionModal` to allow the "ATTACK" button to trigger the combat sequence.

### 2. CombatView.tsx
- **New Component**: Added a dedicated `CombatView` to display a simulated combat log.
- **Features**:
  - Displays target name and level.
  - Scrolls automatically as new logs appear.
  - Shows a "Close Log" button upon completion.

### 3. SectorView Components
- **ForcesDisplay**: Added `onAttack` prop to trigger attacks on sector forces.
- **PlanetDisplay**: Updated to pass `onAttack` correctly.
- **SectorEntity**: Updated to pass `onRaid` correctly.

## Verification

1. **Player Attack**:
   - Click "Examine" on a ship in the ship list.
   - Click "Attack".
   - **Expected**: The "Engage Enemy" box DOES NOT appear. The Combat Log appears immediately.

2. **Planet Attack**:
   - Locate the Planet display in the sector view.
   - Click "[ATTACK]".
   - **Expected**: The "Engage Enemy" box APPEARS.
   - Click "ATTACK SHIP" (or equivalent button) in the box.
   - **Expected**: The box closes and the Combat Log appears.

3. **Sector Forces Attack**:
   - Locate "Forces in Sector".
   - Click "[ATTACK]".
   - **Expected**: The "Engage Enemy" box APPEARS.
   - Click "ATTACK SHIP" in the box.
   - **Expected**: The box closes and the Combat Log appears.
