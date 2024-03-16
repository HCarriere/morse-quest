import { ButtonStyle } from "@game/interface/components/Button";
import { GridElement } from "./GridElement";
import { GridButton } from "./GridButton";
import { EngineObject } from "@game/core/EngineObject";
import { Graphics } from "@game/core/Graphics";
import { EngineController } from "@game/core/EngineController";
import { GridTile } from "./GridTile";

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
    private gridColToElementPositionX(i: number): number { return this.x + i * this.cellWidth + this.elementPaddingX; }
    private gritRowToElementPositionY(j: number): number { return this.y + j * this.cellHeight + this.elementPaddingY; }
    public addButton(i: number, j: number, onClick: () => void, style: ButtonStyle = {}): void {
        if (i < 0 || i > this.nbCols - 1 || j < 0 || j > this.nbRows - 1) return;
        let btn = new GridButton(
            this.gridColToElementPositionX(i),
            this.gritRowToElementPositionY(j),
            this.elementWidth,
            this.elementHeight,
            onClick,
            style
        );
        this.cells.push(new GridCell(i, j, btn, btn));
    }
    public addTile(i: number, j: number, value: string): void {
        if (i < 0 || i > this.nbCols - 1 || j < 0 || j > this.nbRows - 1) return;
        let tile = new GridTile(
            value,
            this.gridColToElementPositionX(i),
            this.gritRowToElementPositionY(j),
            this.elementWidth,
            this.elementHeight
        );
        this.cells.push(new GridCell(i, j, tile, tile));
    }
    public recalculatePosition(newX: number, newY: number, newWidth: number, newHeight: number): void {
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
        this.cells.forEach(cell => cell.gridElement.updatePosition(this.gridColToElementPositionX(cell.i), this.gritRowToElementPositionY(cell.j), this.elementWidth, this.elementHeight));
    }
    public getEngineObjects(): EngineObject[] {
        return this.cells.map(cell => cell.engineObject);
    }
    public getNbNonEmptyCellsInRange(startI: number, startJ: number, endI: number, endJ: number): number {
        return this.cells.filter(cell => cell.i >= startI && cell.i < endI && cell.j >= startJ && cell.j < endJ && cell.gridElement.hasValue()).length;
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
        return this.getCellI(EngineController.mouseX);
    }
    public getHoveredCellJ(): number {
        return this.getCellJ(EngineController.mouseY);
    }
    public getCellI(positionX: number): number {
        if (positionX < this.x || positionX > this.x + this.width) return NaN;
        return Math.floor((positionX - this.x) / this.cellWidth);
    }
    public getCellJ(positionY: number): number {
        if (positionY < this.y || positionY > this.y + this.height) return NaN;
        return Math.floor((positionY - this.y) / this.cellHeight);
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
    public clear(): void {
        this.cells = [];
    }
    public updateTile(i: number, j: number, value: string): void {
        let cell: GridCell = this.cells.find(cell => cell.i == i && cell.j == j );
        if (!!cell) {
            cell.gridElement.updateValue(value);
        } else {
            this.addTile(i, j, value);
        }
    }
    public getFirstNonEmptyCol(): number {
        let nonEmptyCells = this.cells.filter(cell => cell.gridElement.hasValue());
        return !!nonEmptyCells ? nonEmptyCells.map(cell => cell.i).sort((a, b) => a - b)[0] : -1;
    }
    public getFirstNonEmptyRow(): number {
        let nonEmptyCells = this.cells.filter(cell => cell.gridElement.hasValue());
        return !!nonEmptyCells ? nonEmptyCells.map(cell => cell.j).sort((a, b) => a - b)[0] : -1;
    }
    public getLastNonEmptyCol(): number {
        let nonEmptyCells = this.cells.filter(cell => cell.gridElement.hasValue());
        return !!nonEmptyCells ? nonEmptyCells.map(cell => cell.i).sort((a, b) => b - a)[0] : -1;
    }
    public getLastNonEmptyRow(): number {
        let nonEmptyCells = this.cells.filter(cell => cell.gridElement.hasValue());
        return !!nonEmptyCells ? nonEmptyCells.map(cell => cell.j).sort((a, b) => b - a)[0] : -1;
    }
    public getNonEmptyCells(): {i: number, j: number, value: string}[] {
        let nonEmptyCells = this.cells.filter(cell => cell.gridElement.hasValue());
        return nonEmptyCells.map(cell => ({i: cell.i, j: cell.j, value: cell.gridElement.getValue()}));
    }
    public isInbound(x: number, y: number): boolean {
        return (x > this.x && x < this.x + this.width && 
                y > this.y && y < this.y + this.height);
    }
}