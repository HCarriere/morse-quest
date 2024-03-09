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
    - You increment stats as you play (intelligence for mages, strengh for warriors ...)
    - You unlock class skills during the run
- Classes
    - Summoner (add alied summons (IA Based) on turn order ?)


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
- [ ] Encounter spawners ?
- [ ] Enemy agro & follow player
- [ ] Buffs / Debuffs
- [ ] Improve fight interface (floating numbers, layout, etc)
- [ ] Improve enemy AI
- [ ] Inventory
- [ ] Player death
- [ ] Activables (traps, enigmas ...)
- [ ] Shops
- [ ] Hub
- [ ] Saves
- [ ] Sprites
- [ ] Pathfinding
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