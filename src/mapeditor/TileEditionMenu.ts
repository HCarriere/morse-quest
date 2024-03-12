import { EngineGraphics } from "@game/core/EngineGraphics";
import { SideMenu } from "./SideMenu";
import { Input } from "./components/Input";

export class TileEditionMenu extends SideMenu {
    private tileValueInput: Input;
    protected initMenu(): void {
        this.tileValueInput = new Input();
        this.menuElements.push(this.tileValueInput);
    }
    public displayMenu(startY: number): number {
        let height = EngineGraphics.canvas.height / 5;
        EngineGraphics.ctx.fillStyle = 'blue';
        EngineGraphics.ctx.fillRect(this.startX, startY, EngineGraphics.canvas.width - this.startX, height);
        return height;
    }
}