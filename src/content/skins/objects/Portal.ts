import { GameGraphics } from "@game/system/GameGraphics";
import { GameInterface } from "@game/interface/GameInterface";
import { Skin } from "../Skin"

export class SkinPortal extends Skin {
    constructor(
        public primaryColor: string = 'white', 
        public secondaryColor: string = 'blue'
    ) {
        super();
    }

    public display(x: number, y: number, size: number): void {
        GameGraphics.ctx.fillStyle = this.primaryColor;
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.arc(
            x + size / 2,
            y + size / 2,
            size / 2, 0, 2 * Math.PI, false);
        GameGraphics.ctx.fill();
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.strokeStyle = this.secondaryColor;
        GameGraphics.ctx.lineWidth = size / 10;
        GameGraphics.ctx.arc(
            x + size / 2,
            y + size / 2,
            size/2, 
            GameInterface.frame / 10, GameInterface.frame / 10 + Math.PI, false);
        GameGraphics.ctx.stroke();
    }
}