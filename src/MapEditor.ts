import { Engine } from "./core/Engine";
import { Graphics } from "./core/Graphics";
import { EditionSpace } from "./mapeditor/EditionSpace";
import { SideMenus } from "./mapeditor/SideMenus";

export class MapEditor extends Engine {
    private sideMenus: SideMenus;
    private editionSpace: EditionSpace;
    constructor(canvasid = 'mapeditor') {
        super(canvasid);
    }
    protected override initCanvas(canvasid: string): boolean {
        if (!super.initCanvas(canvasid)) return false;
        let frontierX = Graphics.canvas.width * 4/5;
        this.sideMenus = new SideMenus(frontierX);
        this.editionSpace = new EditionSpace(frontierX);
        this.engineObjects.push(this.sideMenus);
        this.engineObjects.push(this.editionSpace);
        return true;
    }
    protected onLoop(): void {
        // TODO
    }
    protected override resize(): void {
        this.updateFrontier();
        super.resize();
    }
    private updateFrontier(): void {
        let frontierX = Graphics.canvas.width * 4/5;
        if (this.sideMenus) this.sideMenus.updateStartX(frontierX);
        if (this.editionSpace) this.editionSpace.endX = frontierX;
    }
}