import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";

export class BuffProtection extends Buff {
    public name = "Protection";
    public description = ['Protège de 1 dégat par pile.'];
    public icon = {text: "XX", color: '#666'};
    public stackMax = 100;

    public onBuffed(stats: GameStats) {
        stats.flatDamageReductor += 1;
    }

    public onUnbuffed(stats: GameStats) {
        stats.flatDamageReductor -= this.stack;
    }

    public onBuffRecipientHit(stats: GameStats, damage: number): void {
        console.log('protection hit : damage : ', damage);
        const mod = Math.min(this.stack, damage);
        console.log('protection hit : damage mod : ', mod);
        stats.flatDamageReductor -= mod;
        this.stack -= mod;
    }

}