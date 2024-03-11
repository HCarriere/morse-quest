import { Camera } from "./Camera";
import { GameInterface } from "@game/interface/GameInterface";
import { MapObject, TileSettings } from "./GameMap";
import { EngineGraphics } from "@game/core/EngineGraphics";

export interface ObjectSkin {
    type: SkinType;
    primaryColor: string;
    secondaryColor: string;
}

export enum SkinType {
    AttentionMark = 1,
    Portal = 2,
}

/**
 * Simple graphics, only animated with frames number (stateless)
 */
export class GameGraphics extends EngineGraphics {
    
    private static FONT = "30px monospace";

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
            GameGraphics.ctx.font = GameGraphics.FONT;
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
}