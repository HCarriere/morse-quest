import { EngineObject } from "@game/core/EngineObject";

export abstract class SideMenu extends EngineObject {
    protected menuElements: EngineObject[] = [];
    constructor(protected startX: number) {
        super();
        this.initMenu();
    }
    protected initMenu(): void {}
    /** Display the menu and return its height */
    public abstract displayMenu(startY: number): number;
    public updateStartX(newValue: number): void {
        this.startX = newValue;
    }
    public display() {
        throw new Error("You should use displayMenu(startY: number)");
    }
    public resize(): void {
        super.resize();
        this.menuElements.forEach(elem => elem.resize());
    }
    public keyPressed(key: number): void {
        super.keyPressed(key);
        this.menuElements.forEach(elem => elem.keyPressed(key));
    }
    public mousePressed(x: number, y: number): void {
        super.mousePressed(x, y);
        this.menuElements.forEach(elem => elem.mousePressed(x, y));
    }
}