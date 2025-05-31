import { GameStats } from "@game/content/GameStats";
import { Spell, SpellType, TargetAlignment, TargetType } from "..";
import { BuffShielded } from "@game/content/buffs";
import { GameGraphics } from "@game/system/GameGraphics";

export class SpellAllyShield extends Spell {
    public name = "Protection d'un allié";
    public description = ["Protège un allié pendant le prochain tour et prend les dégâts à sa place."];
    public icon = {text: "🛡️", color: 'blue'};
    public energyCost = 4;
    public cooldown = 5;
    public spellType = SpellType.Buff;
    public targetType = TargetType.Single;
    public targetAlignment = TargetAlignment.Allies;
    public frameAnimationMax = 30;
    public targetMax = 1;

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        const target = targets[0];
        if (frameLeft == 1) {
            target.stat.applyBuff(new BuffShielded(orig.stat), 1);
        }
        let animationSize = 5 + (Math.min(this.frameAnimationMax - frameLeft, 0.50 * this.frameAnimationMax)) / this.frameAnimationMax * size;
        GameGraphics.ctx.save();
        GameGraphics.ctx.font = `${animationSize}px ${GameGraphics.FONT}`;
        GameGraphics.ctx.fillStyle = this.icon.color;
        GameGraphics.ctx.fillText(this.icon.text, target.x - animationSize / 2, target.y + animationSize / 2);
        GameGraphics.ctx.restore();
    }
}