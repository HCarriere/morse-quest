import { EngineGraphics } from "./EngineGraphics";
import { EngineObject } from "./EngineObject"

export abstract class ModaleContent extends EngineObject {
    public height: number = 500;
    public width: number = 1000;
    protected modaleElements: EngineObject[] = [];

    constructor() {
        super();
        this.initContent();
    }

    protected abstract initContent(): void;

    public display() {
        EngineGraphics.ctx.fillStyle = 'black';
        EngineGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.displayContent();
    }

    protected abstract displayContent(): void;

    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.modaleElements.forEach(elem => elem.mousePressed(x, y));
        } else {
            Modale.exitModale();
        }
    }

    public get x() : number {
        return EngineGraphics.canvas.width / 2 - this.width / 2;
    }
    
    public get y() : number {
        return EngineGraphics.canvas.height / 2 - this.height / 2
    }

    /**
     * Returns true if x,y is inside button
     * @param x 
     * @param y 
     */
    private isInbound(x: number, y: number): boolean {
        return (x > this.x && x < this.x + this.width && 
                y > this.y && y < this.y + this.height);
    }
}

export class Modale {
    public static content: ModaleContent;
    public static get showModale(): boolean { return !!Modale.content; }
    public static openModale(content: ModaleContent): void { if (!Modale.content) Modale.content = content; }
    public static exitModale(): void { delete Modale.content; }
}