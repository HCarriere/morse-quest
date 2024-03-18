import { GameGraphics } from "@game/system/GameGraphics";
import { GameStats } from "@game/content/GameStats";
import { Spell, DamageType, TargetType, SpellType } from "../Spell";

export class SpellFireball extends Spell {
    public name = "Boule de feu";
    public description = ["Envoie une boule de feu sur les ennemis.", "Inflige 15 dégats."];
    public energyCost = 3;
    public cooldown = 2;

    public spellType = SpellType.Damage;
    public plannedDamage = 15;
    
    public icon = {text: "🜂", color: '#FF9922'};
    public targetType = TargetType.AllEnemies;
    public frameAnimationMax = 120;

    private fireTrail: {x: number, y: number, initialSize: number, initialRotate: number, birthFrame: number, deathFrame: number}[];

    constructor(private power = 1) {
        super();
        if (power > 1) this.icon.color = 'purple';
    }

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number}, size: number): void {
        // effect
        if (frameLeft == 10) {
            for (const t of targets) {
                t.stat.damage(this.plannedDamage * this.power, DamageType.Fire);
            }
        }

        const landFrame = 50;
        const fadeFrame = 20;
        const explosionSize = 3;

        let sum = targets.reduce((acc: {x: number, y: number}, target: {x: number, y: number}) => ({x: acc.x + target.x, y: acc.y + target.y}), {x: 0, y: 0});
        const targetCenter = {x: sum.x / targets.length, y: sum.y / targets.length};
        const progress = frameLeft < landFrame ? 1 : 1 - (frameLeft - landFrame) / (this.frameAnimationMax - landFrame);
        const distProgress = Math.sqrt(progress);
        const fireballPos = {x: orig.x * (1 - distProgress) + targetCenter.x * distProgress, y: orig.y * (1 - distProgress) + targetCenter.y * distProgress};

        size = explosionSize * size / (1 + 20 * (1 - progress));
        if (frameLeft < fadeFrame) size *= frameLeft / fadeFrame;

        const sign = Math.sign(orig.x - targetCenter.x);

        GameGraphics.ctx.save();
        GameGraphics.ctx.fillStyle = 'rgba(161, 1, 0, 0.5)';
        GameGraphics.ctx.translate(fireballPos.x, fireballPos.y);
        GameGraphics.ctx.rotate(sign * frameLeft * 0.02);
        GameGraphics.ctx.fillRect(-size/2, -size/2, size, size);
        GameGraphics.ctx.restore();

        GameGraphics.ctx.save();
        GameGraphics.ctx.fillStyle = 'rgba(218, 31, 5, 0.6)';
        GameGraphics.ctx.translate(fireballPos.x, fireballPos.y);
        GameGraphics.ctx.rotate(10 + sign * frameLeft * 0.02);
        GameGraphics.ctx.fillRect(-2*size/5, -2*size/5, 4*size/5, 4*size/5);
        GameGraphics.ctx.restore();

        GameGraphics.ctx.save();
        GameGraphics.ctx.fillStyle = 'rgba(243, 60, 4, 0.7)';
        GameGraphics.ctx.translate(fireballPos.x, fireballPos.y);
        GameGraphics.ctx.rotate(sign * frameLeft * 0.04);
        GameGraphics.ctx.fillRect(-size/3, -size/3, 2*size/3, 2*size/3);
        GameGraphics.ctx.restore();

        GameGraphics.ctx.save();
        GameGraphics.ctx.fillStyle = 'rgba(254, 101, 13, 0.8)';
        GameGraphics.ctx.translate(fireballPos.x, fireballPos.y);
        GameGraphics.ctx.rotate(10 + sign * frameLeft * 0.04);
        GameGraphics.ctx.fillRect(-2*size/7, -2*size/7, 4*size/7, 4*size/7);
        GameGraphics.ctx.restore();

        GameGraphics.ctx.save();
        GameGraphics.ctx.fillStyle = 'rgba(255, 193, 31, 0.9)';
        GameGraphics.ctx.translate(fireballPos.x, fireballPos.y);
        GameGraphics.ctx.rotate(sign * frameLeft * 0.06);
        GameGraphics.ctx.fillRect(-size/4, -size/4, size/2, size/2);
        GameGraphics.ctx.restore();

        GameGraphics.ctx.save();
        GameGraphics.ctx.fillStyle = 'rgba(255, 247, 93, 1)';
        GameGraphics.ctx.translate(fireballPos.x, fireballPos.y);
        GameGraphics.ctx.rotate(10 + sign * frameLeft * 0.06);
        GameGraphics.ctx.fillRect(-size/6, -size/6, size/3, size/3);
        GameGraphics.ctx.restore();

        // Fire Trail
        const chanceToKeepTrail = 0.3;
        if (frameLeft == this.frameAnimationMax) this.fireTrail = [];
        if (Math.random() < chanceToKeepTrail) this.fireTrail.push({...fireballPos, initialSize: size/4, initialRotate: 10 + frameLeft * 0.06, birthFrame: frameLeft, deathFrame: Math.random() * frameLeft});
        this.fireTrail = this.fireTrail.filter(fireSpark => fireSpark.deathFrame <= frameLeft);
        this.fireTrail.forEach(fireSpark => {
            const sparkLifetime = (fireSpark.birthFrame - frameLeft) / (fireSpark.birthFrame - fireSpark.deathFrame);
            const sparkOpacity = 1 - sparkLifetime;
            const sparkSize = fireSpark.initialSize / (1 + sparkLifetime);
            GameGraphics.ctx.save();
            GameGraphics.ctx.fillStyle = `rgba(255, 247, 93, ${sparkOpacity})`;
            GameGraphics.ctx.translate(fireSpark.x, fireSpark.y);
            GameGraphics.ctx.rotate(fireSpark.initialRotate + sign * frameLeft * 0.01);
            GameGraphics.ctx.fillRect(-sparkSize/2, -sparkSize/2, sparkSize, sparkSize);
            GameGraphics.ctx.restore();
        });
    }
}
