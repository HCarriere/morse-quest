import { Graphics } from "@game/core/Graphics";
import { SideMenu } from "./SideMenu";
import { Input } from "./components/Input";

export class TileEditionMenu extends SideMenu {
    private static padding = 10;
    private tileValueInput: Input;
    protected initMenu(): void {
        this.tileValueInput = new Input(
            this.startX + TileEditionMenu.padding,
            TileEditionMenu.padding,
            Graphics.canvas.width - (this.startX + 2 * TileEditionMenu.padding),
            50,
            (char: string) => !Number.isNaN(parseInt(char)),
            (value: string) => {
                // TODO update tile value
            }
        );
        this.menuElements.push(this.tileValueInput);
    }
    public displayMenu(startY: number): number {
        let height = this.tileValueInput.height + 2 * TileEditionMenu.padding;
        Graphics.ctx.fillStyle = 'blue';
        Graphics.ctx.fillRect(this.startX, startY, Graphics.canvas.width - this.startX, height);
        this.tileValueInput.y = startY + TileEditionMenu.padding;
        this.tileValueInput.display();
        return height;
    }
    public updateStartX(newValue: number): void {
        super.updateStartX(newValue);
        this.tileValueInput.x = this.startX + TileEditionMenu.padding;
        this.tileValueInput.width = Graphics.canvas.width - this.startX - 2 * TileEditionMenu.padding;
    }
}