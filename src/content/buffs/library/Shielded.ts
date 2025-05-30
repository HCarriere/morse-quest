import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";
import { DamageType } from "@game/content/spells";

export class BuffShielded extends Buff {
    public name = "Bouclier";
    public description = ["Protégé par un allié pendant le prochain tour"];
    public icon = {text: "🛡️", color: 'blue'};
    constructor(private protector: GameStats) {
        super();
    }
    public onBuffed(stats: GameStats) {
        stats.flatDamageReductor += this.protector.maxHp;
    }
    public onBuffRecipientHit(stats: GameStats, damage: number, type: DamageType): void {
        this.protector.damage(damage, type);
    }
    public onUnbuffed(stats: GameStats) {
        stats.flatDamageReductor -= this.protector.maxHp;
    }
}