import { Camera } from "./Camera";
import { GameInterface } from "@game/interface/GameInterface";
import { MapObject, TileSettings } from "./GameMap";

export interface ObjectSkin {
    type: SkinType;
    primaryColor: string;
    secondaryColor: string;
}

export enum SkinType {
    AttentionMark = 1,
    Portal = 2,
}

export interface Icon {
    text: string;
    color: string;
}

/**
 * Simple graphics, only animated with frames number (stateless)
 */
export class Graphics {

    public static ctx: CanvasRenderingContext2D;
    public static canvas: HTMLCanvasElement;
    
    public static FONT = "luminari";

    /**
     * Display a single standard tile
     * @param ctx 
     * @param tile 
     * @param x coord x
     * @param y coord y
     */
    public static displayTile(tile: TileSettings, x: number, y: number) {
        Graphics.ctx.save();
        if (tile.visible && tile.color) {
            Graphics.ctx.fillStyle = tile.color;
            Graphics.ctx.fillRect(
                Math.floor(x * Camera.cellSize - Camera.offsetX), 
                Math.floor(y * Camera.cellSize - Camera.offsetY), 
                Camera.cellSize, Camera.cellSize);
        }
        Graphics.ctx.globalAlpha = 0.1;
        Graphics.ctx.strokeStyle = '#333';
        Graphics.ctx.lineWidth = 1;
        Graphics.ctx.strokeRect(
            Math.floor(x * Camera.cellSize - Camera.offsetX), 
            Math.floor(y * Camera.cellSize - Camera.offsetY), 
            Camera.cellSize, Camera.cellSize);
        Graphics.ctx.restore();
    }

    public static displayObject(object: MapObject, x: number, y: number) {
        if (!object.skin) return;

        /**
         * Attention mark graphics
         */
        if (object.skin.type == SkinType.AttentionMark) {
            Graphics.ctx.fillStyle = object.skin.secondaryColor;
            Graphics.ctx.save();
            Graphics.ctx.translate(
                x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2, 
                y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2);
            Graphics.ctx.rotate(45 * Math.PI/180);
            Graphics.ctx.fillRect(-Camera.cellSize / 2, -Camera.cellSize / 2, Camera.cellSize, Camera.cellSize);
            Graphics.ctx.restore();
            Graphics.ctx.fillStyle = object.skin.primaryColor;
            Graphics.ctx.textAlign = "center";
            Graphics.ctx.font = "30px "+Graphics.FONT;
            Graphics.ctx.textBaseline = "middle";
            Graphics.ctx.fillText('!', 
                x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2, 
                y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2);
        }
        /**
         * Portal graphics
         */
        if (object.skin.type == SkinType.Portal) {
            Graphics.ctx.fillStyle = object.skin.primaryColor;
            Graphics.ctx.beginPath();
            Graphics.ctx.arc(x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2,
                    y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2,
                    Camera.cellSize / 2, 0, 2 * Math.PI, false);
                    Graphics.ctx.fill();
                    Graphics.ctx.beginPath();
                    Graphics.ctx.strokeStyle = object.skin.secondaryColor;
                    Graphics.ctx.lineWidth = Camera.cellSize / 10;
                    Graphics.ctx.arc(x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2,
                    y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2,
                    Camera.cellSize/2, 
                    GameInterface.frame / 10, GameInterface.frame / 10 + Math.PI, false);
                    Graphics.ctx.stroke();
        }
    }

    /**
     * Display an icon
     * @param icon 
     * @param x top left
     * @param y top left
     * @param size 
     */
    public static displayIcon(icon: Icon, x: number, y: number, size: number) {
        Graphics.ctx.fillStyle = icon.color;
        Graphics.ctx.font = `bold ${size}px Luminari`
        Graphics.ctx.textAlign = "left";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(icon.text, x, y);
    }
}