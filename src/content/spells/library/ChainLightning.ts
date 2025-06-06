import { GameGraphics } from "@game/system/GameGraphics";
import { GameStats } from "@game/content/GameStats";
import { Spell, DamageType, TargetType, SpellType, TargetAlignment } from "../Spell";

export class SpellChainLightning extends Spell {
    public name = "Chaine d'éclairs";
    public description = ["Envoie une chaine d'éclair sur deux ennemies au choix.", 'Inflige 12 dégats.'];
    public energyCost = 2;
    public cooldown = 2;
    
    public icon = {text: "🜁", color: '#205099'};
    public targetAlignment = TargetAlignment.Enemies;
    public targetType = TargetType.Multiple;
    public frameAnimationMax = 80;
    public targetMax = 2;

    public spellType = SpellType.Damage;
    public plannedDamage = 12;

    
    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        // effect
        if (frameLeft == 10) {
            for (const t of targets) {
                t.stat.damage(this.plannedDamage, DamageType.Lightning);
            }
        }

        GameGraphics.ctx.fillStyle = 'blue';

        size = size / 2;

        for (const target of targets) {
            GameGraphics.ctx.save();
            GameGraphics.ctx.translate(target.x, target.y);
            GameGraphics.ctx.rotate(frameLeft * 0.3);
            GameGraphics.ctx.fillRect( - size/2 , -size/2, size, size);
            GameGraphics.ctx.restore();
        }
    }
}
