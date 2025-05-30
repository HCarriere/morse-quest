import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";
import { DamageType } from "@game/content/spells";

export class BuffProtection extends Buff {
    public name = "Protection";
    public description = ['Protège de 1 dégat par pile.'];
    public icon = {text: "XX", color: '#666'};
    public stackMax = 100;
    private hitDamage = 0;

    public onBuffed(stats: GameStats) {
        stats.flatDamageReductor += 1;
    }

    public onUnbuffed(stats: GameStats) {
        stats.flatDamageReductor -= this.stack;
    }

    public onBuffRecipientHit(stats: GameStats, damage: number, type: DamageType): void {
        this.hitDamage = damage;
    }

    public onBuffRecipientDamaged(stats: GameStats, damage: number, type: DamageType): void {
        console.log('protection hit : damage : ', this.hitDamage);
        const mod = Math.min(this.stack, this.hitDamage);
        console.log('protection hit : damage mod : ', mod);
        stats.flatDamageReductor -= mod;
        this.stack -= mod;
    }

}