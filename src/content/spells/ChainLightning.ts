import { GameGraphics } from "@game/system/GameGraphics";
import { GameStats } from "../GameStats";
import { Spell, DamageType, TargetType } from "../Spell";

export class SpellChainLightning extends Spell {
    public name = "Chaine d'éclairs";
    public description = "Envoie une chaine d'éclair sur deux ennemies au choix.";
    public manaCost = 20;
    
    public icon: any;
    public targetType = TargetType.Multiple;
    public frameAnimationMax = 80;
    public targetMax = 2;

    public effect(targets: GameStats[]): void {
        for (const t of targets) {
            t.damage(60, DamageType.Lightning);
        }
    }

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
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