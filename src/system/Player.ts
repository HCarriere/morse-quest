import { Camera } from "./Camera";
import { Controller } from "./Controller";
import { Coordinates, GameMap } from "./GameMap";
import { GameObject } from "./GameObject";

/**
 * Represents the player
 */
export class Player extends GameObject {

    public location: Coordinates;

    /**
     * Teleport on coordinates
     * @param x 
     * @param y 
     */
    public teleport(coordinates: Coordinates) {
        this.location = coordinates;

        Camera.targetCoordinates = this.location;
    }

    /**
     * Tries to move in the designed orientation
     * @param orientation 
     */
    private move(orientation: number) {
        let newCoordModifier: Coordinates = {x: 0, y: 0};
        if (orientation == Controller.KEY_UP) newCoordModifier.y -= 1;
        if (orientation == Controller.KEY_DOWN) newCoordModifier.y += 1;
        if (orientation == Controller.KEY_LEFT) newCoordModifier.x -= 1;
        if (orientation == Controller.KEY_RIGHT) newCoordModifier.x += 1;

        // test collision
        const collision = GameMap.getCollision({x: this.location.x + newCoordModifier.x, y: this.location.y + newCoordModifier.y});
        if (collision == GameMap.COLLISION_WALL) {
            // cancel movement
            return;
        }

        // process movement
        this.location.x += newCoordModifier.x;
        this.location.y += newCoordModifier.y;

        Camera.targetCoordinates = this.location;
    }

    public display() {
        this.ctx.fillStyle = 'darkgrey';
        this.ctx.fillRect(
            Math.floor(this.location.x * Camera.cellSize - Camera.offsetX + 3), 
            Math.floor(this.location.y * Camera.cellSize - Camera.offsetY + 3), 
            Camera.cellSize - 6, Camera.cellSize - 6);
    }
    
    public keyPressed(orientation: number): void {
        this.move(orientation);    
    }
}