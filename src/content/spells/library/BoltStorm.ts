import { GameStats } from "@game/content/GameStats";
import { DamageType, Spell, SpellType, TargetAlignment, TargetType } from "..";
import { GameGraphics, Particle } from "@game/system/GameGraphics";
import { BuffConcentration } from "@game/content/buffs";
import { GameInterface } from "@game/interface/GameInterface";

export class SpellBoltStorm extends Spell {
    public name = "Tempête de boulons";
    public description = ["Lance une tempête de boulons sur tous les ennemis, qui dure plusieurs tours tant que le lanceur reste concentré."];
    public energyCost = 4;
    public cooldown = 5;

    public icon = {text: "⬡", color: 'grey'};
    public spellType = SpellType.Damage;
    public plannedDamage = 15;
    public targetType = TargetType.AllEnemies;
    public targetAlignment = TargetAlignment.Enemies;
    public useAccuracy = false;
    public frameAnimationMax = 60;

    constructor(public isRepetition: boolean = false) {
        super();
    }

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        if (frameLeft == 1) {
            for (const t of targets) {
                t.stat.damage(this.plannedDamage, DamageType.Strike);
            }
            if (!this.isRepetition) {
                // If this is the original cast, apply the buff to the original caster, so that the storm continues
                orig.stat.applyBuff(new BuffConcentration(
                    {text: "⬡", color: 'grey'},
                    3,
                    'Tempête de boulons',
                    () => GameInterface.bufferSpellInCombat(new SpellBoltStorm(true), targets, orig)
                ), 1);
            }
        }
        if (frameLeft == this.frameAnimationMax) {
            this.generateTornado(targets, this.frameAnimationMax / 2, this.frameAnimationMax);
        }
    }

    private generateTornado(targets: {x: number, y: number, stat: GameStats}[], rotationPeriod: number, animationDuration: number): void {
        let targetMinX = Math.min(...targets.map(t => t.x - t.stat.size / 2));
        let targetMaxX = Math.max(...targets.map(t => t.x + t.stat.size / 2));
        let targetMinY = Math.min(...targets.map(t => t.y - t.stat.size / 2));
        let targetMaxY = Math.max(...targets.map(t => t.y + t.stat.size / 2));
        let tornadoCenterX = (targetMinX + targetMaxX) / 2;
        let boltNumber = 10 * targets.length;
        for (let i = 0; i < boltNumber; i++) {
            this.generateBoltParticle(
                {x: tornadoCenterX, y: Math.random() * (targetMaxY - targetMinY) + targetMinY},
                (targetMaxX - targetMinX) / 2,
                rotationPeriod,
                animationDuration,
            );
        }
    }

    private generateBoltParticle(tornadoCenter: {x: number, y: number}, tornadoRadius: number, rotationPeriod: number, animationDuration: number): void {
        let phi = Math.random() * Math.PI * 2;
        let omega = 2 * Math.PI / rotationPeriod;
        GameGraphics.addInterfaceParticle({
            x: tornadoRadius * Math.cos(phi) + tornadoCenter.x,
            y: tornadoCenter.y,
            color: 'grey',
            size: 5,
            life: animationDuration,
            vx: - tornadoRadius * Math.sin(phi) * omega,
            vy: 0,
            friction: 1,
            update: (particle: Particle) => {
                particle.vx -= omega * omega * (particle.x - tornadoCenter.x);
                particle.x += particle.vx;
            }
        });
    }
}