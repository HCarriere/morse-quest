import { EngineObject } from "@game/core/EngineObject";
import { Tooltip } from "../Tooltip";
import { Graphics } from "@game/core/Graphics";
import { EngineController } from "@game/core/EngineController";


export interface ButtonStyle {
    text?: string;
    textSize?: number;
    color?: string;
    textColor?: string;
    strokeColor?: string;
    colorHover?: string;
}

export class Button extends EngineObject {

    constructor(public x: number, public y: number, public width: number, public height: number, public onClick: () => void, public style: ButtonStyle = {}) {
        super();
    }

    public display() {
        if (this.style.colorHover && this.isInbound(EngineController.mouseX, EngineController.mouseY)) {
            Graphics.ctx.fillStyle = this.style.colorHover;
        } else {
            Graphics.ctx.fillStyle = this.style.color || 'black';
        }
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.style.text) {
            Graphics.ctx.fillStyle = this.style.textColor || 'grey';
            Graphics.ctx.textAlign = "center";
            Graphics.ctx.font = this.style.textSize + "px Luminari";
            Graphics.ctx.textBaseline = "middle";
            Graphics.ctx.fillText(this.style.text, this.x + this.width/2, this.y + this.height/2);
        }
        if (this.style.strokeColor) {
            Graphics.ctx.lineWidth = 1;
            Graphics.ctx.strokeStyle = this.style.strokeColor;
            Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.onClick();
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
