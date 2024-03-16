import { Graphics } from "@game/core/Graphics";
import { SideMenu } from "./SideMenu";
import { Button, ButtonStyle } from "@game/interface/components/Button";
import { Modale } from "@game/core/Modale";
import { MapSelectionModale } from "../modales/MapSelectionModale";
import { MapCreationModale } from "../modales/MapCreationModale";

export class SelectMapMenu extends SideMenu {
    private static padding = 10;
    private static btnHeight = 50;
    private mapSelectButton: Button;
    private mapCreateButton: Button;
    private saveButton: Button;
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
            }
        );
        this.menuElements.push(this.mapSelectButton);
        this.mapCreateButton = new Button(
            this.startX + SelectMapMenu.padding,
            SelectMapMenu.btnHeight + 3 * SelectMapMenu.padding,
            Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding,
            SelectMapMenu.btnHeight,
            () => {Modale.openModale(new MapCreationModale());},
            {
                ...this.btnStyle,
                text: 'Créer une map'
            }
        );
        this.menuElements.push(this.mapCreateButton);
        this.saveButton = new Button(
            this.startX + SelectMapMenu.padding,
            2 * SelectMapMenu.btnHeight + 5 * SelectMapMenu.padding,
            Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding,
            SelectMapMenu.btnHeight,
            () => {},
            {
                ...this.btnStyle,
                text: 'Sauvegarder la map'
            }
        );
        this.menuElements.push(this.saveButton);
    }
    public displayMenu(startY: number): number {
        let height = 3 * SelectMapMenu.btnHeight + 6 * SelectMapMenu.padding;
        Graphics.ctx.fillStyle = 'black';
        Graphics.ctx.fillRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        Graphics.ctx.strokeStyle = 'white';
        Graphics.ctx.strokeRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        this.menuElements.forEach(elem => {
            elem.display();
        });
        return height;
    }
    public updateStartX(newValue: number): void {
        super.updateStartX(newValue);
        this.mapSelectButton.x = this.startX + SelectMapMenu.padding;
        this.mapSelectButton.width = Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding;
        this.mapCreateButton.x = this.startX + SelectMapMenu.padding;
        this.mapCreateButton.width = Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding;
        this.saveButton.x = this.startX + SelectMapMenu.padding;
        this.saveButton.width = Graphics.canvas.width - this.startX - 2 * SelectMapMenu.padding;
    }
}