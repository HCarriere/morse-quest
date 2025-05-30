import { GameStats } from "@game/content/GameStats";
import { DamageType, Spell, SpellType, TargetAlignment, TargetType } from "..";

export class SpellIronPunch extends Spell {
    public name = "Poing de fer";
    public description = ["Inflige des dégâts physiques à un ennemi"];
    public energyCost = 2;
    public cooldown = 2;

    public icon = {text: "👊", color: 'gray'};
    public spellType = SpellType.Damage;
    public plannedDamage = 20;
    public targetType = TargetType.Single;
    public targetAlignment = TargetAlignment.Enemies;
    public frameAnimationMax = 1;
    public targetMax = 1;

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        if (frameLeft == 1) {
            const target = targets[0];
            target.stat.damage(this.plannedDamage, DamageType.Strike);
        }
    }
}