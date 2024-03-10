import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { Tooltip } from "../Tooltip";
import { Controller } from "@game/system/Controller";


export interface ButtonStyle {
    text?: string;
    textSize?: number;
    color?: string;
    textColor?: string;
    strokeColor?: string;
    colorHover?: string;
}

export class Button extends GameObject {

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
        if (this.style.colorHover && this.isInbound(Controller.mouseX, Controller.mouseY)) {
            Graphics.ctx.fillStyle = this.style.colorHover;
        } else {
            Graphics.ctx.fillStyle = this.style.color || 'black';
        }
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.style.text) {
            Graphics.ctx.fillStyle = this.style.textColor || 'grey';
            Graphics.ctx.textAlign = "center";
            Graphics.ctx.font = this.style.textSize + "px monospace";
            Graphics.ctx.textBaseline = "middle";
            Graphics.ctx.fillText(this.style.text, this.x + this.width/2, this.y + this.height/2);
        }
        if (this.style.strokeColor) {
            Graphics.ctx.lineWidth = 1;
            Graphics.ctx.strokeStyle = this.style.strokeColor;
            Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);
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