import { Coordinates, GameMap } from "./GameMap";
import { GameObject } from "./GameObject";
import { Graphics } from "./Graphics";

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
        Camera.cellSize = Math.floor(Graphics.canvas.width / GameMap.MAX_BLOCK_WIDTH_VIEW);
    }

    public display() {
        // target should always be on center of screen
        if (Camera.offsetX + Graphics.canvas.width / 2 < Camera.targetCoordinates.x * Camera.cellSize) Camera.offsetX += Camera.CAMERA_SPEED;
        if (Camera.offsetX + Graphics.canvas.width / 2 > Camera.targetCoordinates.x * Camera.cellSize + Camera.cellSize) Camera.offsetX -= Camera.CAMERA_SPEED;

        if (Camera.offsetY + Graphics.canvas.height / 2 < Camera.targetCoordinates.y * Camera.cellSize) Camera.offsetY += Camera.CAMERA_SPEED;
        if (Camera.offsetY + Graphics.canvas.height / 2 > Camera.targetCoordinates.y * Camera.cellSize + Camera.cellSize) Camera.offsetY -= Camera.CAMERA_SPEED;

        Camera.boundCamera();
    }

    private static boundCamera() {
        if (Camera.offsetX + Graphics.canvas.width > GameMap.MapWidth * Camera.cellSize) Camera.offsetX = GameMap.MapWidth * Camera.cellSize - Graphics.canvas.width;
        if (Camera.offsetY + Graphics.canvas.height > GameMap.MapHeight * Camera.cellSize) Camera.offsetY = GameMap.MapHeight * Camera.cellSize - Graphics.canvas.height;
        if (Camera.offsetX < 0) Camera.offsetX = 0;
        if (Camera.offsetY < 0) Camera.offsetY = 0;
    }

    /**
     * Directly snap camera towards its target
     */
    public static snap() {
        Camera.offsetX = Camera.targetCoordinates.x * Camera.cellSize - Graphics.canvas.width / 2;
        Camera.offsetY = Camera.targetCoordinates.y * Camera.cellSize - Graphics.canvas.height / 2;

        Camera.boundCamera();
    }
}