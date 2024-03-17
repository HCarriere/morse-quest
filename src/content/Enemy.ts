import { GameStats } from "./GameStats";
import { Combat } from "@game/interface/Combat";
import { Skin } from "./skins/Skin";
import { TargetType } from "./spells/Spell";

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

    public playTurn(combat: Combat, onEnd: () => void): void {
        if (this.isDead) return;
        // do a random spell
        // TODO implement a good AI
        const iSpell = Math.floor(Math.random() * this.stats.spells.length);
        const spell = this.stats.spells[iSpell];
        
        if (spell.targetType == TargetType.Self) {
            // buffs, if any
            combat.playSpellAnimation(spell, [this], this, () => {
                onEnd();
            });
        } else {
            // target offensive spells
            combat.playSpellAnimation(spell, ['player'], this, () => {
                onEnd();
            });
        }

        console.log('Enemy '+this.name + ' do : ' + spell);
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