export abstract class GameObject {
    
    protected ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
    }

    public abstract display();
}