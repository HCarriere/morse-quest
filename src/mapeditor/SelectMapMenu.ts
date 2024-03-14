import { Graphics } from "@game/core/Graphics";
import { SideMenu } from "./SideMenu";
import { Button, ButtonStyle } from "@game/interface/components/Button";
import { Modale } from "@game/core/Modale";
import { MapSelectionModale } from "./modales/MapSelectionModale";

export class SelectMapMenu extends SideMenu {
    private static padding = 10;
    private static btnHeight = 50;
    private mapSelectButton: Button;
    private btnStyle: ButtonStyle;
    public initMenu(): void {
        this.btnStyle = {
            strokeColor: 'white',
            textSize: 20,
            color: 'white',
            colorHover: 'grey',
            textColor: 'black'
        };
        this.mapSelectButton = new Button(
            this.startX + SelectMapMenu.padding,
            SelectMapMenu.padding,
            Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding,
            SelectMapMenu.btnHeight,
            () => {Modale.openModale(new MapSelectionModale());},
            {
                ...this.btnStyle,
                text: 'Sélectionner une map'
            });
        this.menuElements.push(this.mapSelectButton);
    }
    public displayMenu(startY: number): number {
        let height = SelectMapMenu.btnHeight + 2 * SelectMapMenu.padding;
        Graphics.ctx.fillStyle = 'orange';
        Graphics.ctx.fillRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        this.menuElements.forEach(elem => {
            elem.display();
        });
        return height;
    }
    public updateStartX(newValue: number): void {
        super.updateStartX(newValue);
        this.mapSelectButton.x = this.startX + SelectMapMenu.padding;
        this.mapSelectButton.width = Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding;
    }
}