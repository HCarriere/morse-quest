import { EngineGraphics } from "@game/core/EngineGraphics";
import { SideMenu } from "./SideMenu";

export class TileEditionMenu extends SideMenu {
    public display(startY: number): number {
        let height = EngineGraphics.canvas.height / 5;
        EngineGraphics.ctx.fillStyle = 'blue';
        EngineGraphics.ctx.fillRect(this.startX, startY, EngineGraphics.canvas.width - this.startX, height);
        return height;
    }
}