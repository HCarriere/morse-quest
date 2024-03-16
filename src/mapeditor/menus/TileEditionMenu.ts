import { Graphics } from "@game/core/Graphics";
import { SideMenu } from "./SideMenu";
import { Input } from "../components/Input";
import { TileManager } from "../TileManager";

export class TileEditionMenu extends SideMenu {
    private static padding = 10;
    private static elementHeight = 50;
    private tileValueInput: Input;
    protected initMenu(): void {
        this.tileValueInput = new Input(
            this.startX + TileEditionMenu.padding,
            TileEditionMenu.padding,
            Graphics.canvas.width - (this.startX + 2 * TileEditionMenu.padding),
            TileEditionMenu.elementHeight,
            (char: string) => !Number.isNaN(parseInt(char)),
            (value: string) => {
                TileManager.editionTileValue = value;
            }
        );
        this.menuElements.push(this.tileValueInput);
    }
    public displayMenu(startY: number): number {
        let height = 2 * TileEditionMenu.elementHeight + 4 * TileEditionMenu.padding;
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'black';
        Graphics.ctx.fillRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        Graphics.ctx.strokeStyle = 'white';
        Graphics.ctx.strokeRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "left";
        Graphics.ctx.font = TileEditionMenu.elementHeight + "px Luminari";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText('Valeur de tuile', this.startX + TileEditionMenu.padding, startY + TileEditionMenu.padding, Graphics.canvas.width - (this.startX + 2 * TileEditionMenu.padding));
        Graphics.ctx.restore();
        this.tileValueInput.y = startY + TileEditionMenu.elementHeight + 3 * TileEditionMenu.padding;
        this.tileValueInput.display();
        return height;
    }
    public updateStartX(newValue: number): void {
        super.updateStartX(newValue);
        this.tileValueInput.x = this.startX + TileEditionMenu.padding;
        this.tileValueInput.width = Graphics.canvas.width - this.startX - 2 * TileEditionMenu.padding;
    }
}