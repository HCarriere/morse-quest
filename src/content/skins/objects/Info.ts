import { GameGraphics } from "@game/system/GameGraphics";
import { Skin } from "../Skin"

export class SkinInfo extends Skin {
    constructor(
        public primaryColor: string = 'white', 
        public secondaryColor: string = 'blue'
    ) {
        super();
    }

    public display(x: number, y: number, size: number): void {
        GameGraphics.ctx.fillStyle = this.secondaryColor;
        GameGraphics.ctx.save();
        GameGraphics.ctx.translate(
            x + size / 2, 
            y + size / 2);
        GameGraphics.ctx.rotate(45 * Math.PI/180);
        GameGraphics.ctx.fillRect(-size / 2, -size / 2, size, size);
        GameGraphics.ctx.restore();
        GameGraphics.ctx.fillStyle = this.primaryColor;
        GameGraphics.ctx.textAlign = "center";
        GameGraphics.ctx.font = "30px "+GameGraphics.FONT;
        GameGraphics.ctx.textBaseline = "middle";
        GameGraphics.ctx.fillText('!', 
            x + size / 2, 
            y + size / 2);
    }
}