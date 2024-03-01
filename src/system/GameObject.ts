
export abstract class GameObject {

    protected ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;

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

}