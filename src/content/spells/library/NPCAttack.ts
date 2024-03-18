import { GameStats } from "@game/content/GameStats";
import { Spell, DamageType, TargetType, SpellType } from "../Spell";

export class SpellNPCAttack extends Spell {
    public name = "Attaque";
    public description = ["Une attaque simple."];
    public energyCost = 1;
    public cooldown = 0;
    
    public spellType = SpellType.Damage;
    public plannedDamage = 10;

    public icon = {text: "ATK", color: 'red'};
    public targetType = TargetType.Single;
    public frameAnimationMax = 80;


    constructor(private damage = 10, private number = 1) {
        super();
        this.plannedDamage = damage * number;
    }

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number}, size: number): void {
        // effect
        if (frameLeft == 10) {
            for (let i = 0; i < this.number; i++) {
                targets[0].stat.damage(this.damage, DamageType.Slashing);
            }
        }
    }
}
