import { GameGraphics } from "@game/system/GameGraphics";
import { GameInterface } from "@game/interface/GameInterface";
import { Skin } from "../Skin"

export class IronGolem extends Skin {
    constructor(public primaryColor: string = 'grey') {
        super();
    }
    public display(x: number, y: number, size: number): void {
        size = size/2; // drones are small
        GameGraphics.ctx.fillStyle = this.primaryColor;
        GameGraphics.ctx.save();
        GameGraphics.ctx.translate(x + size , y + size);
        GameGraphics.ctx.rotate(GameInterface.frame * 0.02);
        GameGraphics.ctx.fillRect( - size/2 , -size/2, size, size);
        GameGraphics.ctx.rotate(-GameInterface.frame*2 * 0.015);
        GameGraphics.ctx.fillRect( - size/2 , -size/2, size, size);
        GameGraphics.ctx.restore();
    }
}