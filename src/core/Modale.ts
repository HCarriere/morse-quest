import { Graphics } from "./Graphics";
import { EngineObject } from "./EngineObject"

export abstract class ModaleContent extends EngineObject {
    protected height: number;
    protected width: number;
    protected x: number;
    protected y: number;
    protected modaleElements: EngineObject[] = [];

    constructor() {
        super();
        this.updateSizeAndPosition();
        this.initContent();
    }

    protected abstract initContent(): void;

    public display() {
        Graphics.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        Graphics.ctx.fillRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
        Graphics.ctx.fillStyle = 'black';
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.modaleElements.forEach(elem => elem.display());
        this.displayCustomContent();
    }

    protected displayCustomContent(): void {}

    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.modaleElements.forEach(elem => elem.mousePressed(x, y));
        } else {
            Modale.closeModale();
        }
    }

    public resize(): void {
        this.updateSizeAndPosition();
        this.resizeContent();
    }

    protected abstract resizeContent(): void;
    
    protected updateSizeAndPosition(): void {
        this.width = Graphics.canvas.width * 2 / 3;
        this.height = Graphics.canvas.height * 2 / 3;
        this.x = Graphics.canvas.width / 2 - this.width / 2;
        this.y = Graphics.canvas.height / 2 - this.height / 2;
    }

    public keyPressed(key: number): void {
        this.modaleElements.forEach(elem => elem.keyPressed(key));
    }

    public originalKeyPressed(key: string): void {
        this.modaleElements.forEach(elem => elem.originalKeyPressed(key));
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
    public static openModale(content: ModaleContent): void { Modale.content = content; }
    public static closeModale(): void { delete Modale.content; }
}