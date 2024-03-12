import { EngineGraphics } from "@game/core/EngineGraphics";
import { EngineObject } from "@game/core/EngineObject";

export class Dropdown extends EngineObject {
    constructor(public x: number, public y: number, public width: number, public height: number, public values: string[], public onSelect: (valueSelected: string) => void) {
        super();
        //
    }
    public display() {
        EngineGraphics.ctx.fillStyle = 'white';
        EngineGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);
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