import { Graphics } from "@game/system/Graphics";
import { GameStats } from "../GameStats";
import { Spell, DamageType, TargetType } from "../Spell";

export class SpellFireball extends Spell {
    public name = "Boule de feu";
    public description = "Envoie une boule de feu sur les ennemis, infligeant des dégats de feu.";
    public manaCost = 20;
    
    public icon: any;
    public targetType = TargetType.AllEnemies;
    public frameAnimationMax = 120;

    private fireTrail: {x: number, y: number, initialSize: number, initialRotate: number, birthFrame: number, deathFrame: number}[];

    public effect(targets: GameStats[]): void {
        for (const t of targets) {
            t.damage(40, DamageType.Fire);
        }
    }

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
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

        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'rgba(161, 1, 0, 0.5)';
        Graphics.ctx.translate(fireballPos.x, fireballPos.y);
        Graphics.ctx.rotate(sign * frameLeft * 0.02);
        Graphics.ctx.fillRect(-size/2, -size/2, size, size);
        Graphics.ctx.restore();

        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'rgba(218, 31, 5, 0.6)';
        Graphics.ctx.translate(fireballPos.x, fireballPos.y);
        Graphics.ctx.rotate(10 + sign * frameLeft * 0.02);
        Graphics.ctx.fillRect(-2*size/5, -2*size/5, 4*size/5, 4*size/5);
        Graphics.ctx.restore();

        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'rgba(243, 60, 4, 0.7)';
        Graphics.ctx.translate(fireballPos.x, fireballPos.y);
        Graphics.ctx.rotate(sign * frameLeft * 0.04);
        Graphics.ctx.fillRect(-size/3, -size/3, 2*size/3, 2*size/3);
        Graphics.ctx.restore();

        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'rgba(254, 101, 13, 0.8)';
        Graphics.ctx.translate(fireballPos.x, fireballPos.y);
        Graphics.ctx.rotate(10 + sign * frameLeft * 0.04);
        Graphics.ctx.fillRect(-2*size/7, -2*size/7, 4*size/7, 4*size/7);
        Graphics.ctx.restore();

        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'rgba(255, 193, 31, 0.9)';
        Graphics.ctx.translate(fireballPos.x, fireballPos.y);
        Graphics.ctx.rotate(sign * frameLeft * 0.06);
        Graphics.ctx.fillRect(-size/4, -size/4, size/2, size/2);
        Graphics.ctx.restore();

        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'rgba(255, 247, 93, 1)';
        Graphics.ctx.translate(fireballPos.x, fireballPos.y);
        Graphics.ctx.rotate(10 + sign * frameLeft * 0.06);
        Graphics.ctx.fillRect(-size/6, -size/6, size/3, size/3);
        Graphics.ctx.restore();

        // Fire Trail
        const chanceToKeepTrail = 0.3;
        if (frameLeft == this.frameAnimationMax) this.fireTrail = [];
        if (Math.random() < chanceToKeepTrail) this.fireTrail.push({...fireballPos, initialSize: size/4, initialRotate: 10 + frameLeft * 0.06, birthFrame: frameLeft, deathFrame: Math.random() * frameLeft});
        this.fireTrail = this.fireTrail.filter(fireSpark => fireSpark.deathFrame <= frameLeft);
        this.fireTrail.forEach(fireSpark => {
            const sparkLifetime = (fireSpark.birthFrame - frameLeft) / (fireSpark.birthFrame - fireSpark.deathFrame);
            const sparkOpacity = 1 - sparkLifetime;
            const sparkSize = fireSpark.initialSize / (1 + sparkLifetime);
            Graphics.ctx.save();
            Graphics.ctx.fillStyle = `rgba(255, 247, 93, ${sparkOpacity})`;
            Graphics.ctx.translate(fireSpark.x, fireSpark.y);
            Graphics.ctx.rotate(fireSpark.initialRotate + sign * frameLeft * 0.01);
            Graphics.ctx.fillRect(-sparkSize/2, -sparkSize/2, sparkSize, sparkSize);
            Graphics.ctx.restore();
        });
    }
}