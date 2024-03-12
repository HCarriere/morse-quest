import { Graphics } from "@game/core/Graphics";
import { SideMenu } from "./SideMenu";
import { Input } from "./components/Input";

export class TileEditionMenu extends SideMenu {
    private tileValueInput: Input;
    protected initMenu(): void {
        this.tileValueInput = new Input();
        this.menuElements.push(this.tileValueInput);
    }
    public displayMenu(startY: number): number {
        let height = Graphics.canvas.height / 5;
        Graphics.ctx.fillStyle = 'blue';
        Graphics.ctx.fillRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        return height;
    }
}