import { EngineObject } from "@game/core/EngineObject";
import { EngineGraphics } from "@game/core/EngineGraphics";
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
            EngineGraphics.ctx.fillStyle = 'grey';
            EngineGraphics.ctx.fillRect(EngineController.mouseX, EngineController.mouseY-20, EngineGraphics.ctx.measureText(this.text).width+4, 22);
            EngineGraphics.ctx.fillStyle = 'black';
            EngineGraphics.ctx.textAlign = "left";
            EngineGraphics.ctx.font = "18px monospace";
            EngineGraphics.ctx.textBaseline = "top";
            EngineGraphics.ctx.fillText(this.text, EngineController.mouseX+2, EngineController.mouseY+1-20);
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