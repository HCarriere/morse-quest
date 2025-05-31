import { GameStats } from "@game/content/GameStats";
import { Icon } from "@game/system/GameGraphics";
import { DamageType } from "../spells";

/**
 * Accounts for buffs & debuffs (can be positive, negative, neutral)
 */
export abstract class Buff {
    public debuff = false;
    public abstract name: string;

    public abstract description: string[];

    public abstract icon: Icon;

    /**
     * Number of turns reminding until they are removed. 
     */
    public duration = 1;

    /**
     * Number of stack applied. A single buff can most times
     * be applied multiple times.
     */
    public stack = 1;

    /**
     * Number max of stacks possible.
     */
    public stackMax = 1;

    /**
     * Happens when the buff/debuff is aquired, for a SINGLE STACK.
     * @param stats 
     */
    public abstract onBuffed(stats: GameStats);

    /**
     * Happens when the buff/debuff is removed, for ALL STACKS.
     * @param stats 
     */
    public abstract onUnbuffed(stats: GameStats);

    /**
     * Happens when a new turn plays.
     * Duration is handled elsewhere.
     * @param stats 
     */
    public onNewTurn(stats: GameStats){}

    /**
     * Triggers when the buff recipient has been hit by an attack.
     * @param stats 
     * @param damage 
     */
    public onBuffRecipientHit(stats: GameStats, damage: number, type: DamageType) {}

    /**
     * Triggers when the buff recipient has been damaged by an attack after mitigation.
     * @param stats 
     * @param damage 
     */
    public onBuffRecipientDamaged(stats: GameStats, damage: number, type: DamageType) {}
    
    /**
     * Happens when buff is *already* applied.
     * Will play *onBuffed* for each new stack
     * @param stats 
     * @param newStacks
     */
    public applyNewStack(stats: GameStats, newStacks: number) {
        for (let i=0; i<newStacks; i++) {
            if (this.stack >= this.stackMax) return;
            this.onBuffed(stats);
            this.stack++;
        }
    }

    
}