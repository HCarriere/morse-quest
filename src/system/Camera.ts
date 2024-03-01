import { Coordinates, GameMap } from "./GameMap";
import { GameObject } from "./GameObject";

export class Camera extends GameObject {
    static offsetX = 0;
    static offsetY = 0;
    static cellSize: number;

    private static CAMERA_SPEED = 10;

    /**
     * Camera will try to slide toward this target
     */
    static targetCoordinates: Coordinates;

    public resize() {
        Camera.cellSize = Math.floor(this.canvas.width / GameMap.MAX_BLOCK_WIDTH_VIEW);
    }

    public display() {
        // target should always be on center of screen
        if (Camera.offsetX + this.canvas.width / 2 < Camera.targetCoordinates.x * Camera.cellSize) Camera.offsetX += Camera.CAMERA_SPEED;
        if (Camera.offsetX + this.canvas.width / 2 > Camera.targetCoordinates.x * Camera.cellSize + Camera.cellSize) Camera.offsetX -= Camera.CAMERA_SPEED;

        if (Camera.offsetY + this.canvas.height / 2 < Camera.targetCoordinates.y * Camera.cellSize) Camera.offsetY += Camera.CAMERA_SPEED;
        if (Camera.offsetY + this.canvas.height / 2 > Camera.targetCoordinates.y * Camera.cellSize + Camera.cellSize) Camera.offsetY -= Camera.CAMERA_SPEED;

        this.boundCamera();
    }

    private boundCamera() {
        if (Camera.offsetX + this.canvas.width > GameMap.MapWidth * Camera.cellSize) Camera.offsetX = GameMap.MapWidth * Camera.cellSize - this.canvas.width;
        if (Camera.offsetY + this.canvas.height > GameMap.MapHeight * Camera.cellSize) Camera.offsetY = GameMap.MapHeight * Camera.cellSize - this.canvas.height;
        if (Camera.offsetX < 0) Camera.offsetX = 0;
        if (Camera.offsetY < 0) Camera.offsetY = 0;
    }

    /**
     * Directly snap camera towards its target
     */
    public snap() {
        Camera.offsetX = Camera.targetCoordinates.x * Camera.cellSize - this.canvas.width / 2;
        Camera.offsetY = Camera.targetCoordinates.y * Camera.cellSize - this.canvas.height / 2;

        this.boundCamera();
    }
}