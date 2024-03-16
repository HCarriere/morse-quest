import { EngineObject } from "@game/core/EngineObject";
import { GridElement } from "./GridElement";
import { Graphics } from "@game/core/Graphics";

export class GridTile extends EngineObject implements GridElement {
    constructor(public value: string, public x: number, public y: number, public width: number, public height: number) {
        super();
    }

    public updatePosition(newX: number, newY: number, newWidth: number, newHeight: number): void {
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
    }

    updateValue(value: string): void {
        this.value = value;
    }

    hasValue(): boolean {
        return !!this.value;
    }

    getValue(): string {
        return this.value;
    }

    public display() {
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "center";
        Graphics.ctx.font = (this.height - 2) + "px Luminari";
        Graphics.ctx.textBaseline = "middle";
        Graphics.ctx.fillText(this.value, this.x + this.width / 2, this.y + this.height / 2, this.width);
        Graphics.ctx.restore();
    }

    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            //
        }
    }

    /**
     * Returns true if x,y is inside tile
     * @param x 
     * @param y 
     */
    private isInbound(x: number, y: number): boolean {
        return (x > this.x && x < this.x + this.width && 
                y > this.y && y < this.y + this.height);
    }
}