export class EngineController {
    
    public static KEY_UP = 1;
    public static KEY_DOWN = 2;
    public static KEY_LEFT = 3;
    public static KEY_RIGHT = 4;

    public static KeyMapping = {
        'z': EngineController.KEY_UP,
        's': EngineController.KEY_DOWN,
        'q': EngineController.KEY_LEFT,
        'd': EngineController.KEY_RIGHT,

        'ArrowUp': EngineController.KEY_UP,
        'ArrowDown': EngineController.KEY_DOWN,
        'ArrowLeft': EngineController.KEY_LEFT,
        'ArrowRight': EngineController.KEY_RIGHT,
    };

    public static mouseX: number;
    public static mouseY: number;
    public static mousePressed: boolean = false;
}