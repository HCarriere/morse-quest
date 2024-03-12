import { Camera } from "./Camera";
import { GameInterface } from "@game/interface/GameInterface";
import { MapObject, TileSettings } from "./GameMap";
import { Graphics } from "@game/core/Graphics";

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

    public static displayObject(object: MapObject, x: number, y: number) {
        if (!object.skin) return;

        /**
         * Attention mark graphics
         */
        if (object.skin.type == SkinType.AttentionMark) {
            GameGraphics.ctx.fillStyle = object.skin.secondaryColor;
            GameGraphics.ctx.save();
            GameGraphics.ctx.translate(
                x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2, 
                y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2);
            GameGraphics.ctx.rotate(45 * Math.PI/180);
            GameGraphics.ctx.fillRect(-Camera.cellSize / 2, -Camera.cellSize / 2, Camera.cellSize, Camera.cellSize);
            GameGraphics.ctx.restore();
            GameGraphics.ctx.fillStyle = object.skin.primaryColor;
            GameGraphics.ctx.textAlign = "center";
            GameGraphics.ctx.font = "30px "+GameGraphics.FONT;
            GameGraphics.ctx.textBaseline = "middle";
            GameGraphics.ctx.fillText('!', 
                x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2, 
                y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2);
        }
        /**
         * Portal graphics
         */
        if (object.skin.type == SkinType.Portal) {
            GameGraphics.ctx.fillStyle = object.skin.primaryColor;
            GameGraphics.ctx.beginPath();
            GameGraphics.ctx.arc(x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2,
                    y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2,
                    Camera.cellSize / 2, 0, 2 * Math.PI, false);
                    GameGraphics.ctx.fill();
                    GameGraphics.ctx.beginPath();
                    GameGraphics.ctx.strokeStyle = object.skin.secondaryColor;
                    GameGraphics.ctx.lineWidth = Camera.cellSize / 10;
                    GameGraphics.ctx.arc(x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2,
                    y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2,
                    Camera.cellSize/2, 
                    GameInterface.frame / 10, GameInterface.frame / 10 + Math.PI, false);
                    GameGraphics.ctx.stroke();
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
        GameGraphics.ctx.fillStyle = icon.color;
        GameGraphics.ctx.font = `bold ${size}px Luminari`
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(icon.text, x, y);
    }
}
