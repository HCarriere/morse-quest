import { ButtonStyle } from "@game/interface/components/Button";
import { GridElement } from "./GridElement";
import { GridButton } from "./GridButton";
import { EngineObject } from "@game/core/EngineObject";
import { Graphics } from "@game/core/Graphics";
import { EngineController } from "@game/core/EngineController";

class GridCell {
    constructor(public i:number, public j: number, public gridElement: GridElement, public engineObject: EngineObject) {}
}

export class Grid {
    private cells: GridCell[] = [];
    constructor(public x: number, public y: number, public width: number, public height: number, private elementWidth: number, private elementHeight: number, private elementPaddingX: number, private elementPaddingY: number) {
        //
    }
    private get cellWidth(): number {
        return this.elementWidth + 2 * this.elementPaddingX;
    }
    private get cellHeight(): number {
        return this.elementHeight + 2 * this.elementPaddingY;
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
            this.elementPaddingY,
            this.x + i * this.cellWidth + this.elementPaddingX,
            this.y + j * this.cellHeight + this.elementPaddingY,
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
    public drawGrid(): void {
        Graphics.ctx.save();
        Graphics.ctx.translate(this.x, this.y);
        Graphics.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        Graphics.ctx.setLineDash([1, 2]);
        for (let i = 0; i < this.nbCols; i++) {
            for (let j = 0; j < this.nbRows; j++) {
                Graphics.ctx.strokeRect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);
            }
        }
        Graphics.ctx.restore();
    }
    public updateCellSize(newElementWidth: number, newElementHeight: number, newElementPaddingX: number, newElementPaddingY: number): void {
        this.elementWidth = newElementWidth;
        this.elementHeight = newElementHeight;
        this.elementPaddingX = newElementPaddingX;
        this.elementPaddingY = newElementPaddingY;
    }
    public getHoveredCellI(): number {
        if (EngineController.mouseX < this.x || EngineController.mouseX > this.x + this.width) return NaN;
        return Math.floor((EngineController.mouseX - this.x) / this.cellWidth);
    }
    public getHoveredCellJ(): number {
        if (EngineController.mouseY < this.y || EngineController.mouseY > this.y + this.height) return NaN;
        return Math.floor((EngineController.mouseY - this.y) / this.cellHeight);
    }
    public drawHoveredCell(): void {
        let hoveredCellI = this.getHoveredCellI();
        let hoveredCellJ = this.getHoveredCellJ();
        if (isNaN(hoveredCellI) || isNaN(hoveredCellJ)) return;
        Graphics.ctx.save();
        Graphics.ctx.translate(this.x, this.y);
        Graphics.ctx.fillStyle = 'rgba(255, 255, 255, 0.1';
        Graphics.ctx.fillRect(hoveredCellI * this.cellWidth, hoveredCellJ * this.cellHeight, this.cellWidth, this.cellHeight);
        Graphics.ctx.restore();
    }
}