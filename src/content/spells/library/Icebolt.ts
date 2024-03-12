import { GameGraphics } from "@game/system/GameGraphics";
import { Spell, DamageType, TargetType } from "../Spell";
import { GameStats } from "@game/content/GameStats";

export class Spellicebolt extends Spell {
    public name = "Éclair de givre";
    public description = ["Envoie un éclair de givre sur un ennemi."];
    public energyCost = 1;
    public cooldown = 1;
    
    public icon = {text: "🜄", color: 'lightblue'};
    public targetType = TargetType.Single;
    public frameAnimationMax = 80;

    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number}, size: number): void {

        // effect
        if (frameLeft == 10) {
            for (const t of targets) {
                t.stat.damage(120, DamageType.Ice);
            }
        }

        // todo animation givre
        GameGraphics.ctx.fillStyle = 'lightblue';

        GameGraphics.ctx.save();
        GameGraphics.ctx.translate(targets[0].x, targets[0].y);
        GameGraphics.ctx.rotate(frameLeft * 0.02);
        GameGraphics.ctx.fillRect( - size/2 , -size/2, size, size);
        GameGraphics.ctx.restore();
    }
}
