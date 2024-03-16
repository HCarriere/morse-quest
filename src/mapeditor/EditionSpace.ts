import { Graphics } from "@game/core/Graphics";
import { EngineObject } from "@game/core/EngineObject";
import { MapManager } from "./MapManager";
import { Grid } from "./components/Grid";
import { Pen } from "./Pen";
import { TileManager } from "./TileManager";

export class EditionSpace extends EngineObject {
    public nbCols: number = 80;
    public nbRows: number = 40;
    private headerHeight: number = 70;
    private get editionGridHeight(): number { return Graphics.canvas.height - this.headerHeight; }
    private get cellWidth(): number { return this.endX / this.nbCols; }
    private get cellHeight(): number { return this.editionGridHeight / this.nbRows;  }
    private editionGrid: Grid;
    private pressedCellI: number;
    private pressedCellJ: number;
    private edited: boolean = false;
    constructor(public endX: number) {
        super();
        this.editionGrid = new Grid(
            0,
            this.headerHeight,
            this.endX,
            this.editionGridHeight,
            this.cellWidth,
            this.cellHeight,
            0,
            0
        );
        MapManager.addLoadListener(() => this.loadMapInGrid());
        MapManager.loadMap(MapManager.getMapList()[0]);
        Pen.addDragListener((x: number, y: number) => this.onDrag(x, y));
        Pen.addDropListener((x: number, y: number) => this.onDrop(x, y));
        Pen.addClickListener((x: number, y: number) => this.onClick(x, y));
    }
    public display() {
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'black';
        Graphics.ctx.fillRect(0, 0, this.endX, Graphics.canvas.height);
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "left";
        Graphics.ctx.font = (this.headerHeight - 20) + "px Luminari";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(MapManager.currentMapId, 10, 10);
        let hoveredCellI = this.editionGrid.getHoveredCellI();
        let hoveredCellJ = this.editionGrid.getHoveredCellJ();
        if (!isNaN(hoveredCellI) && !isNaN(hoveredCellJ)) {
            Graphics.ctx.textAlign = "right";
            Graphics.ctx.fillText(`i : ${hoveredCellI}, j : ${hoveredCellJ}`, this.endX, 10);
        }
        Graphics.ctx.restore();
        this.editionGrid.drawGrid();
        this.editionGrid.getEngineObjects().forEach(elem => elem.display());
        this.editionGrid.drawHoveredCell();
    }
    public resize(): void {
        this.editionGrid.recalculatePosition(0, this.headerHeight, this.endX, this.editionGridHeight);
        this.editionGrid.updateCellSize(this.cellWidth, this.cellHeight, 0, 0);
    }
    private loadMapInGrid(): void {
        this.editionGrid.clear();
        let nbEmptyCols = Math.floor((this.nbCols - MapManager.MapWidth) / 2);
        let nbEmtpyRows = Math.floor((this.nbRows - MapManager.MapHeight) / 2);
        for (let i = 0; i < MapManager.MapWidth; i++) {
            for (let j = 0; j < MapManager.MapHeight; j++) {
                let value = MapManager.MapTiles[j][i];
                this.editionGrid.addTile(nbEmptyCols + i, nbEmtpyRows + j, `${isNaN(value) ? '' : value}`);
            }
        }
        this.edited = false;
    }
    private onDrag(x: number, y: number): void {
        if (!this.editionGrid.isInbound(x, y)) return;
        this.updateValue(x, y);
    }
    private onDrop(x: number, y: number): void {
        if (isNaN(this.pressedCellI) || isNaN(this.pressedCellJ)) return;
        this.unsetPressedCell();
        this.updateMap();
    }
    private onClick(x: number, y: number): void {
        if (!this.editionGrid.isInbound(x, y)) return;
        this.updateValue(x, y);
        this.unsetPressedCell();
        this.updateMap();
    }
    private updateValue(x: number, y: number): void {
        let i = this.editionGrid.getCellI(x);
        let j = this.editionGrid.getCellJ(y);
        if (isNaN(i) || isNaN(j) || (i == this.pressedCellI && j == this.pressedCellJ)) return;
        this.pressedCellI = i;
        this.pressedCellJ = j;
        this.editionGrid.updateTile(i, j, TileManager.editionTileValue);
        this.edited = true;
    }
    private unsetPressedCell(): void {
        delete this.pressedCellI;
        delete this.pressedCellJ;
    }
    private updateMap(): void {
        if (!this.edited) return;
        let firstCol = this.editionGrid.getFirstNonEmptyCol();
        let firstRow = this.editionGrid.getFirstNonEmptyRow();
        let lastCol = this.editionGrid.getLastNonEmptyCol();
        let lastRow = this.editionGrid.getLastNonEmptyRow();
        let mapWidth = lastCol - firstCol + 1;
        let mapHeight = lastRow - firstRow + 1;
        MapManager.MapTiles = [];
        for (let j = 0; j < mapHeight; j++) {
            MapManager.MapTiles[j] = Array(mapWidth).fill(NaN);
        }
        this.editionGrid.getNonEmptyCells().forEach(cell => MapManager.MapTiles[cell.j - firstRow][cell.i - firstCol] = parseInt(cell.value));
        MapManager.MapHeight = mapHeight;
        MapManager.MapWidth = mapWidth;
    }
}