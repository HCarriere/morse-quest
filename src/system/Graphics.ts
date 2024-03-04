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

/**
 * Simple graphics, only animated with frames number (stateless)
 */
export class Graphics {
    
    private static FONT = "30px monospace";

    /**
     * Display a single standard tile
     * @param ctx 
     * @param tile 
     * @param x coord x
     * @param y coord y
     */
    public static displayTile(ctx: CanvasRenderingContext2D, tile: TileSettings, x: number, y: number) {
        if (tile.visible && tile.color) {
            ctx.fillStyle = tile.color;
            ctx.fillRect(
                Math.floor(x * Camera.cellSize - Camera.offsetX), 
                Math.floor(y * Camera.cellSize - Camera.offsetY), 
                Camera.cellSize, Camera.cellSize);
        }
    }

    public static displayObject(ctx: CanvasRenderingContext2D, object: MapObject, x: number, y: number) {
        if (!object.skin) return;

        /**
         * Attention mark graphics
         */
        if (object.skin.type == SkinType.AttentionMark) {
            ctx.fillStyle = object.skin.secondaryColor;
            ctx.save();
            ctx.translate(
                x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2, 
                y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2);
            ctx.rotate(45 * Math.PI/180);
            ctx.fillRect(-Camera.cellSize / 2, -Camera.cellSize / 2, Camera.cellSize, Camera.cellSize);
            ctx.restore();
            ctx.fillStyle = object.skin.primaryColor;
            ctx.textAlign = "center";
            ctx.font = Graphics.FONT;
            ctx.textBaseline = "middle";
            ctx.fillText('!', 
                x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2, 
                y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2);
        }
        /**
         * Portal graphics
         */
        if (object.skin.type == SkinType.Portal) {
            ctx.fillStyle = object.skin.primaryColor;
            ctx.beginPath();
            ctx.arc(x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2,
                    y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2,
                    Camera.cellSize / 2, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.beginPath();
            ctx.strokeStyle = object.skin.secondaryColor;
            ctx.lineWidth = Camera.cellSize / 10;
            ctx.arc(x * Camera.cellSize - Camera.offsetX + Camera.cellSize / 2,
                    y * Camera.cellSize - Camera.offsetY + Camera.cellSize / 2,
                    Camera.cellSize/2, 
                    GameInterface.frame / 10, GameInterface.frame / 10 + Math.PI, false);
            ctx.stroke();
        }
    }
}