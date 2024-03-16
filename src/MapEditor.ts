import { Engine } from "./core/Engine";
import { EngineController } from "./core/EngineController";
import { Graphics } from "./core/Graphics";
import { EditionSpace } from "./mapeditor/EditionSpace";
import { Pen } from "./mapeditor/Pen";
import { SideMenus } from "./mapeditor/menus/SideMenus";

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
        Graphics.canvas.addEventListener('mouseup', (e) => {this.mouseReleased(e); });
        return true;
    }
    protected onLoop(): void {}
    protected override resize(): void {
        this.updateFrontier();
        super.resize();
    }
    private updateFrontier(): void {
        let frontierX = Graphics.canvas.width * 4/5;
        if (this.sideMenus) this.sideMenus.updateStartX(frontierX);
        if (this.editionSpace) this.editionSpace.endX = frontierX;
    }
    protected mousePressed(e: MouseEvent): void {
        super.mousePressed(e);
        if (e.button == 0) Pen.onMousePressed(EngineController.mouseX, EngineController.mouseY);
    }
    protected override mouseMove(e: MouseEvent): void {
        super.mouseMove(e);
        if (e.button == 0) Pen.onMouseMove(EngineController.mouseX, EngineController.mouseY);
    }
    private mouseReleased(e: MouseEvent): void {
        if (e.button == 0) Pen.onMouseReleased(EngineController.mouseX, EngineController.mouseY);
    }
}