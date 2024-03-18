import { GameStats } from "@game/content/GameStats";
import { Spell, DamageType, TargetType, SpellType } from "../Spell";
import { GameGraphics } from "@game/system/GameGraphics";

export class SpellNPCAttack extends Spell {
    public name = "Attaque";
    public description = ["Une attaque simple."];
    public energyCost = 1;
    public cooldown = 0;
    
    public spellType = SpellType.Damage;
    public plannedDamage = 10;

    public icon = {text: "ATK", color: 'red'};
    public targetType = TargetType.Single;
    public frameAnimationMax = 30;


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
        for (let i=0; i<15; i++) {
            GameGraphics.addInterfaceParticle({
                life: 30,
                size: 10,
                color: Math.random() > 0.5 ?"darkred":"red",
                x: targets[0].x,
                y: targets[0].y - frameLeft * 10 + (this.frameAnimationMax*5),
                vx: Math.random()*10-5,
                vy: Math.random()-0.5,
                friction: 1,
                sizeLosePerFrame: 0.5,
            })
        }
    }
}
