import { GameStats } from "./GameStats";
import { Player } from "@game/system/Player";
import { Combat } from "@game/interface/Combat";
import { Skin } from "./Skin";

export class Enemy {

    // used for combat placement
    public x: number;
    public y: number;
    public size: number;

    public primaryColor: string;

    constructor(public name: string, public skin: Skin, public stats: GameStats) {}

    /**
     * Display enemy on x,y NON RELATIVE, top left
     * @param x 
     * @param y 
     * @param size
     */
    public display() {
        this.skin.display(this.x - this.size/2, this.y - this.size/2, this.size);
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