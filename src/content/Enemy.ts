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
    public combatX: number;
    public combatY: number;
    public combatSize: number;

    constructor(name: string, skin: EnemySkin) {
        this.name = name;
        this.skin = skin;
        this.stats = new GameStats();
    }

    /**
     * Display enemy on x,y NON RELATIVE, top left
     * @param x 
     * @param y 
     * @param size
     */
    public display(x: number, y:number, size: number) {
        Enemy.displaySkin(this.skin, x, y, size);
    }

    public static displaySkin(skin: EnemySkin, x: number, y:number, size: number) {
        if (skin == EnemySkin.Drone) {
            size = size/2; // drones are small
            Graphics.ctx.fillStyle = 'red';
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
        return (x > this.combatX - this.combatSize/2 && x < this.combatX + this.combatSize/2 && 
                y > this.combatY - this.combatSize/2 && y < this.combatY + this.combatSize/2);
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