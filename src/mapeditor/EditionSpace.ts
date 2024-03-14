import { Graphics } from "@game/core/Graphics";
import { EngineObject } from "@game/core/EngineObject";
import { MapManager } from "./MapManager";

export class EditionSpace extends EngineObject {
    public static EditionGridWidth: number = 200;
    public static EditionGridHeighth: number = 100;
    constructor(public endX: number) {
        super();
    }
    public init(): void {
        MapManager.loadMap(MapManager.getMapList()[0]);
    }
    public display() {
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'red';
        Graphics.ctx.fillRect(0, 0, this.endX, Graphics.canvas.height);
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "center";
        Graphics.ctx.font = 200 + "px Luminari";
        Graphics.ctx.textBaseline = "middle";
        Graphics.ctx.fillText(MapManager.currentMapId, this.endX / 2, Graphics.canvas.height / 2);
        Graphics.ctx.restore();
    }
}