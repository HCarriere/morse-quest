import { Graphics } from "@game/core/Graphics";
import { EngineObject } from "@game/core/EngineObject";

export class EditionSpace extends EngineObject {
    public static EditionGridWidth: number = 200;
    public static EditionGridHeighth: number = 100;
    constructor(public endX: number) {
        super();
    }
    public display() {
        Graphics.ctx.fillStyle = 'red';
        Graphics.ctx.fillRect(0, 0, this.endX, Graphics.canvas.height);
    }
}