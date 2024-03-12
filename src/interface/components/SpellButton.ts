import { Spell } from "@game/content/spells/Spell";
import { Controller } from "@game/system/Controller";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { Player } from "@game/system/Player";

export class SpellButton extends GameObject {
    
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private spell: Spell;
    private index: number;

    private onClick: (index: number, sb: SpellButton) => void;

    private onHover: (spell: Spell) => void;

    constructor(
        x: number, y: number, width: number, height: number, spell: Spell, 
        index: number, onClick: (n: number, sb: SpellButton) => void, onHover: (spell: Spell) => void,
        ) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spell = spell;
        this.index = index;
        this.onClick = onClick;
        this.onHover = onHover;
    }

    public display() {
        // background
        Graphics.ctx.fillStyle = '#000000';
        if (this.isInbound(Controller.mouseX, Controller.mouseY)) {
            Graphics.ctx.fillStyle = '#222222';
            this.onHover(this.spell);
        }
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);

        // border 
        if (!this.spell.isActive) {
            Graphics.ctx.lineWidth = 1;
            Graphics.ctx.strokeStyle = '#DDDDDD';
        } else {
            
            Graphics.ctx.lineWidth = 2;
            Graphics.ctx.strokeStyle = 'lightgreen';
        }
        Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // icon
        Graphics.displayIcon(this.spell.icon, this.x + 5, this.y + 5, 18);

        // title
        Graphics.ctx.font = "14px "+Graphics.FONT;
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "right";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(this.spell.name, this.x + this.width - 5, this.y + 5);
    
        // cooldowns
        Graphics.ctx.textBaseline = "bottom";
        if (this.spell.currentCooldown == 0) {
            Graphics.ctx.fillText(this.spell.cooldown + ' ⧖', this.x + this.width - 5, this.y + this.height - 5);
        } else {
            // on cooldown
            Graphics.ctx.fillStyle = 'red';
            Graphics.ctx.fillText(this.spell.cooldown + ' ⧖ '+this.spell.currentCooldown, this.x + this.width - 5, this.y + this.height - 5);
        }

        // mana costs
        Graphics.ctx.textAlign = "left";
        if (this.spell.energyCost <= Player.stats.energy) {
            // enough mana
            Graphics.ctx.fillStyle = 'aqua';
        } else {
            // not enough mana
            Graphics.ctx.fillStyle = 'red';
        }
        Graphics.ctx.fillText(this.spell.energyCost + ' energy', this.x + 5, this.y + this.height - 5);
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