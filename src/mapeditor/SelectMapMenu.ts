import { EngineGraphics } from "@game/core/EngineGraphics";
import { SideMenu } from "./SideMenu";
import { Dropdown } from "./components/Dropdown";

export class SelectMapMenu extends SideMenu {
    private static padding = 10;
    private static dropdownHeight = 20;
    private mapDropdown: Dropdown;
    public initMenu(): void {
        this.mapDropdown = new Dropdown(this.startX + SelectMapMenu.padding, SelectMapMenu.padding, EngineGraphics.canvas.width - this.startX - 2 * SelectMapMenu.padding, SelectMapMenu.dropdownHeight, [], () => {});
        this.menuElements.push(this.mapDropdown);
    }
    public displayMenu(startY: number): number {
        let height = SelectMapMenu.dropdownHeight + 2 * SelectMapMenu.padding;
        EngineGraphics.ctx.fillStyle = 'orange';
        EngineGraphics.ctx.fillRect(this.startX, startY, EngineGraphics.canvas.width - this.startX, height);
        this.menuElements.forEach(elem => {
            elem.display();
        });
        return height;
    }
    public updateStartX(newValue: number): void {
        super.updateStartX(newValue);
        this.mapDropdown.x = this.startX + SelectMapMenu.padding;
        this.mapDropdown.width = EngineGraphics.canvas.width - this.startX - 2 * SelectMapMenu.padding;
    }
}