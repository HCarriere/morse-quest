import { Camera } from "./Camera";

export class Controller {
    
    public static KEY_UP = 1;
    public static KEY_DOWN = 2;
    public static KEY_LEFT = 3;
    public static KEY_RIGHT = 4;

    public static KeyMapping = {
        'z': Controller.KEY_UP,
        's': Controller.KEY_DOWN,
        'q': Controller.KEY_LEFT,
        'd': Controller.KEY_RIGHT,

        'ArrowUp': Controller.KEY_UP,
        'ArrowDown': Controller.KEY_DOWN,
        'ArrowLeft': Controller.KEY_LEFT,
        'ArrowRight': Controller.KEY_RIGHT,
    };

    public static mouseX: number;
    public static mouseY: number;
    public static mousePressed: boolean = false;

    public static get mouseTileX(): number {
        return Math.floor((Controller.mouseX + Camera.offsetX) / Camera.cellSize);
    }

    public static get mouseTileY(): number {
        return Math.floor((Controller.mouseY + Camera.offsetY) / Camera.cellSize);
    }
}