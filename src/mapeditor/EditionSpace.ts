import { Graphics } from "@game/core/Graphics";
import { EngineObject } from "@game/core/EngineObject";
import { MapManager } from "./MapManager";
import { Grid } from "./components/Grid";

export class EditionSpace extends EngineObject {
    public static EditionGridNbCols: number = 80;
    public static EditionGridNbRows: number = 40;
    private headerHeight: number = 70;
    private get editionGridHeight(): number { return Graphics.canvas.height - this.headerHeight; }
    private editionGrid: Grid;
    constructor(public endX: number) {
        super();
        this.editionGrid = new Grid(
            0,
            this.headerHeight,
            this.endX,
            this.editionGridHeight,
            this.endX / EditionSpace.EditionGridNbCols,
            this.editionGridHeight / EditionSpace.EditionGridNbRows,
            0,
            0
        );
    }
    public init(): void {
        MapManager.loadMap(MapManager.getMapList()[0]);
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
        this.editionGrid.drawHoveredCell();
    }
    public resize(): void {
        this.editionGrid.recalculatePosition(0, this.headerHeight, this.endX, this.editionGridHeight);
        this.editionGrid.updateCellSize(this.endX / EditionSpace.EditionGridNbCols, this.editionGridHeight / EditionSpace.EditionGridNbRows, 0, 0);
    }
}