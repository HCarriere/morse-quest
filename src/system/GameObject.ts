
export abstract class GameObject {
    
    constructor() {
        this.init();
    }

    /**
     * At end of GameObject constructor
     */
    public init() {}

    /**
     * Each loop
     */
    public abstract display();

    /**
     * Each resize event
     */
    public resize() {}

    /**
     * Each keypress event
     * @param orientation 
     */
    public keyPressed(orientation: number) {}

    /**
     * Each mouse pressed event
     * @param x 
     * @param y 
     */
    public mousePressed(x: number, y: number) {}
}