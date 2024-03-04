import { Camera } from "./Camera";
import { Controller } from "./Controller";
import { Coordinates, GameMap, MapObject } from "./GameMap";
import { GameObject } from "./GameObject";
import { GameInterface } from "@game/interface/GameInterface";

/**
 * Represents the player
 */
export class Player extends GameObject {

    // public static location: Coordinates;
    public static x: number;
    public static y: number;

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

        Player.x = coordinates.x;
        Player.y = coordinates.y;

        Camera.targetCoordinates = {x: Player.x, y: Player.y};
    }

    /**
     * Tries to move in the designed orientation
     * @param orientation 
     */
    private static moveByOrientation(orientation: number) {
        
        let newCoordModifier: Coordinates = {x: 0, y: 0};
        if (orientation == Controller.KEY_UP) newCoordModifier.y -= 1;
        if (orientation == Controller.KEY_DOWN) newCoordModifier.y += 1;
        if (orientation == Controller.KEY_LEFT) newCoordModifier.x -= 1;
        if (orientation == Controller.KEY_RIGHT) newCoordModifier.x += 1;

        Player.move({x: newCoordModifier.x + Player.x, y: newCoordModifier.y + Player.y});
    }

    /**
     * Move to close coordinates, checking everything
     * @param coordinates 
     * @returns 
     */
    private static move(coordinates: Coordinates) {
        // not allowed to move
        if (GameInterface.getInstance().freezeControls) {
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

        // process walk tile event
        Player.processGameEvent(GameMap.getMapObject({x: coordinates.x, y: coordinates.y}));
    }

    public display() {
        this.ctx.fillStyle = 'darkgrey';
        this.ctx.fillRect(
            Math.floor(Player.x * Camera.cellSize - Camera.offsetX + 3), 
            Math.floor(Player.y * Camera.cellSize - Camera.offsetY + 3), 
            Camera.cellSize - 6, Camera.cellSize - 6);

        // mouse move cursor
        if (!GameInterface.getInstance().freezeControls) {
            if (Player.canMoveTo(Controller.mouseTileX, Controller.mouseTileY)) {
                this.ctx.fillRect(
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
    
    public keyPressed(orientation: number): void {
        Player.moveByOrientation(orientation);    
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
}