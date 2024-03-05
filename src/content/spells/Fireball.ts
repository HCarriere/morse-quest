import { Graphics } from "@game/system/Graphics";
import { GameStats } from "../GameStats";
import { Spell, DamageType, TargetType } from "../Spell";

export class Fireball extends Spell {
    public name = "Boule de feu";
    public description = "Envoie une boule de feu sur un ennemi, infligeant des dégats de feu.";
    public manaCost = 20;
    
    public icon: any;
    public targetType = TargetType.Multiple;
    public frameAnimationMax = 80;

    public effect(target: GameStats): void {
        target.damage(50, DamageType.Fire);
    }

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
        Graphics.ctx.fillStyle = 'orange';

        size = size / (frameLeft/10 + 1);

        Graphics.ctx.save();
        Graphics.ctx.translate(Graphics.canvas.width/2, Graphics.canvas.height/2);
        Graphics.ctx.rotate(frameLeft * 0.02);
        Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
        Graphics.ctx.restore();

        for (const target of targets) {
            const s = size/8;
            Graphics.ctx.save();
            Graphics.ctx.translate(target.x, target.y);
            Graphics.ctx.rotate(frameLeft * 0.04);
            Graphics.ctx.fillRect( - s/2 , -s/2, s, s);
            Graphics.ctx.restore();
        }
    }
}