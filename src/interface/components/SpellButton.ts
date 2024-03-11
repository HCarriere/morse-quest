import { Spell } from "@game/content/spells/Spell";
import { Controller } from "@game/system/Controller";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";

export class SpellButton extends GameObject {
    
    
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private spell: Spell;
    private index: number;

    private onClick: (index: number) => void;

    constructor(x: number, y: number, width: number, height: number, spell: Spell, index: number, onClick: (n: number) => void) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spell = spell;
        this.index = index;
        this.onClick = onClick;
    }

    public display() {
        // background
        Graphics.ctx.fillStyle = '#000000';
        if (this.isInbound(Controller.mouseX, Controller.mouseY)) {
            Graphics.ctx.fillStyle = '#222222';
        }
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);

        // border 
        Graphics.ctx.lineWidth = 1;
        Graphics.ctx.strokeStyle = '#DDDDDD';
        Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // title
        Graphics.ctx.font = "12px monospace";
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "right";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(this.spell.name, this.x + this.width - 5, this.y + 5);
    
        
    }

    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.onClick(this.index);
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