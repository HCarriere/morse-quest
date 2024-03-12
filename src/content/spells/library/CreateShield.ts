import { GameStats } from "@game/content/GameStats";
import { Spell, TargetType } from "../Spell";
import { BuffProtection } from "@game/content/buffs/library/Protection";

export class SpellCreateShield extends Spell {
    public name = "Bouclier magique";
    public description: string[];
    public energyCost = 1;
    
    public icon = {text: "S", color: 'grey'};
    public targetType = TargetType.Self;
    public frameAnimationMax = 10;
    public cooldown = 1;

    private strengh: number;

    constructor(strengh = 50) {
        super();
        this.strengh = strengh;
        this.description = [`Absorbe ${this.strengh} dégats.`, `Maintenu un tour.`];
    }
    
    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number}, size: number): void {
        if (frameLeft == 1) {
            targets[0].stat.applyBuff(new BuffProtection(), this.strengh);
        }
    }
}