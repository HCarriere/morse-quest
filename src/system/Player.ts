import { Camera } from "./Camera";
import { Controller } from "./Controller";
import { Coordinates, GameMap, MapObject } from "./GameMap";
import { GameObject } from "./GameObject";
import { GameInterface } from "@game/interface/GameInterface";
import { Graphics } from "./Graphics";
import { GameStats } from "@game/content/GameStats";
import { SpellChainLightning } from "@game/content/spells/library/ChainLightning";
import { Spellicebolt } from "@game/content/spells/library/Icebolt";
import { SpellFireball } from "@game/content/spells/library/Fireball";

/**
 * Represents the player
 */
export class Player extends GameObject {
    

    public static stats: GameStats;

    // public static location: Coordinates;
    public static x: number;
    public static y: number;

    /**
     * used for animation
     */
    private static tilt = 0;

    public init() {
        Player.stats = new GameStats();
        Player.stats.baseConstitution = 20;
        Player.stats.healFull();        
        Player.stats.spells.push(new SpellChainLightning());
        Player.stats.spells.push(new Spellicebolt());
        Player.stats.spells.push(new SpellFireball());
        Player.stats.spells.push(new SpellChainLightning());
        Player.stats.spells.push(new Spellicebolt());
        Player.stats.spells.push(new SpellFireball());
        Player.stats.selectActiveSpell(0);
        Player.stats.selectActiveSpell(1);

        
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
        if (orientation == Controller.KEY_UP) newCoordModifier.y -= 1;
        else if (orientation == Controller.KEY_DOWN) newCoordModifier.y += 1;
        else if (orientation == Controller.KEY_LEFT) newCoordModifier.x -= 1;
        else if (orientation == Controller.KEY_RIGHT) newCoordModifier.x += 1;
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

        // process movement
        Player.x = coordinates.x;
        Player.y = coordinates.y;

        Camera.targetCoordinates = {x: Player.x, y: Player.y};

        this.tilt = this.tilt <= 0 ? this.tilt = 30 : this.tilt = -30;

        // process walk tile event
        Player.processGameEvent(GameMap.getMapObject({x: coordinates.x, y: coordinates.y}));
    }

    public display() {
        const halfsize = (Camera.cellSize - 3) / 2;

        // display Player on map
        Graphics.ctx.fillStyle = '#804d32';
        Graphics.ctx.save();
        Graphics.ctx.translate(
            Math.floor(Player.x * Camera.cellSize - Camera.offsetX) + halfsize,
            Math.floor(Player.y * Camera.cellSize - Camera.offsetY) + halfsize
            );
        Graphics.ctx.rotate(Player.tilt*0.005);
        Graphics.ctx.fillRect(
            -halfsize, -halfsize,
            halfsize*2, halfsize*2);
        Graphics.ctx.restore();
        if (Player.tilt > 0) Player.tilt--;
        if (Player.tilt < 0) Player.tilt++;

        // mouse move cursor
        if (!GameInterface.freezeControls) {
            if (Player.canMoveTo(Controller.mouseTileX, Controller.mouseTileY)) {
                Graphics.ctx.fillRect(
                    Math.floor(Controller.mouseTileX * Camera.cellSize - Camera.offsetX + 6), 
                    Math.floor(Controller.mouseTileY * Camera.cellSize - Camera.offsetY + 6), 
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
        // solid
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
        Player.move({x: Controller.mouseTileX, y: Controller.mouseTileY});
    }

    private static processGameEvent(object: MapObject) {
        if (!object) return;

        if (object.onWalk) {
            object.onWalk();
        }
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
                        Player.stats.healFull();
                    }
                }
            ]
            },
            {
                id: 1,
                textLines: ["... Pour réapparaitre à son point de départ.", "Comme toujours."],   
            }]);
    }
}