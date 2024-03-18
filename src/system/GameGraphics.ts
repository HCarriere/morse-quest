import { Camera } from "./Camera";
import { GameInterface } from "@game/interface/GameInterface";
import { MapObject, TileSettings } from "./GameMap";
import { Graphics } from "@game/core/Graphics";
import { Spell, SpellType } from "@game/content/spells/Spell";


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
        GameGraphics.ctx.font = `bold ${size}px ${GameGraphics.FONT}`;
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(icon.text, x, y, size);
        if (icon.backgroundColor) {
            GameGraphics.ctx.fillStyle = icon.backgroundColor;
            GameGraphics.ctx.fillRect(x, y, size, size);
        }
    }

    /**
     * Displays a spell intent.
     * Will be on top of an enemy for its turn.
     * Aligned center bottom.
     * @param spell 
     * @param x 
     * @param y 
     */
    public static displayTurnIntent(spell: Spell, x: number, y: number) {
        if (!spell) return;

        GameGraphics.ctx.font = `bold 16px ${GameGraphics.FONT}`;
        GameGraphics.ctx.textAlign = "center";
        GameGraphics.ctx.textBaseline = "bottom";

        if (spell.spellType == SpellType.Damage) {
            GameGraphics.ctx.fillStyle = 'red';
            GameGraphics.ctx.fillText(`⚔ ${spell.plannedDamage}`, x, y);
        } 
        else if (spell.spellType == SpellType.Shield) {
            GameGraphics.ctx.fillStyle = 'grey';
            GameGraphics.ctx.fillText(`🛡`, x, y);
        }
        else if (spell.spellType == SpellType.Buff) {
            GameGraphics.ctx.fillStyle = 'lightblue';
            GameGraphics.ctx.fillText(`➕`, x, y);
        }
        else if (spell.spellType == SpellType.Debuff) {
            GameGraphics.ctx.fillStyle = 'lightgreen';
            GameGraphics.ctx.fillText(`💀`, x, y);
        }
        else if (spell.spellType == SpellType.Other) {
            GameGraphics.ctx.fillStyle = 'white';
            GameGraphics.ctx.fillText(`???`, x, y);
        }
    }
}
