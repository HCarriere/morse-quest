import { GameStats } from "./GameStats";
import { Combat } from "@game/interface/Combat";
import { Skin } from "./skins/Skin";
import { Spell, TargetType } from "./spells/Spell";
import { Item } from "./items/Item";

export interface Drop {
    item: Item,
    chance: number,
}

export interface DropTable {
    gold: number,
    xp: number,
    drops: Drop[],
}

export class Enemy {

    // used for combat placement
    /*public x: number;
    public y: number;
    public size: number;*/

    /**
     * Used to display what this unit will be doing when 
     * it's its turn to play.
     */
    public turnIntent: Spell;

    constructor(
        public name: string, 
        public skin: Skin, 
        public stats: GameStats,
        public dropTable?: DropTable,
    ) {}

    /**
     * Display enemy on x,y NON RELATIVE, top left
     * @param x 
     * @param y 
     * @param size
     */
    public display() {
        this.skin.display(this.x - this.size/2, this.y - this.size/2, this.size);
    }

    /**
     * Played when the enemy do its turn
     * @param combat 
     * @param onEnd 
     * @returns 
     */
    public playTurn(combat: Combat, onEnd: () => void): void {
        if (this.isDead) return;
        
        console.log('enemy is playing ', this.turnIntent);
        
        // nothing is planned, so do nothing
        if (!this.turnIntent) {
            onEnd();
            return;
        }

        if (this.turnIntent.targetType == TargetType.Self) {
            // buffs, if any
            combat.playSpellAnimation(this.turnIntent, [this], this, () => {
                onEnd();
            });
        } else {
            // target offensive spells
            combat.playSpellAnimation(this.turnIntent, ['player'], this, () => {
                onEnd();
            });
        }

        // reset turn intent
        this.turnIntent = null;
    }

    /**
     * Played on the start of the turn
     * @returns 
     */
    public prepareTurn() {
        if (this.isDead) return;

        const iSpell = Math.floor(Math.random() * this.stats.spells.length);
        const spell = this.stats.spells[iSpell];

        this.turnIntent = spell;
    }

    /**
     * Returns true if x,y is inside button.
     * Used to select enemy for target selection.
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

    public get x() {
        return this.stats.x;
    }

    public get y() {
        return this.stats.y;
    }

    public get size() {
        return this.stats.size;
    }
}