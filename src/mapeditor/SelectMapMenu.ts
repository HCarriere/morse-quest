import { EngineGraphics } from "@game/core/EngineGraphics";
import { SideMenu } from "./SideMenu";
import { Button } from "@game/interface/components/Button";

export class SelectMapMenu extends SideMenu {
    private static padding = 10;
    private static dropdownHeight = 20;
    private mapSelectButton: Button;
    public initMenu(): void {
        this.mapSelectButton = new Button(
            this.startX + SelectMapMenu.padding,
            SelectMapMenu.padding,
            EngineGraphics.canvas.width - this.startX - 2 * SelectMapMenu.padding,
            SelectMapMenu.dropdownHeight,
            () => {},
            {
                text: 'Sélectionner une map'
            },
            'Sélectionner une map');
        this.menuElements.push(this.mapSelectButton);
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
        this.mapSelectButton.x = this.startX + SelectMapMenu.padding;
        this.mapSelectButton.width = EngineGraphics.canvas.width - this.startX - 2 * SelectMapMenu.padding;
    }
}