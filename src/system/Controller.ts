export class Controller {
    
    static KEY_UP = 1;
    static KEY_DOWN = 2;
    static KEY_LEFT = 3;
    static KEY_RIGHT = 4;

    static KeyMapping = {
        'z': Controller.KEY_UP,
        's': Controller.KEY_DOWN,
        'q': Controller.KEY_LEFT,
        'd': Controller.KEY_RIGHT,

        'ArrowUp': Controller.KEY_UP,
        'ArrowDown': Controller.KEY_DOWN,
        'ArrowLeft': Controller.KEY_LEFT,
        'ArrowRight': Controller.KEY_RIGHT,
    };
}