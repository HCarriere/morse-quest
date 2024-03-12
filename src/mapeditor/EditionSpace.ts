import { EngineGraphics } from "@game/core/EngineGraphics";
import { EngineObject } from "@game/core/EngineObject";

export class EditionSpace extends EngineObject {
    public static EditionGridWidth: number = 200;
    public static EditionGridHeighth: number = 100;
    constructor(public endX: number) {
        super();
    }
    public display() {
        EngineGraphics.ctx.fillStyle = 'red';
        EngineGraphics.ctx.fillRect(0, 0, this.endX, EngineGraphics.canvas.height);
    }
}