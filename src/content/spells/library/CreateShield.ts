import { GameStats } from "@game/content/GameStats";
import { Spell, TargetType } from "../Spell";
import { BuffProtection } from "@game/content/buffs/library/Protection";

export class SpellCreateShield extends Spell {
    public name = "Bouclier magique";
    public description = ["Absorbe 10 dégats."];
    public energyCost = 0;
    
    public icon = {text: "S", color: 'grey'};
    public targetType = TargetType.Self;
    public frameAnimationMax = 10;
    public cooldown = 1;
    
    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number}, size: number): void {
        if (frameLeft == 1) {
            targets[0].stat.applyBuff(new BuffProtection(), 50);
        }
    }
}