export abstract class GameObject {
    
    protected ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.init();
    }

    public abstract init();

    public abstract display();

    public abstract resize();
}