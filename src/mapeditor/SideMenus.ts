import { Graphics } from "@game/core/Graphics";
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
        Graphics.ctx.fillStyle = 'green';
        Graphics.ctx.fillRect(this.startX, 0, Graphics.canvas.width - this.startX, Graphics.canvas.height);
        let startY = 0;
        this.menus.forEach(menu => {
            startY = menu.displayMenu(startY);
        });
    }
    public resize(): void {
        super.resize();
        this.menus.forEach(menu => menu.resize());
    }
    public keyPressed(key: number): void {
        super.keyPressed(key);
        this.menus.forEach(menu => menu.keyPressed(key));
    }
    public originalKeyPressed(key: string): void {
        super.originalKeyPressed(key);
        this.menus.forEach(menu => menu.originalKeyPressed(key));
    }
    public mousePressed(x: number, y: number): void {
        super.mousePressed(x, y);
        this.menus.forEach(menu => menu.mousePressed(x, y));
    }
    public updateStartX(newValue: number): void {
        this.startX = newValue;
        this.menus.forEach(menu => menu.updateStartX(newValue));
    }
}