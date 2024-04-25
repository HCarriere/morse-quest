import { Graphics } from "@game/core/Graphics";
import { Button, ButtonStyle } from "./Button";

export class Text {
    constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public text: string,
        public color: string,
        public textAlign: CanvasTextAlign = 'center',
        public textBaseline: CanvasTextBaseline = 'middle'
    ) {}

    public display() {
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = this.color;
        Graphics.ctx.textAlign = this.textAlign;
        Graphics.ctx.font = this.height + "px "+Graphics.FONT;
        Graphics.ctx.textBaseline = this.textBaseline;
        Graphics.ctx.fillText(this.text, this.textX, this.textY, this.width - 2);
        Graphics.ctx.restore();
    }

    private get textX(): number {
        switch (this.textAlign) {
            case 'left':
            case 'start':
                return this.x;
            case 'center':
                return this.x + this.width/2;
            case 'right':
            case 'end':
                return this.x + this.width;
        }
    }

    private get textY(): number {
        switch (this.textBaseline) {
            case 'alphabetic':
            case 'ideographic':
            case 'bottom':
                return this.y + this.height;
            case 'middle':
                return this.y + this.height/2
            case 'top':
            case 'hanging':
                return this.y;
        }
    }
}