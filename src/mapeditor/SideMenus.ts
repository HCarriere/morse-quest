import { EngineGraphics } from "@game/core/EngineGraphics";
import { EngineObject } from "@game/core/EngineObject";
import { SideMenu } from "./SideMenu";
import { SelectMapMenu } from "./SelectMapMenu";
import { TileEditionMenu } from "./TileEditionMenu";

export class SideMenus extends EngineObject {
    private menus: SideMenu[] = [];
    constructor(private startX: number) {
        super();
        this.menus.push(new SelectMapMenu(this.startX));
        this.menus.push(new TileEditionMenu(this.startX));
    }
    public display() {
        EngineGraphics.ctx.fillStyle = 'green';
        EngineGraphics.ctx.fillRect(this.startX, 0, EngineGraphics.canvas.width - this.startX, EngineGraphics.canvas.height);
        let startY = 0;
        this.menus.forEach(menu => {
            startY = menu.displayMenu(startY);
        });
    }
    public updateStartX(newValue: number): void {
        this.startX = newValue;
        this.menus.forEach(menu => menu.updateStartX(newValue));
    }
}