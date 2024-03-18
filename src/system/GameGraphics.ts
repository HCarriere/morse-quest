import { Camera } from "./Camera";
import { TileSettings } from "./GameMap";
import { Graphics } from "@game/core/Graphics";
import { Spell, SpellType } from "@game/content/spells/Spell";
import { Game } from "@game/Game";


export interface Icon {
    text: string;
    color: string;
    backgroundColor?: string;
}

export interface Particle {
    /**
     * A particle can be text. If it's empty, a simple square will be displayed.
     */
    text?: string;
    /**
     * Each loop (60/s) will decrement life. When <=0, the particle disappear.
     */
    life: number;
    size: number;
    color: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    /**
     * Particle speed will be multiplied by this amount each frame.
     * So 0.999 to not lose to much speed.
     * < 1 to lose speed.
     * > 1 to add speed.
     */
    friction: number;
    /**
     * Particle will lose this size each frame.
     */
    sizeLosePerFrame?: number;
}

/**
 * Simple graphics, only animated with frames number (stateless)
 */
export class GameGraphics extends Graphics {

    private static terrainParticles: Particle[] = [];
    private static interfaceParticles: Particle[] = [];

    public static imgHero: CanvasImageSource;

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
     * Aligned left bottom.
     * @param spell 
     * @param x 
     * @param y 
     */
    public static displayTurnIntent(spell: Spell, x: number, y: number) {
        if (!spell) return;

        GameGraphics.ctx.font = `bold 16px ${GameGraphics.FONT}`;
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "bottom";

        if (spell.spellType == SpellType.Damage) {
            GameGraphics.ctx.fillStyle = 'white';
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


    public static loadImg(param: CanvasImageSource, url: string) {
        let img = new Image;
        img.src = url;
        param = img;
    }

    /**
     * Displays the hero on the grid/terrain
     * @param x on grid
     * @param y on grid
     */
    public static displayHeroOnTerrain(x: number, y: number, tilt: number = 0) {
        const halfsize = (Camera.cellSize - 3) / 2;
        
        GameGraphics.ctx.save();
        GameGraphics.ctx.translate(
            Math.floor(x * Camera.cellSize - Camera.offsetX) + halfsize,
            Math.floor(y * Camera.cellSize - Camera.offsetY) + halfsize
            );
        GameGraphics.ctx.rotate(tilt*0.005);
        
        if (Game.parameters && Game.parameters.heroSprite && this.imgHero) {
            GameGraphics.ctx.drawImage(this.imgHero, -halfsize, -halfsize, halfsize*2, halfsize*2);
        }
        else {
            GameGraphics.ctx.fillStyle = '#804d32';
            GameGraphics.ctx.fillRect(
                -halfsize, -halfsize,
                halfsize*2, halfsize*2);
        }
        GameGraphics.ctx.restore();
    }

    /**
     * Displays the hero
     * @param x top left
     * @param y top left
     * @param size = width = height
     */
    public static displayHero(x: number, y: number, size: number) {
        if (Game.parameters && Game.parameters.heroSprite && this.imgHero) {
            GameGraphics.ctx.drawImage(this.imgHero, x, y, size, size);
        }
        else {
            GameGraphics.ctx.fillStyle = '#804d32';
            GameGraphics.ctx.fillRect(x, y, size, size);
        }
    }


    /**
     * Add a particle to be displayed on the terrain.
     * @param particle 
     */
    public static addTerrainParticle(particle: Particle) {
        GameGraphics.terrainParticles.push(particle);
    }

    /**
     * Add a particle to be displayed on top of the interface.
     * @param particle 
     */
    public static addInterfaceParticle(particle: Particle) {
        GameGraphics.interfaceParticles.push(particle);
    }

    /**
     * Display and process all particles on the terrain.
     */
    public static displayTerrainParticles() {
        GameGraphics.displayParticles(GameGraphics.terrainParticles, true);
    }

    /**
     * Display and process all particles on the terrain.
     */
    public static displayInterfaceParticles() {
        GameGraphics.displayParticles(GameGraphics.interfaceParticles);
    }

    private static displayParticles(array: Particle[], moveWithCamera = false) {
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";

        for (let i = array.length - 1; i >= 0; i--) {
            const p = array[i];
            // display
            GameGraphics.ctx.fillStyle = p.color;
            
            if (p.text) {
                GameGraphics.ctx.font = `bold ${Math.ceil(p.size)}px ${GameGraphics.FONT}`;
                if (moveWithCamera) GameGraphics.ctx.fillText(p.text, p.x - Camera.offsetX, p.y - Camera.offsetY);
                if (!moveWithCamera) GameGraphics.ctx.fillText(p.text, p.x, p.y);
            } else {
                if (moveWithCamera) GameGraphics.ctx.fillRect(p.x - Camera.offsetX, p.y - Camera.offsetY, p.size, p.size);
                if (!moveWithCamera) GameGraphics.ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            // move
            if (p.sizeLosePerFrame) p.size -= p.sizeLosePerFrame;
            p.life -= 1;
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.x += p.vx;
            p.y += p.vy;
            // remove on end
            if (p.life <= 0 || p.size <= 0) {
                array.splice(i, 1);
            }
        }
    }
}
