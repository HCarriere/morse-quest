import { EngineObject } from "@game/core/EngineObject";
import { Tooltip } from "../Tooltip";
import { EngineGraphics } from "@game/core/EngineGraphics";
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

    private tooltip: Tooltip;

    constructor(public x: number, public y: number, public width: number, public height: number, public onClick: () => void, public style: ButtonStyle = {}, tooltip?: string) {
        super();
        if(tooltip) {
            this.tooltip = new Tooltip(tooltip, x, y, width, height);
        }
    }

    public display() {
        if (this.style.colorHover && this.isInbound(EngineController.mouseX, EngineController.mouseY)) {
            EngineGraphics.ctx.fillStyle = this.style.colorHover;
        } else {
            EngineGraphics.ctx.fillStyle = this.style.color || 'black';
        }
        EngineGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.style.text) {
            EngineGraphics.ctx.fillStyle = this.style.textColor || 'grey';
            EngineGraphics.ctx.textAlign = "center";
            EngineGraphics.ctx.font = this.style.textSize + "px Luminari";
            EngineGraphics.ctx.textBaseline = "middle";
            EngineGraphics.ctx.fillText(this.style.text, this.x + this.width/2, this.y + this.height/2);
        }
        if (this.style.strokeColor) {
            EngineGraphics.ctx.lineWidth = 1;
            EngineGraphics.ctx.strokeStyle = this.style.strokeColor;
            EngineGraphics.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    public displayTooltip() {
        if(this.tooltip) {
            this.tooltip.display();
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
