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



# Help
- Icons are (for now) emoji & web symbols. Use https://symbl.cc/
- Spells Icons are alchemic symbols https://symbl.cc/fr/unicode/blocks/alchemical-symbols/ 


# TODO
## Base Game
- [x] Simple Map
- [x] Simple Player
- [x] Moving on map (collision, camera)
- [x] Interface: buttons
- [x] Interface: Dialogues
- [x] Multiple maps and teleports
- [x] VERY Simple fight
- [x] Simple fight (hit selections)
- [x] Interface: Character sheet
- [ ] Combat mechanics
    - [x] Multiple attacks per round (mana gestion)
    - [x] Spells cooldown
    - [x] Buffs / Debuffs
    - [ ] Fight reward interface.
        - random XP
        - random gold
        - random item
    - [ ] Simple Class
    - [ ] Improve fight interface (floating numbers, etc) => implement ParticleProcessor 
    - [ ] Random events every few turns ? (buff / debuff / action ...)
- [ ] Player capabilities
    - [ ] Level up interface.
        Random between : 
        - spells from the class pool
        - a stat up (hp, energy, slots ...)
    - [ ] Inventory
    - [ ] Equipment
    - [ ] Usables
    - [ ] Keys ?
- [ ] World
    - [ ] Map builder
    - [ ] Player death
    - [ ] Encounter spawners ? random ? handcrafted ?
    - [ ] Pathfinding
    - [ ] Enemy agro & follow player
    - [ ] Activables (traps, enigmas, locked doors ...)
    - [ ] Iminent death
    - [ ] Saves
- [ ] Hub
    - [ ] Shops
- [ ] Improvements
    - [ ] Player sprite
    - [ ] Improve enemy combat AI
    - [ ] Music ? oscilloscope js generated
    - [ ] Documentation: create spells
    - [ ] Documentation: create skills
    - [ ] Documentation: create classes
    - [ ] Documentation: create items
    - [ ] Documentation: create enemies
- [ ] Technical
    - [ ] Lose size
        - [ ] Mangling
        - [ ] Graphics.ctx / GameGraphics.ctx ==> G.ctx

## Content
- [ ] Balancing
- [ ] Maps
- [ ] Classes
    - [ ] Metalomancien
        - Manipule le metal sous toutes ses formes.
        - Classe simple, pas de flavor particulière.
    - [ ] Pyromancien
        - Manipule le feu.
        - Peu de défense, mais beaucoup d'attaque.
        - Inflige un debuff 'brulure'.
    - [ ] Briquomancien
        - Manipule la terre, et les briques.
        - Défensif, utilise un buff 'Mur de brique' pour ses sorts.
    - [ ] Lardomancien
        - Manipule le gras, et les lardons.
        - Faible puissance, mais gagne en puissance au long du combat avec ses buffs.
- [ ] Enemies
- [ ] Spells
- [ ] Skills
- [ ] Buffs/Debuffs
    - [x] Protection
    - [ ] Brulure: DOT
- [ ] Items

## QoL
- [ ] Cool animated splashscreen (with particles)
- [ ] Display other players



# Contributors

- H. Carriere
- A. Dousselin

# Testers

- Bureau 118