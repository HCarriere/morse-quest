import { EngineObject } from "@game/core/EngineObject";
import { Graphics } from "@game/core/Graphics";
import { EngineController } from "@game/core/EngineController";

export class Tooltip extends EngineObject {

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
        if (this.isInbound(EngineController.mouseX, EngineController.mouseY)) {
            Graphics.ctx.fillStyle = 'grey';
            Graphics.ctx.fillRect(EngineController.mouseX, EngineController.mouseY-20, Graphics.ctx.measureText(this.text).width+4, 22);
            Graphics.ctx.fillStyle = 'black';
            Graphics.ctx.textAlign = "left";
            Graphics.ctx.font = "18px "+Graphics.FONT;
            Graphics.ctx.textBaseline = "top";
            Graphics.ctx.fillText(this.text, EngineController.mouseX+2, EngineController.mouseY+1-20);
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
