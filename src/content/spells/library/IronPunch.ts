import { GameStats } from "@game/content/GameStats";
import { DamageType, Spell, SpellType, TargetAlignment, TargetType } from "..";
import { GameGraphics } from "@game/system/GameGraphics";

export class SpellIronPunch extends Spell {
    public name = "Poing de fer";
    public description = ["Inflige des dégâts physiques à un ennemi."];
    public energyCost = 2;
    public cooldown = 2;

    public icon = {text: "👊", color: 'gray'};
    public spellType = SpellType.Damage;
    public plannedDamage = 20;
    public targetType = TargetType.Single;
    public targetAlignment = TargetAlignment.Enemies;
    public frameAnimationMax = 30;
    public targetMax = 1;

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        const target = targets[0];
        if (frameLeft == 1) {
            target.stat.damage(this.plannedDamage, DamageType.Strike);
        }
        let animationSize = 5 + (Math.min(this.frameAnimationMax - frameLeft, 0.50 * this.frameAnimationMax)) / this.frameAnimationMax * size;
        GameGraphics.ctx.save();
        GameGraphics.ctx.font = `${animationSize}px ${GameGraphics.FONT}`;
        GameGraphics.ctx.fillStyle = this.icon.color;
        GameGraphics.ctx.textAlign = "center";
        GameGraphics.ctx.textBaseline = "middle";
        GameGraphics.ctx.fillText(this.icon.text, target.x, target.y);
        GameGraphics.ctx.restore();
    }
}