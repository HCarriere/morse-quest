import { EngineGraphics } from "@game/core/EngineGraphics";
import { SideMenu } from "./SideMenu";
import { Dropdown } from "./components/Dropdown";

export class SelectMapMenu extends SideMenu {
    private mapDropdown: Dropdown;
    public initMenu(): void {
        this.mapDropdown = new Dropdown();
        this.menuElements.push(this.mapDropdown);
    }
    public displayMenu(startY: number): number {
        let height = EngineGraphics.canvas.height / 5;
        EngineGraphics.ctx.fillStyle = 'orange';
        EngineGraphics.ctx.fillRect(this.startX, startY, EngineGraphics.canvas.width - this.startX, height);
        return height;
    }
}