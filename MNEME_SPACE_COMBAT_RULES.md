# Mneme Space Combat Rules

**Source:** [wiki.gi7b.org](https://wiki.gi7b.org/index.php/Mneme_CE_Space_Combat)  
**Author:** Justin Aquino (Game in the Brain)  
**System:** Variant rules for Cepheus Engine SRD  

---

## Table of Contents

1. [Introduction & Summary of Changes](#chapter-1-introduction)
2. [Ship Design](#chapter-2-ship-design)
3. [Crew Functions](#chapter-3-crew-functions)
4. [Combat Mechanics](#chapter-4-combat-mechanics)
5. [Actions](#chapter-5-actions)
6. [Reactions](#chapter-6-reactions)
7. [Damage and Morale](#chapter-7-damage-and-morale)
8. [Definitions and Tables](#chapter-8-definitions-and-tables)

---

## Chapter 1: Introduction

### Overview

Mneme Space Combat is a variant rule set for the Cepheus Engine system, designed to streamline space combat while maintaining tactical depth and narrative excitement.

### Key Features

- **Use of a Map** — Track ship positions and movement during encounters
- **Order of Turns** — Initiative-based action sequencing
- **Clarified Encounter and Combat Ranges** — Precise definitions of engagement distances
- **Grouping Rolls** — Streamlined mechanics for handling multiple ships or attacks
- **Only Players Roll** — Reduces Referee workload

### Summary of Changes from Cepheus Engine SRD

#### Core Task Resolution Changes

| Change | Mneme | CE RAW |
|--------|-------|--------|
| **Target Number (TN)** | Typically 8+, varies by circumstance | Same base, different calculation |
| **Effect Calculation** | DR + DM - TN = Effect (min 1 on success) | Standard effect calculation |
| **Opposed Checks** | Players roll against TN = 8 + Adversary's DM | Both parties roll |
| **Success Effect** | Minimum Effect of 1 on any success | Effect 0 is a success |
| **Double Effect** | Natural 12 doubles positive, Natural 2 doubles negative | No doubling |

#### Superiority System

A dice modifier based on relative force strength:

| DM | Example | Ratio |
|----|---------|-------|
| DM+1 | 400DT corvette + 400DT merchant vs 800DT raiders | 2:1 |
| DM+2 | Pair of 20DT fighters vs 100DT scout | 3:1 |
| DM+3 | Q-ship vs 6 armed freetraders | 5:1 |
| DM+4 | Carrier strike group vs lone carrier | 7:1 |
| DM+5 | Missile squadron vs battered raider | 10:1 |
| DM+6 | Full battle group vs single destroyer | Overwhelming |

#### Ship Design Changes

- **Bridge Stations** — 1 station per Dton of bridge capacity
- **Additional Sensors** — Constrained by bridge stations
- **Life Pods** — 1 Dton lifepods hold 3 adults
- **Bridge Space** — Can be traded for amenities

---

## Chapter 2: Ship Design

### Ship Components Overview

Ships are built from modular components. Each serves a specific function and contributes to the ship's overall capabilities.

### Hulls

**Hull Configuration:**
- **Standard**: Atmospheric operations suffer -2 DM. Can mount Fuel Scoops but DM-2.
- **Streamlined**: No penalty in Atmosphere Operations.

**Hull Armor:**
- Titanium Steel TL7+: Armor-2 baseline
- Additional armor reduces available Dtons and increases cost

**Hull Code Reference:**

| Hull Code | Dtons | Base Cost |
|-----------|-------|-----------|
| CODE-1 | 100 | 2,000,000 Cr |
| CODE-2 | 200 | 8,000,000 Cr |
| CODE-3 | 300 | 12,000,000 Cr |
| CODE-4 | 400 | 16,000,000 Cr |
| CODE-6 | 600 | 48,000,000 Cr |

### Drives

**M-Drive (Maneuver Drive)** — TL9+ Models:
- MODEL-A: Thrust-2, -2 Dtons, 4,000,000 Cr
- MODEL-B: Thrust-4, -3 Dtons, 8,000,000 Cr
- MODEL-C: Thrust-3, -5 Dtons, 12,000,000 Cr
- MODEL-F: Thrust-3, -11 Dtons, 24,000,000 Cr
- MODEL-H: Thrust-4, -15 Dtons, 32,000,000 Cr
- MODEL-M: Thrust-4/6, -23 Dtons, 48,000,000 Cr

**J-Drive (Jump Drive)** — TL9+ Models:
- MODEL-A: 20DT/jump Jump-1 or Jump-2, -10 Dtons, 10,000,000 Cr
- MODEL-B: 40DT/jump Jump-1, -15 Dtons, 20,000,000 Cr
- MODEL-C: 60DT/jump Jump-3, -20 Dtons, 30,000,000 Cr
- MODEL-D: 60DT/jump Jump-1, -25 Dtons, 40,000,000 Cr

### Power Plants

| Model | Fuel/Wk | Dtons | Cost |
|-------|---------|-------|------|
| MODEL-A | 1DT | -4 | 8,000,000 Cr |
| MODEL-B | 2DT | -7 | 16,000,000 Cr |
| MODEL-C | 3DT | -10 | 24,000,000 Cr |
| MODEL-F | 6DT | -19 | 48,000,000 Cr |
| MODEL-H | 8DT | -25 | 64,000,000 Cr |
| MODEL-M | 12DT | -37 | 96,000,000 Cr |

### Bridges and Controls

**Bridge Capacity:** 1 station per Dton of bridge. 10-ton bridge = 10 crew stations.

**Standard Stations:** Captain, NavComm, Engineering, Pilot, Gunners (1 per fire control system).

**Trading Bridge Space:** Can be sacrificed for ship components at no additional cost (Briefing Room, Locker, Luxuries).

### Computers

| Model | Rating | Notes | Cost |
|-------|--------|-------|------|
| M1 | R5 | J-Spec Hardened | 60,000 Cr |
| M2 | R10 | Hardened | 240,000 Cr |

- Rating determines max program rating
- Can run Rating number of programs simultaneously
- Interface Rating 0 doesn't count against total

### Sensors

| Sensor Type | TL8 | TL9 | TL10 | TL11 | TL12 |
|-------------|-----|-----|------|------|------|
| Standard | 0.5DT/25K | 0.5DT/25K | 0.5DT/25K | 0.5DT/25K | 0.5DT/25K |
| Basic Civilian | 3DT/250K | 1DT/50K | 1DT/50K | — | — |

---

## Chapter 3: Crew Functions

### Overview

A character's Function determines when they act, the sort of actions they can do, and what they can react to. Functions are divided into Major, Assistant, and Automated.

### Major Functions

#### Captain

| Aspect | Detail |
|--------|--------|
| **Role** | Leading the ship and its crew |
| **Limitation** | Only one captain per ship/side |
| **Crew Management** | Handles up to 5 crew with no penalty, -1 per additional 5 |
| **Key Skills** | Leadership |

#### NavComm (Navigation/Communications)

| Aspect | Detail |
|--------|--------|
| **Role** | Sensors and electronic transmissions |
| **Limitation** | Up to number of Sensor or Comms stations (whichever is lower) |
| **Key Skills** | Comms-Sensors, Electronics, Computer |

#### Engineer

| Aspect | Detail |
|--------|--------|
| **Role** | Keeping ship systems running |
| **Limitation** | 1 station per 3.5DT of Drives and Powerplant |
| **Key Skills** | Engineering, Mechanics |

#### Pilot

| Aspect | Detail |
|--------|--------|
| **Role** | Flying the ship |
| **Limitation** | Only one pilot per ship |
| **Key Skills** | Piloting, Navigation |

#### Gunner

| Aspect | Detail |
|--------|--------|
| **Role** | Operates weapons and defenses |
| **Limitation** | Up to number of Fire Control Systems |
| **Key Skills** | Gunnery, Turret, Bay Weapons |

### Assistant Functions

Don't roll or get actions — complement a Major Function:

- **Captain's Assistant** (Leadership 0 required)
- **Copilot**
- **NavComm Assistant**
- **Engineering Assistant**
- **Gunner's Mate**

### Automated Functions

- **Fire Control Programs**: Act as gunners (1-5 MCr per gun)
- **Auto-Repair with Drones**: Acts as engineer (requires 1% of ship Dtons in drones)
- **Intellect + Expert Programs**: Effective Characteristic 8, DM+0, Skill 0
- **Limitations**: No starting Reaction, takes a Minor Action to instruct

### Action Limits by Function

| Function Type | Minor Actions | Significant Actions | Reactions |
|---------------|:------------:|:------------------:|:---------:|
| Major Function | 3 | 1 | 1 |
| Assistant Function | 0 | 0 | 0 (supports only) |
| Automated Function | 3 | 1 | 0 (can Prepare) |

---

## Chapter 4: Combat Mechanics

### Overview

Each turn represents ~1 kilosecond (1,000 seconds / ~17 minutes) of game time. Each vessel has individual Initiative and acts in descending order.

### Initiative System

**Initiative Modifiers:**

| Condition | Modifier |
|-----------|:--------:|
| Organization/Confidence of crew | Varies |
| Intelligence/Social + Leadership/Admin | Combined bonus |
| Lowest thrust > opponent's | +1 |
| No accepted leader | -2 |
| Encounter setup Effect | Applied |

**Dynamic Initiative:** May be adjusted up and down by actions/reactions during a turn.

### Turn Order (Phases)

| Phase | Function | Actions Available |
|:-----:|----------|:-----------------:|
| 1 | Captain | Significant, Minor |
| 2 | NavComm | Significant, Minor |
| 3 | Engineer | Significant, Minor |
| 4 | Pilot | Significant, Minor |
| 5 | Gunner | Significant, Minor |
| 6 | Everyone Else | Minor only |

### Action Types

| Action | Cost | Description |
|--------|:----:|-------------|
| **Minor (MA)** | 1 | Basic movement, communication, system check |
| **Significant (SA)** | 2 MA | Attack, jamming, command, activate jump |
| **Focused (FA)** | All 3 + Reaction | Better success, no reactions after |
| **Reaction (RA)** | 1 free/turn | Response to enemy actions |

### Range Bands

| Range | Distance | Spaces | Notes |
|-------|----------|:------:|-------|
| Adjacent (AD) | <1 km | 0 | Ramming range |
| Close (CL) | 1 km | 1 | Sand casters max |
| Short (SH) | 10 km | 1 | Pulse lasers max |
| Medium (M) | 1,250 km | 2-9 | Beam lasers effective |
| Long (L) | 10,000 km | 10-24 | Particle beams effective |
| Very Long (VL) | 25,000 km | 25-49 | Meson guns effective |
| Distant (D) | 50,000 km+ | 50+ | Missiles only |

**Weapon Range Modifiers:**
- DM+2 at closer than noted range
- DM-2 at one band further
- Cannot use beyond one band more than noted range

### Thrust Points (TP)

Ship has TP equal to its Thrust rating. Each TP moves one space (~1,000 km).

**Movement Costs:**

| Range Change | Thrust Cost | Cumulative |
|-------------|:-----------:|:----------:|
| Adjacent ↔ Close | 0 | 0 |
| Close ↔ Short | 1 | 1 |
| Short ↔ Medium | 2 | 3 |
| Medium ↔ Long | 5 | 8 |
| Long ↔ Very Long | 10 | 18 |
| Very Long ↔ Distant | 20 | 38 |

**Missile Thrust:** Standard 10 TP; +3 TP on first round if bay-launched.

### Core Task Resolution

**Target Number:** TN = 8 (Base) + Adversary's DM

**Effect Calculation:** DR + DM - TN = Effect (minimum 1 on success)

**Double Effect:**
- Natural 12: Double positive effect, halve negative
- Natural 2: Double negative effect, halve positive

---

## Chapter 5: Actions

### Captain Phase (1)

**Significant Actions:**
- **Command** — Leadership roll; distribute Effect as DM+1 to actions supporting the plan
- **Coordinate** — Leadership roll; distribute Effect as DM+1 to crew members
- **Inspire** — Rally crew after failed Morale roll
- **Rush** — Tactics roll; Effect adds to current Initiative

**Minor Actions:**
- Perform NavComm minor action
- Secure System
- Assist other functions

### NavComm Phase (2)

**Significant Actions:**
- **Break Target Lock** — Opposed roll vs enemy NavComm
- **Disable Missile/Drone** — Effect determines number disabled
- **Plot Jump Point** — Calculate FTL coordinates
- **Directed Scan** — Focused sensor sweep
- **Hack System** — Requires compromised system
- **Jam Signal** — Electronic interference

**Minor Actions:**
- Sensor targeting (DM+1 to Gunner)
- Monitor channels
- Data relay

### Engineering Phase (3)

**Significant Actions:**
- **Activate Jump** — FTL activation (penalty if no plotted jump point)
- **Damage Control** — Recover 1-10% of component's HP
- **Go Dark** — Dump heat/fuel, become untargetable
- **Start Up** — Bring systems back online
- **Optimize** — Boost a function's performance (DM+1 minimum)
- **Red Line** — Consume spare parts for temporary performance boost

**Minor Actions:**
- System diagnostics
- Reroute power
- Emergency repairs

### Pilot Phase (4)

**Significant Actions:**
- **Evade** — Increase TN to hit by half Effect (min +1)
- **Attack (Ram)** — Opposed Piloting; damage = 1D6 per 10DT
- **Dock/Land** — Connect with vessel or facility
- **Full Burn** — Maximum thrust

### Gunner Phase (5)

**Significant Actions:**
- **Direct Attack** — Standard weapon fire
- **Attack Group** — Fire at a group (spread damage, lower TN)
- **Control Missile/Drone** — Guide projectiles
- **Launch/Maneuver Missiles** — Deploy and position
- **Missile Attack** — Attack with missile (opposed roll)
- **Proximity Explosion** — Area damage option
- **Ram** — Missile/drone ramming attack

---

## Chapter 6: Reactions

### Standard Reactions

| Reaction | Function | Trigger | Effect |
|----------|----------|---------|--------|
| Initiative for Reaction | Captain | When needed | Sacrifice 2 init for extra reaction |
| Aiding Another | Any | Ally needs help | Grant DM+1 |
| Opposing a Roll | Any | Opponent acts | Contest at DM+0 |
| Point Defense | Gunner | Missile/Drone in range | Destroy projectiles |
| Cast Sand | Gunner | Beam attack incoming | Reduce beam damage |
| Dodge | Pilot | Attack incoming | Avoid ALL damage |
| Go Ballistic | Pilot | When appropriate | Enter ballistic mode |
| Damage Control | Engineer | System damaged | Recover HP |
| Manage Morale | Captain | Morale failing | Restore morale |

### Key Reaction Details

**Point Defense:** Effect determines number of missiles/drones destroyed. Multiple weapons can combine through MAC rules.

**Dodge:** Avoids ALL damage from the attack on success. TN = attacker's Gunner DM.

**Damage Control:** Recover 1 HP up to 10% of component's HP. On failure, can spend 10x materials or shut down related system.

**Prepare Reactions:**
- **Prepare (Minor):** Spend MA for extra reaction at DM-1
- **Prepare (Significant):** Spend SA for extra reaction at DM+1, or improve single reaction to DM+2

---

## Chapter 7: Damage and Morale

### Hit Point Calculation

| Component | HP Formula |
|-----------|------------|
| **Hull** | **10% of ship's Dtons** |
| **Structure** | **10% of ship's Dtons** |
| **Other Components** | **Equal to their Dtons** |

**Example:** 200DT ship → Hull = 20 HP, Structure = 20 HP; 10DT Bridge = 10 HP; 15DT J-Drive = 15 HP.

### Damage Calculation

```
Total Damage = Base Weapon Damage + Effect + MAC - Armor
```

**MAC Bonus:** Multiple Attack Consolidation grants DM bonus and extra damage dice.

### Damage Resolution

Resolve effects at the end of the round when all functions have rolled.

**Maximum Damage Rule:** Most damage a ship can take = all Dtons of Components before destroyed. If structure is depleted, the ship is destroyed.

### Damage States

| State | HP Level | Effect |
|-------|:--------:|--------|
| **Damaged** | 50% HP | System impaired, DM-2 to related rolls |
| **Disabled** | 100% HP | System non-functional |
| **Destroyed** | Excess | Destroyed, damage spills over |

**Spillover Rules:**
- Armor → Hull
- Hull → Structure
- Other components → Structure (most cases)

### Component Damage Effects

| Component | Damaged (50%) | Disabled (100%) |
|-----------|---------------|-----------------|
| Hull | Breached, leaking 1 man-day/turn/dmg | Only pods have atmosphere |
| Structure | DM-2 to Piloting | 1D6 dmg/turn to Hull & Structure |
| Turret | Attacks DM-2 | Weapon disabled |
| J-Drive | Jump DM-2 | Disabled |
| M-Drive | Thrust -1 | Thrust -50% |
| Power Plant | Crew radiation hit | Emergency power only |
| Sensors | DM-2 Comms | Cannot target beyond Adjacent |
| Bridge | Crew normal hit | No Pilot/Sensor actions |
| Fuel | Leak 1D6 tons/hour | Destroy 1D6×10%, leak 1D6/turn |

### Crew Damage

| Roll (2D6) | Normal Damage | Radiation Damage |
|:----------:|--------------|------------------|
| 4 or less | Lucky escape | Lucky escape |
| 5-8 | 2D6 to one crew | 2D6×10 rads to one crew |
| 9-10 | 4D6 to one crew | 4D6×10 rads to one crew |
| 11 | 2D6 to all crew | 2D6×10 rads to all crew |
| 12 | 4D6 to all crew | 4D6×10 rads to all crew |

**Triggers:** Power Plant hits, Bridge hits, Meson Guns, Fusion/Particle/Nuclear weapons

### Morale Mechanics

| Roll (2D6) | Disposition | Effect |
|:----------:|-------------|--------|
| 12-11 | Committed | DM+2 in one Function per Turn |
| 10-9 | Resolved | DM+1 in one Function per Turn |
| 8-7 | Indifferent | No penalty |
| 6-5 | Cowed | DM-1 to coordination OR lose Minor Action |
| 4-2 | Panicked | All Minor Actions in conflict or fleeing |

**Morale Triggers:** Significant losses, 50%+ Hull/Structure damage, 3+ systems disabled, captain incapacitated, overwhelming enemy superiority.

---

## Chapter 8: Definitions and Tables

### Attack Difficulties by Range

| Weapon | Adjacent | Close | Short | Medium | Long | Very Long |
|--------|:--------:|:-----:|:-----:|:------:|:----:|:---------:|
| Pulse Laser (T) | DM+2/6+ | DM+0/8+ | DM-2/10+ | — | — | — |
| Beam Laser (T) | DM+2/6+ | DM+2/6+ | DM+2/6+ | DM+0/8+ | DM-2/10+ | — |
| Particle Beam | DM+2/6+ | DM+2/6+ | DM+2/6+ | DM+2/6+ | DM+0/8+ | DM-2/10+ |
| Fusion Gun | DM+2/6+ | DM+2/6+ | DM+2/6+ | DM+0/8+ | DM-2/10+ | — |
| Meson Gun | DM+2/6+ | DM+2/6+ | DM+2/6+ | DM+2/6+ | DM+0/8+ | DM-2/10+ |
| Sandcaster | DM+2/6+ | DM+0/8+ | DM-2/10+ | — | — | — |

### Hit Location Table

| Roll (2D6) | External Hit | Internal Hit (Hull Breached) |
|:----------:|-------------|------------------------------|
| 2 | Structure | Hull |
| 3 | Power Plant | Power Plant |
| 4 | J-Drive | Hold/Vehicle bay |
| 5 | Bay | Fuel |
| 6 | Structure | Hull |
| 7 | Crew | Armor |
| 8 | Structure | Hull |
| 9 | Hold/Vehicle Bay | Turret |
| 10 | J-Drive | M-Drive |
| 11 | Power Plant | Crew |
| 12 | Bridge | Bridge |

### Multiple Attack Consolidation (MAC)

| Attacks | Attack DM | Extra Damage |
|:-------:|:---------:|:------------:|
| 1 | DM+0 | +0 |
| 2 | DM+1 | +1 point |
| 5 | DM+1 | +1D6 |
| 10 | DM+2 | +2D6 |
| 20 | DM+3 | +3D6 |
| 50 | DM+4 | +4D6 |
| 100 | DM+5 | +5D6 |
| 200 | DM+6 | +6D6 |
| 500+ | DM+7 | +7D6 |

**Doubling Rule:** Double attacks = increase DM+1 and damage +1D6.

### Weapon Damage Summary

| Weapon | TL | Mount | Range | Damage | Notes |
|--------|:--:|:-----:|:-----:|:------:|-------|
| Sandcaster | 6 | Turret | Close | Special | Ammo: 0.01 MCr/DTon (20 shots) |
| Missile Rack | 6 | Turret | Distant | Per missile | 0.75 MCr |
| Missile Bank | 6 | Bay | Distant | Per missile | 12 MCr, fires 12 at a time |
| Standard Missile | 6 | — | Distant | 1D6 | 0.00125 MCr, 12/DTon |
| Smart Missile | 8 | — | Distant | 1D6 | 0.0025 MCr, 12/DTon |
| Nuclear Missile | 6 | — | Distant | 2D6+1 rad | 0.00375 MCr, 12/DTon |
| Pulse Laser | 7 | Turret | Close | 2D6 | DM-2 to attack |
| Beam Laser | 9 | Turret | Medium | 1D6 | — |
| Particle Beam (T) | 8 | Turret | Long | 3D6+1 rad | — |
| Particle Beam (Bay) | 8 | Bay | Long | 6D6+1 rad | — |
| Fusion Gun | 12 | Bay | Medium | 5D6 | — |
| Meson Gun | 11 | Bay | Long | 5D6+1 rad | Ignores armor |

---

## Key Differences: Mneme vs CE RAW

| Area | Mneme | CE RAW |
|------|-------|--------|
| **Hit Points** | Hull/Structure = 10% of Dtons; Components = their Dtons | Hull = floor(Dtons/50); Structure = ceil(Dtons/50) |
| **Damage Resolution** | Threshold-based (compare damage to HP for condition) | Subtraction tracking |
| **Missile Attacks** | 1 roll, same-turn attack possible | 2 rolls (launch + strike), must wait next turn |
| **Point Defense** | Opposed roll, single roll vs groups | Separate roll per missile |
| **Missile Range** | Max 40,000 km | Open-ended (Distant = 50,000 km+) |
| **Smart Missiles** | DM+1, complex instructions | Always hit on 8+ unmodified |
| **Bridge Stations** | 1 station per Dton | Fixed sizes (10t, 20t, 40t, 60t) |
| **NavComm Skill** | Comms skill | Electronics skill |
| **Life Pods** | 1 Dton per 3 adults | 0.5 tons per passenger |
| **Superiority System** | DM based on force ratio | Not present |
| **Only Players Roll** | Yes (TN = 8 + adversary DM) | Both sides roll |
| **Actions per Turn** | 3 Minor, 1 Significant (costs 2 MA), 1 Reaction | Standard CE action economy |
| **Damage Simultaneity** | All damage resolved at end of round | Sequential resolution |

---

*Source: https://wiki.gi7b.org/index.php/Mneme_CE_Space_Combat*  
*Retrieved: 2026-04-28*
