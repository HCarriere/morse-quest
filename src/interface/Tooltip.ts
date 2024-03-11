import { GameController } from "@game/system/GameController";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";

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
        if (this.isInbound(GameController.mouseX, GameController.mouseY)) {
            GameGraphics.ctx.fillStyle = 'grey';
            GameGraphics.ctx.fillRect(GameController.mouseX, GameController.mouseY-20, GameGraphics.ctx.measureText(this.text).width+4, 22);
            GameGraphics.ctx.fillStyle = 'black';
            GameGraphics.ctx.textAlign = "left";
            GameGraphics.ctx.font = "18px monospace";
            GameGraphics.ctx.textBaseline = "top";
            GameGraphics.ctx.fillText(this.text, GameController.mouseX+2, GameController.mouseY+1-20);
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