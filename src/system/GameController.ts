import { EngineController } from "@game/core/EngineController";
import { Camera } from "./Camera";

export class GameController extends EngineController {
    public static get mouseTileX(): number {
        return Math.floor((GameController.mouseX + Camera.offsetX) / Camera.cellSize);
    }

    public static get mouseTileY(): number {
        return Math.floor((GameController.mouseY + Camera.offsetY) / Camera.cellSize);
    }
}