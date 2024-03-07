import { Graphics } from "@game/system/Graphics";
import { GameStats } from "./GameStats";
import { GameInterface } from "@game/interface/GameInterface";
import { Player } from "@game/system/Player";
import { Combat } from "@game/interface/Combat";

export class Enemy {
    
    public stats: GameStats;
    public name: string;
    public skin: EnemySkin;

    // used for combat placement
    public x: number;
    public y: number;
    public size: number;

    public primaryColor: string;

    constructor(name: string, skin: EnemySkin, stats: GameStats, primaryColor?: string) {
        this.name = name;
        this.skin = skin;
        this.stats = stats;
        this.primaryColor = primaryColor;
    }

    /**
     * Display enemy on x,y NON RELATIVE, top left
     * @param x 
     * @param y 
     * @param size
     */
    public display() {
        Enemy.displaySkin(this.skin, this.x - this.size/2, this.y - this.size/2, this.size, this.primaryColor);
    }

    /**
     * Display, centered
     * @param skin 
     * @param x 
     * @param y 
     * @param size 
     * @param primaryColor 
     */
    public static displaySkin(skin: EnemySkin, x: number, y:number, size: number, primaryColor = 'red') {
        if (skin == EnemySkin.Drone) {
            size = size/2; // drones are small
            Graphics.ctx.fillStyle = primaryColor;
            Graphics.ctx.save();
            Graphics.ctx.translate(x + size , y + size);
            Graphics.ctx.rotate(GameInterface.frame * 0.02);
            Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
            Graphics.ctx.rotate(-GameInterface.frame*2 * 0.015);
            Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
            Graphics.ctx.restore();
        }
    }

    public playTurn(combat: Combat): void {
        if (this.isDead) return;
        // do the first spell they know to player ...
        const iSpell = Math.floor(Math.random() * this.stats.spells.length);
        
        combat.playSpellAnimation(this.stats.spells[iSpell], ['player'], this, () => {
            this.stats.spells[iSpell].effect([Player.stats]);
        });

        console.log('Enemy '+this.name + ' do : ' + this.stats.spells[iSpell].name);
    }


    /**
     * Returns true if x,y is inside button
     * @param x 
     * @param y 
     */
    public isInbound(x: number, y: number): boolean {
        return (x > this.x - this.size/2 && x < this.x + this.size/2 && 
                y > this.y - this.size/2 && y < this.y + this.size/2);
    }
    
    /**
     * Return if the enemy is dead
     */
    public get isDead(): boolean {
        return this.stats.hp <=0;
    }
}

export enum EnemySkin {
    Drone = 1,
}