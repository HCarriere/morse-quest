# About
A js game. Some requirement are needed, see below.

# Requirements

- a `<canvas id="morsequest">` tag
- implement correctly the following methods : 
TODO
- see test/index.html

# Tests

https://hcarriere.github.io/morse-quest/

# Game

- RPG
- 2D, above view
- There are enemies, treasures, merchants
- Maps are handcrafted
- Other players can be seen on the map, as ghosts
- Combat is turn based
    - Encounters are :
        - fights
            - level based
            - biome based
            - static (bosses ...)
        - random events ?
- Player is assigned a name & can chose between few class at startup
- Roguelite
    - You can keep only N new equipments on run end (keeping the already unlocked)
    - Usable items are deleted on run end
    - Gold is deleted on run start
    - Gold is used on equipment & usable items
    - You unlock class skills during the run, from a random pool (choose 1 from 3)
    - You use gold to level up your stats
- Mechanics
    - You can move on the map
    - When the enemy spot you they move toward you
    - After a fight, you have a reward : gold, XP, items, permanent unlocks
    - A storm move from left to right after a few turns
    - If the storm catches the player, there is a fight against a (too) big enemy
- Level design
    - Maps shoud have 1 start, and at least 1 end
    - They should be short and have :
        - fights
        - treasures
        - curiosities (event with choices)
- Classes
    - Summoner (add alied summons (IA Based) on turn order ?)
    - Lardomancien


# TODO
# Base Game
- [x] Simple Map
- [x] Simple Player
- [x] Moving on map (collision, camera)
- [x] Interface: buttons
- [x] Interface: Dialogues
- [x] Multiple maps and teleports
- [x] VERY Simple fight
- [x] Simple fight (hit selections)
- [ ] Interface: Character sheet
- [ ] Simple Classes & skills
- [ ] Inventory
- [ ] Encounter spawners ?
- [ ] Pathfinding
- [ ] Enemy agro & follow player
- [ ] Buffs / Debuffs
- [ ] Spell cooldowns
- [ ] Improve fight interface (floating numbers, layout, etc)
- [ ] Fight reward screen
- [ ] Improve enemy AI
- [ ] Player death
- [ ] Activables (traps, enigmas ...)
- [ ] Movements, item weights, iminent death
- [ ] Shops
- [ ] Hub
- [ ] Saves
- [ ] Sprites
## Real content
- [ ] Build real map
- [ ] Multiple classes
- [ ] Multiple enemies
- [ ] Spells animation
- [ ] Multiple spells
- [ ] Balancing
## QoL
- [ ] Cool animated splashscreen (with particles)
- [ ] Display other players



# Contributors

- H. Carriere
- A. Dousselin

# Testers

- Bureau 118