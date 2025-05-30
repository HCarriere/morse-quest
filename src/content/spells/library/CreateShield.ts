import { GameStats } from "@game/content/GameStats";
import { Spell, SpellType, TargetType } from "../Spell";
import { BuffProtection } from "@game/content/buffs/library/Protection";
import { GameGraphics } from "@game/system/GameGraphics";

export class SpellCreateShield extends Spell {
    public name = "Bouclier magique";
    public description: string[];
    public energyCost = 2;
    
    public icon = {text: "S", color: 'grey'};
    public targetType = TargetType.Self;
    public frameAnimationMax = 30;
    public cooldown = 0;

    public spellType = SpellType.Shield;

    private strengh: number;

    constructor(strengh = 8) {
        super();
        this.strengh = strengh;
        this.description = [`Absorbe ${this.strengh} dégats.`, `Maintenu un tour.`];
    }
    
    public animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}, size: number): void {
        if (frameLeft == 1) {
            targets[0].stat.applyBuff(new BuffProtection(), this.strengh);
        }

        GameGraphics.ctx.font = `bold ${20 + frameLeft*10}px ${GameGraphics.FONT}`;
        GameGraphics.ctx.textAlign = "center";
        GameGraphics.ctx.textBaseline = "middle";
        GameGraphics.ctx.fillStyle = 'grey';
        GameGraphics.ctx.fillText('🛡', targets[0].x, targets[0].y);
    }
}