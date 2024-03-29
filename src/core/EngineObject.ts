
export abstract class EngineObject {
    
    constructor() {
        this.init();
    }

    /**
     * At end of EngineObject constructor
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
     * @param key 
     */
    public keyPressed(key: number) {}

    /**
     * Each keypress event
     * @param key 
     */
    public originalKeyPressed(key: string) {}

    /**
     * Each mouse pressed event
     * @param x 
     * @param y 
     */
    public mousePressed(x: number, y: number) {}
}