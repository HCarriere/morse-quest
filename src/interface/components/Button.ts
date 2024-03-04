import { Coordinates } from "@game/system/GameMap";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";


export interface ButtonStyle {
    text?: string;
    color?: string;
    textColor?: string;
}

export class Button extends GameObject {

    private location: Coordinates;
    private width: number;
    private height: number;
    private onClick: () => void;

    private style: ButtonStyle;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, 
        x: number, y: number, width: number, height: number, onClick: () => void, style: ButtonStyle = {}) {
        super();
        this.location = {x, y};
        this.width = width;
        this.height = height;
        this.onClick = onClick;
        this.style = style;
    }

    public display() {
        Graphics.ctx.fillStyle = this.style.color || 'black';
        Graphics.ctx.fillRect(this.location.x, this.location.y, this.width, this.height);
        if (this.style.text) {
            Graphics.ctx.fillStyle = this.style.textColor || 'grey';
            Graphics.ctx.textAlign = "center";
            Graphics.ctx.font = "30px monospace";
            Graphics.ctx.textBaseline = "middle";
            Graphics.ctx.fillText(this.style.text, this.location.x + this.width/2, this.location.y + this.height/2);
        }
    }

    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.onClick();
        }
    }

    /**
     * Returns true if x,y is inside button
     * @param x 
     * @param y 
     */
    private isInbound(x: number, y: number): boolean {
        return (x > this.location.x && x < this.location.x + this.width && 
                y > this.location.y && y < this.location.y + this.height);
    }

}