import { Graphics } from "@game/system/Graphics";
import { GameInterface } from "@game/interface/GameInterface";
import { Skin } from "../Skin"

export class SkinDrone extends Skin {
    constructor(public primaryColor: string = 'red') {
        super();
    }
    public display(x: number, y: number, size: number): void {
        size = size/2; // drones are small
        Graphics.ctx.fillStyle = this.primaryColor;
        Graphics.ctx.save();
        Graphics.ctx.translate(x + size , y + size);
        Graphics.ctx.rotate(GameInterface.frame * 0.02);
        Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
        Graphics.ctx.rotate(-GameInterface.frame*2 * 0.015);
        Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
        Graphics.ctx.restore();
    }
}