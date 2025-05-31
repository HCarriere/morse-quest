import { GameGraphics } from "@game/system/GameGraphics";
import { Skin } from "../Skin"

export class IronGolem extends Skin {
    constructor(public primaryColor: string = 'grey') {
        super();
    }
    public display(x: number, y: number, size: number): void {
        GameGraphics.ctx.fillStyle = this.primaryColor;
        // Corps
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
        GameGraphics.ctx.closePath();
        GameGraphics.ctx.fill();
        // Tête
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.arc(x + size / 2, y + size / 4, size / 8, 0, Math.PI * 2);
        GameGraphics.ctx.closePath();
        GameGraphics.ctx.fill();
        // Epaule gauche et droite
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.arc(x + size / 4, y + 5 * size / 12, size / 6, 0, Math.PI * 2);
        GameGraphics.ctx.closePath();
        GameGraphics.ctx.fill();
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.arc(x + 3 * size / 4, y + 5 * size / 12, size / 6, 0, Math.PI * 2);
        GameGraphics.ctx.closePath();
        GameGraphics.ctx.fill();
        // Bassin
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.arc(x + size / 2, y + 3 * size / 4, size / 7, 0, Math.PI * 2);
        GameGraphics.ctx.closePath();
        GameGraphics.ctx.fill();
        // Bras gauche et droit
        GameGraphics.ctx.fillRect(x + size / 12, y + 5 * size / 12, 3 * size / 24, size / 2);
        GameGraphics.ctx.fillRect(x + 19 * size / 24, y + 5 * size / 12, 3 * size / 24, size / 2);
        // Jambes gauche et droite
        GameGraphics.ctx.fillRect(x + size / 3, y + 3 * size / 4, size / 8, size / 4);
        GameGraphics.ctx.fillRect(x + 2 * size / 3 - size / 8, y + 3 * size / 4, size / 8, size / 4);
    }
}