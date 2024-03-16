export class Pen {
    private static _mousePressed: boolean = false;
    private static dragging: boolean = false;
    public static get mousePressed(): boolean { return this._mousePressed; }
    private static dragListeners: ((x: number, y: number) => void)[] = [];
    private static dropListeners: ((x: number, y: number) => void)[] = [];
    private static clickListeners: ((x: number, y: number) => void)[] = [];
    private static _dragStartX: number;
    public static get dragStartX(): number { return this._dragStartX; }
    private static _dragStartY: number;
    public static get dragStartY(): number { return this._dragStartY; }
    public static onMouseMove(x: number, y: number): void {
        if (!this.mousePressed) return; // Not dragging
        this.dragging = true;
        this.dragListeners.forEach(listener => listener(x, y));
    }
    public static onMousePressed(x: number, y: number): void {
        if (this.mousePressed) return; // dragging
        this._mousePressed = true;
        this._dragStartX = x;
        this._dragStartY = y;
    }
    public static onMouseReleased(x: number, y: number): void {
        if (!this.mousePressed) return;
        this._mousePressed = false;
        if (!this.dragging) {
            // Mouse released where pressed => click
            this.clickListeners.forEach(listener => listener(x, y));
            return;
        }
        this.dragging = false;
        this.dropListeners.forEach(listener => listener(x, y));
        delete this._dragStartX;
        delete this._dragStartY;
    }
    public static addDragListener(listener: (x: number, y: number) => void): void {
        this.dragListeners.push(listener);
    }
    public static addDropListener(listener: (x: number, y: number) => void): void {
        this.dropListeners.push(listener);
    }
    public static addClickListener(listener: (x: number, y: number) => void): void {
        this.clickListeners.push(listener);
    }
}