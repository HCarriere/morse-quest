import { Camera } from "./Camera";
import { GameController } from "./GameController";
import { Coordinates, GameMap } from "./GameMap";
import { EngineObject } from "../core/EngineObject";
import { GameInterface } from "@game/interface/GameInterface";
import { GameGraphics } from "./GameGraphics";
import { GameStats } from "@game/content/GameStats";
import { Reward } from "@game/content/Reward";
import { Class, ClassElementalSorcerer } from "@game/content/classes";
import { Pool } from "@game/core/Pool";

/**
 * Represents the player
 */
export class Player extends EngineObject {
    

    public static stats: GameStats;
    public static class: Class;

    public static availableClasses: Class[] = [
        new ClassElementalSorcerer(),
    ];
    public static classPool: Pool<Class> = Pool.fromArray(this.availableClasses, 'Class Pool');

    // public static location: Coordinates;

    // map coordinates
    public static x: number;
    public static y: number;

    public static xp = 0;
    public static targetXp: number;
    public static level = 1;
    public static gold = 0;

    /**
     * used for animation
     */
    private static tilt = 0;

    public init() {
        Player.targetXp = Player.requiredExperienceToLevelUp();
    }

    public static setClass(playerClass: Class): void {
        this.class = playerClass;
        this.class.init();
        this.stats = new GameStats(playerClass.initialSpells, playerClass.baseHealth);
        this.stats.healFullHp();
        for (let index = 0; index < playerClass.initialSpells.length; index++) {
            this.stats.selectActiveSpell(index);
        }
        if (playerClass.skills.length > 0) this.stats.skills.push(...playerClass.skills[0]);
    }

    /**
     * Teleport on coordinates
     * @param x 
     * @param y 
     * @param mapId optional, specify it to teleport on another map
     */
    public static teleport(coordinates?: Coordinates, mapId?: string) {
        if (mapId) {
            GameMap.loadMap(mapId);
        }

        if (!coordinates) {
            coordinates = GameMap.getRandomSpawnPoint();
        }

        Player.x = coordinates.x;
        Player.y = coordinates.y;
        
        Camera.targetCoordinates = {x: Player.x, y: Player.y};

        Camera.snap();
    }

    /**
     * Tries to move in the designed orientation
     * @param orientation 
     */
    private static moveByOrientation(orientation: number) {
        
        let newCoordModifier: Coordinates = {x: 0, y: 0};
        if (orientation == GameController.KEY_UP) newCoordModifier.y -= 1;
        else if (orientation == GameController.KEY_DOWN) newCoordModifier.y += 1;
        else if (orientation == GameController.KEY_LEFT) newCoordModifier.x -= 1;
        else if (orientation == GameController.KEY_RIGHT) newCoordModifier.x += 1;
        else return; // not a moving key
        Player.move({x: newCoordModifier.x + Player.x, y: newCoordModifier.y + Player.y});
    }

    /**
     * Move to close coordinates, checking everything
     * @param coordinates 
     * @returns 
     */
    private static move(coordinates: Coordinates) {
        // not allowed to move
        if (GameInterface.freezeControls) {
            return;
        }

        // test collision
        if (coordinates.x < 0 ||
            coordinates.x >= GameMap.MapWidth ||
            coordinates.y < 0 || 
            coordinates.y >= GameMap.MapHeight) {
            return;
        }
        // cancel movement if wall
        if (!Player.canMoveTo(coordinates.x, coordinates.y)) {
            return;
        }

        const gameobject = GameMap.getMapObject({x: coordinates.x, y: coordinates.y})
        if (gameobject) {
            // get id solid
            if (gameobject.solid) {
                return;
            }
        }

        // process movement
        Player.x = coordinates.x;
        Player.y = coordinates.y;

        Camera.targetCoordinates = {x: Player.x, y: Player.y};

        this.tilt = this.tilt <= 0 ? this.tilt = 30 : this.tilt = -30;

        if (gameobject) gameobject.onWalk(gameobject);
    }

    public display() {

        GameGraphics.displayHeroOnTerrain(Player.x, Player.y, Player.tilt);
        if (Player.tilt > 0) Player.tilt--;
        if (Player.tilt < 0) Player.tilt++;

        // mouse move cursor
        if (!GameInterface.freezeControls) {
            if (Player.canMoveTo(GameController.mouseTileX, GameController.mouseTileY)) {
                GameGraphics.ctx.fillRect(
                    Math.floor(GameController.mouseTileX * Camera.cellSize - Camera.offsetX + 6), 
                    Math.floor(GameController.mouseTileY * Camera.cellSize - Camera.offsetY + 6), 
                    Camera.cellSize - 9, Camera.cellSize - 9);
            }
        }
    }

    /**
     * Returns false if there is a wall or it's too far
     * @param x 
     * @param y 
     */
    private static canMoveTo(x: number, y: number): boolean {
        // too far
        if (Math.abs(Player.x - x) + Math.abs(Player.y - y) != 1) return false;
        // tile solid
        const tile = GameMap.getCollision({x, y});
        if (!tile || tile.solid) {
            // cancel movement
            return false;
        }
        // ok
        return true;
    }
    
    public keyPressed(key: number): void {
        Player.moveByOrientation(key);
    }

    public mousePressed(x: number, y: number): void {
        Player.move({x: GameController.mouseTileX, y: GameController.mouseTileY});
    }


    public static die() {
        console.log('Death');
        GameInterface.addDialogue([{
            id: 0,
            textLines: ["Votre corp se dissout une nouvelle fois ..."],
            answers: [
                {
                    text: "Continuer",
                    goto: 1,
                    onAnswer: () => {
                        Player.teleport(null, 'tuto');
                        Player.stats.healFullHp();
                    }
                }
            ]
            },
            {
                id: 1,
                textLines: ["... Pour réapparaitre à son point de départ.", "Comme toujours."],   
            }]);
    }
    
    // Experience management

    public static shouldLevelUp(): boolean {
        return this.xp >= this.targetXp;
    }
    
    public static requiredExperienceToLevelUp(): number {
        return 100 * Math.pow(this.level, 2);
    }
    
    public static levelUp(): void {
        this.level++;
        this.targetXp = this.requiredExperienceToLevelUp();
        this.class.onLevelUp();
        let newSpell = this.class.getRandomSpellFromPool();
        if (!!newSpell) this.stats.spells.push(newSpell);
        if (this.class.skills.length >= this.level) this.stats.skills.push(...this.class.skills[this.level - 1]);
        GameInterface.onNewCharacterData();
    }

    // Reward management

    public static give(reward: Reward): void {
        this.gold += reward.gold;
        this.xp += reward.xp;
        this.stats.inventory.push(...reward.items);
    }
}