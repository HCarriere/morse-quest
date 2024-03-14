import { EngineObject } from "@game/core/EngineObject";
import { Graphics } from "@game/core/Graphics";

export class Input extends EngineObject {
    public value: string = '';
    private focused = false;
    constructor(public x: number, public y: number, public width: number, public height: number) {
        super();
    }
    public display() {
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'purple';
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        if (this.focused) {
            Graphics.ctx.strokeStyle = 'white';
            Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "left";
        Graphics.ctx.font = this.height - 10 + "px Luminari";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(this.value, this.x + 5, this.y + 5, this.width - 10);
        Graphics.ctx.restore();
    }

    public mousePressed(x: number, y: number): void {
        this.focused = this.isInbound(x, y);
    }

    public originalKeyPressed(key: string): void {
        if (!this.focused) return;
        if (key.length == 1) {
            this.value += key;
            return;
        }
        switch (key) {
            case 'Backspace':
                this.value = this.value.slice(0, -1);
                break;
            default:
                break;
        }
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