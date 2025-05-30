import { Spell } from "@game/content/spells/Spell";
import { GameController } from "@game/system/GameController";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";
import { Player } from "@game/system/Player";
import { GameStats } from "@game/content/GameStats";

export class SpellButton extends EngineObject {

    constructor(
        public x: number, public y: number, public width: number, public height: number, public spell: Spell, 
        public index: number, private onClick: (n: number, sb: SpellButton) => void, private onHover: (spell: Spell) => void,
        private stats: GameStats = Player.stats
        ) {
        super();
    }

    public display() {
        // background
        GameGraphics.ctx.fillStyle = '#000000';
        if (this.isInbound(GameController.mouseX, GameController.mouseY)) {
            GameGraphics.ctx.fillStyle = '#222222';
            this.onHover(this.spell);
        }
        GameGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);

        // border 
        if (!this.spell.isActive) {
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.strokeStyle = '#DDDDDD';
        } else {
            
            GameGraphics.ctx.lineWidth = 2;
            GameGraphics.ctx.strokeStyle = 'lightgreen';
        }
        GameGraphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // icon
        GameGraphics.displayIcon(this.spell.icon, this.x + 5, this.y + 5, 18);
        // planned effect
        GameGraphics.displayTurnIntent(this.spell, this.x + 25, this.y + 21);

        // title
        GameGraphics.ctx.font = "14px "+GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = "right";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(this.spell.name, this.x + this.width - 5, this.y + 5);
    
        // cooldowns
        GameGraphics.ctx.textBaseline = "bottom";
        if (this.spell.currentCooldown == 0) {
            GameGraphics.ctx.fillText(this.spell.cooldown + ' ⧖', this.x + this.width - 5, this.y + this.height - 5);
        } else {
            // on cooldown
            GameGraphics.ctx.fillStyle = 'red';
            GameGraphics.ctx.fillText(this.spell.cooldown + ' ⧖ '+this.spell.currentCooldown, this.x + this.width - 5, this.y + this.height - 5);
        }

        // mana costs
        GameGraphics.ctx.textAlign = "left";
        if (!this.stats || this.spell.energyCost <= this.stats.energy) {
            // enough mana
            GameGraphics.ctx.fillStyle = 'aqua';
        } else {
            // not enough mana
            GameGraphics.ctx.fillStyle = 'red';
        }
        GameGraphics.ctx.fillText(this.spell.energyCost + ' energy', this.x + 5, this.y + this.height - 5);
    }



    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.onClick(this.index, this);
        }
    }

    /**
     * Returns true if x,y is inside button
     * @param x 
     * @param y 
     */
    private isInbound(x: number, y: number): boolean {
        return (x > this.x && x < this.x + this.width && 
                y > this.y && y < this.y + this.height);
    }

}
