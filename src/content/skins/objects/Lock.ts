import { GameGraphics } from "@game/system/GameGraphics";
import { Skin } from "../Skin"

export class SkinLock extends Skin {
    constructor(
        public primaryColor: string = 'grey'
    ) {
        super();
    }

    public display(x: number, y: number, size: number): void {
        GameGraphics.ctx.fillStyle = this.primaryColor;
        GameGraphics.ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
    }
}