import { GameStats } from "@game/content/GameStats";
import { Spell, SpellType, TargetAlignment, TargetType } from "..";
import { BuffShielded } from "@game/content/buffs";

export class SpellAllyShield extends Spell {
    public name = "Protection d'un allié";
    public description = ["Protège un allié pendant le prochain tour"];
    public icon = {text: "🛡️", color: 'blue'};
    public energyCost = 4;
    public cooldown = 5;
    public spellType = SpellType.Buff;
    public targetType = TargetType.Single;
    public targetAlignment = TargetAlignment.Allies;
    public frameAnimationMax = 1;
    public targetMax = 1;

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        if (frameLeft == 1) {
            const target = targets[0];
            target.stat.applyBuff(new BuffShielded(orig.stat), 1);
        }
    }
}