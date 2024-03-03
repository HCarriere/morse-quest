import { Camera } from "./Camera";
import { Controller } from "./Controller";
import { Coordinates, GameMap } from "./GameMap";
import { GameObject } from "./GameObject";
import { GameEvents } from "../content/GameEvents";
import { GameInterface } from "@game/interface/GameInterface";

/**
 * Represents the player
 */
export class Player extends GameObject {

    public static location: Coordinates;

    /**
     * Teleport on coordinates
     * @param x 
     * @param y 
     * @param mapId optional, specify it to teleport on another map
     */
    public static teleport(coordinates: Coordinates, mapId?: string) {
        if (mapId) {
            GameMap.loadMap(mapId);
        }

        this.location = coordinates;

        Camera.targetCoordinates = this.location;
    }

    /**
     * Tries to move in the designed orientation
     * @param orientation 
     */
    private static move(orientation: number) {
        // not allowed to move
        if (GameInterface.getInstance().freezeControls) {
            return;
        }

        let newCoordModifier: Coordinates = {x: 0, y: 0};
        if (orientation == Controller.KEY_UP) newCoordModifier.y -= 1;
        if (orientation == Controller.KEY_DOWN) newCoordModifier.y += 1;
        if (orientation == Controller.KEY_LEFT) newCoordModifier.x -= 1;
        if (orientation == Controller.KEY_RIGHT) newCoordModifier.x += 1;

        // test collision
        if (this.location.x + newCoordModifier.x < 0 ||
            this.location.x + newCoordModifier.x >= GameMap.MapWidth ||
            this.location.y + newCoordModifier.y < 0 || 
            this.location.y + newCoordModifier.y >= GameMap.MapHeight) {
            return;
        }
        const tile = GameMap.getCollision({x: this.location.x + newCoordModifier.x, y: this.location.y + newCoordModifier.y});
        if (tile.solid) {
            // cancel movement
            return;
        }

        // process walk tile event
        GameEvents.processGameEvent(GameMap.getMapObject({x: this.location.x + newCoordModifier.x, y: this.location.y + newCoordModifier.y}));

        // process movement
        this.location.x += newCoordModifier.x;
        this.location.y += newCoordModifier.y;

        Camera.targetCoordinates = this.location;
    }

    public display() {
        this.ctx.fillStyle = 'darkgrey';
        this.ctx.fillRect(
            Math.floor(Player.location.x * Camera.cellSize - Camera.offsetX + 3), 
            Math.floor(Player.location.y * Camera.cellSize - Camera.offsetY + 3), 
            Camera.cellSize - 6, Camera.cellSize - 6);
    }
    
    public keyPressed(orientation: number): void {
        Player.move(orientation);    
    }
}