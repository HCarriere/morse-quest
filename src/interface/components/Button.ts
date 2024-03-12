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

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private tooltip: Tooltip;
    private onClick: () => void;

    private style: ButtonStyle;

    constructor(x: number, y: number, width: number, height: number, onClick: () => void, style: ButtonStyle = {}, tooltip?: string) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClick = onClick;
        this.style = style;
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
            EngineGraphics.ctx.font = this.style.textSize + "px monospace";
            EngineGraphics.ctx.textBaseline = "middle";
            EngineGraphics.ctx.fillText(this.style.text, this.x + this.width/2, this.y + this.height/2);
        }
        if (this.style.strokeColor) {
            EngineGraphics.ctx.lineWidth = 3;
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