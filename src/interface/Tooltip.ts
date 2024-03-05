import { Controller } from "@game/system/Controller";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";

export class Tooltip extends GameObject {

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private text: string;

    constructor(text: string, x: number, y: number, width: number, height: number) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public display(): void {
        // if mouse cursor is inside boundaries, display the tooltip
        if (this.isInbound(Controller.mouseX, Controller.mouseY)) {
            Graphics.ctx.fillStyle = 'grey';
            Graphics.ctx.fillRect(Controller.mouseX, Controller.mouseY-20, Graphics.ctx.measureText(this.text).width+4, 22);
            Graphics.ctx.fillStyle = 'black';
            Graphics.ctx.textAlign = "left";
            Graphics.ctx.font = "18px monospace";
            Graphics.ctx.textBaseline = "top";
            Graphics.ctx.fillText(this.text, Controller.mouseX+2, Controller.mouseY+1-20);
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