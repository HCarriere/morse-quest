import { ButtonStyle } from "@game/interface/components/Button";
import { GridElement } from "./GridElement";
import { GridButton } from "./GridButton";
import { EngineObject } from "@game/core/EngineObject";

class GridCell {
    constructor(public i:number, public j: number, public gridElement: GridElement, public engineObject: EngineObject) {}
}

export class Grid {
    private cells: GridCell[] = [];
    constructor(public x: number, public y: number, public width: number, public height: number, private elementWidth: number, private elementHeight: number, private elementPaddingX: number, private elementPAddingY: number) {
        //
    }
    private get cellWidth(): number {
        return this.elementWidth + 2 * this.elementPaddingX;
    }
    private get cellHeight(): number {
        return this.elementHeight + 2 * this.elementPAddingY;
    }
    private get nbCols(): number {
        return Math.floor(this.width / this.cellWidth);
    }
    private get nbRows(): number {
        return Math.floor(this.height / this.cellHeight);
    }
    public addButton(i: number, j: number, onClick: () => void, style: ButtonStyle = {}): void {
        if (i < 0 || i > this.nbCols - 1 || j < 0 || j > this.nbRows - 1) return;
        let btn = new GridButton(
            i,
            j,
            this.cellWidth,
            this.cellHeight,
            this.elementPaddingX,
            this.elementPAddingY,
            this.x + i * this.cellWidth + this.elementPaddingX,
            this.y + j * this.cellHeight + this.elementPAddingY,
            this.elementWidth,
            this.elementHeight,
            onClick,
            style
        );
        this.cells.push(new GridCell(i, j, btn, btn));
    }
    public recalculatePosition(newX: number, newY: number, newWidth: number, newHeight: number): void {
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
        this.cells.forEach(cell => cell.gridElement.recalculatePosition(newX, newY));
    }
    public getEngineObjects(): EngineObject[] {
        return this.cells.map(cell => cell.engineObject);
    }
    public getNbNonEmptyCellsInRange(startI: number, startJ: number, endI: number, endJ: number): number {
        return this.cells.filter(cell => cell.i >= startI && cell.i < endI && cell.j >= startJ && cell.j < endJ).length;
    }
}