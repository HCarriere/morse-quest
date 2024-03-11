import { GameGraphics } from "@game/system/GameGraphics";
import { GameStats } from "../GameStats";
import { Spell, DamageType, TargetType } from "../Spell";

export class Spellicebolt extends Spell {
    public name = "Éclair de givre";
    public description = "Envoi un éclair de givre sur un ennemi.";
    public manaCost = 15;
    
    public icon: any;
    public targetType = TargetType.Single;
    public frameAnimationMax = 80;

    public effect(targets: GameStats[]): void {
        for (const t of targets) {
            t.damage(120, DamageType.Ice);
        }
    }

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
        // todo animation givre
        GameGraphics.ctx.fillStyle = 'lightblue';

        GameGraphics.ctx.save();
        GameGraphics.ctx.translate(targets[0].x, targets[0].y);
        GameGraphics.ctx.rotate(frameLeft * 0.02);
        GameGraphics.ctx.fillRect( - size/2 , -size/2, size, size);
        GameGraphics.ctx.restore();
    }
}