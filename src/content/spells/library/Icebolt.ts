import { Graphics } from "@game/system/Graphics";
import { Spell, DamageType, TargetType } from "../Spell";
import { GameStats } from "@game/content/GameStats";

export class Spellicebolt extends Spell {
    public name = "Éclair de givre";
    public description = ["Envoie un éclair de givre sur un ennemi."];
    public manaCost = 15;
    public cooldown = 1;
    
    public icon = {text: "🜄", color: 'lightblue'};
    public targetType = TargetType.Single;
    public frameAnimationMax = 80;

    public effect(targets: GameStats[]): void {
        for (const t of targets) {
            t.damage(120, DamageType.Ice);
        }
    }

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
        // todo animation givre
        Graphics.ctx.fillStyle = 'lightblue';

        Graphics.ctx.save();
        Graphics.ctx.translate(targets[0].x, targets[0].y);
        Graphics.ctx.rotate(frameLeft * 0.02);
        Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
        Graphics.ctx.restore();
    }
}