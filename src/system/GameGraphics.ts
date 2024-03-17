import { Camera } from "./Camera";
import { GameInterface } from "@game/interface/GameInterface";
import { MapObject, TileSettings } from "./GameMap";
import { Graphics } from "@game/core/Graphics";


export interface Icon {
    text: string;
    color: string;
    backgroundColor?: string;
}

/**
 * Simple graphics, only animated with frames number (stateless)
 */
export class GameGraphics extends Graphics {

    /**
     * Display a single standard tile
     * @param ctx 
     * @param tile 
     * @param x coord x
     * @param y coord y
     */
    public static displayTile(tile: TileSettings, x: number, y: number) {
        GameGraphics.ctx.save();
        if (tile.visible && tile.color) {
            GameGraphics.ctx.fillStyle = tile.color;
            GameGraphics.ctx.fillRect(
                Math.floor(x * Camera.cellSize - Camera.offsetX), 
                Math.floor(y * Camera.cellSize - Camera.offsetY), 
                Camera.cellSize, Camera.cellSize);
        }
        GameGraphics.ctx.globalAlpha = 0.1;
        GameGraphics.ctx.strokeStyle = '#333';
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.strokeRect(
            Math.floor(x * Camera.cellSize - Camera.offsetX), 
            Math.floor(y * Camera.cellSize - Camera.offsetY), 
            Camera.cellSize, Camera.cellSize);
        GameGraphics.ctx.restore();
    }

    /**
     * Display an icon
     * @param icon 
     * @param x top left
     * @param y top left
     * @param size 
     */
    public static displayIcon(icon: Icon, x: number, y: number, size: number) {
        GameGraphics.ctx.fillStyle = icon.color;
        GameGraphics.ctx.font = `bold ${size}px ${GameGraphics.FONT}`
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(icon.text, x, y, size);
        if (icon.backgroundColor) {
            GameGraphics.ctx.fillStyle = icon.backgroundColor;
            GameGraphics.ctx.fillRect(x, y, size, size);
        }
    }
}
