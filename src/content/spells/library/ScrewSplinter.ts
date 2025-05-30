import { GameStats } from "@game/content/GameStats";
import { DamageType, Spell, SpellType, TargetAlignment, TargetType } from "../Spell";
import { GameGraphics } from "@game/system/GameGraphics";
import { DebufBlind } from "@game/content/buffs";

export class SpellScrewSplinters extends Spell {
    public name = "Éclats de vis";
    public description = ["Des éclats de vis qui avenglent les ennemis s'ils arrivent dans l'oeil."];
    public energyCost = 1;
    public cooldown = 0;

    public spellType = SpellType.Damage;
    public plannedDamage = 2;

    public icon = {text: "🔩", color: 'silver'};
    public targetAlignment = TargetAlignment.Enemies;
    public targetType = TargetType.AllEnemies;
    public frameAnimationMax = 60;

    private screwTargets: {x: number, y: number}[] = [];

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        // effect
        if (frameLeft == 1) {
            for (const t of targets) {
                t.stat.damage(this.plannedDamage, DamageType.Piercing);
                // Has 80% chance to blind the target
                if (Math.random() < 0.8) {
                    t.stat.applyBuff(new DebufBlind(), 1);
                    GameGraphics.addInterfaceParticle({
                        x: t.x - t.stat.size / 2,
                        y: t.y - t.stat.size / 2,
                        text: 'Blinded',
                        color: '#666',
                        size: 25,
                        life: 120,
                        vx: Math.random()*4-2,
                        vy: Math.random()*2-6,
                        friction: 0.97,
                    });
                }
            }
        }
        // init targets
        if (frameLeft == this.frameAnimationMax) {
            this.screwTargets = targets.flatMap(t => {
                let targetHits: {x: number, y: number}[] = [];
                for (let i = 0; i < 10; i++) {
                    targetHits.push({
                        x: t.x + (Math.random() - 0.5) * t.stat.size,
                        y: t.y + (Math.random() - 0.5) * t.stat.size,
                    });
                }
                return targetHits;
            });
        }
        // animation
        GameGraphics.ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
        GameGraphics.ctx.lineWidth = 4;
        GameGraphics.ctx.beginPath();
        for (const t of this.screwTargets) {
            let splinterWidth = (t.x - orig.x) * size / 10000;
            let splinterHeight = (t.y - orig.y) * size / 10000;
            let splinterX = orig.x + (t.x - orig.x) * (1 - frameLeft / this.frameAnimationMax);
            let splinterY = orig.y + (t.y - orig.y) * (1 - frameLeft / this.frameAnimationMax);
            GameGraphics.ctx.moveTo(splinterX, splinterY);
            GameGraphics.ctx.lineTo(splinterX + splinterWidth, splinterY + splinterHeight);
        }
        GameGraphics.ctx.stroke();
    }
}