import { Button, ButtonStyle } from "@game/interface/components/Button"
import { GridElement } from "./GridElement";

export class GridButton extends Button implements GridElement {
    constructor(private cellI: number, private cellJ: number, private gridCellWidth: number, private gridCellHeight: number, private paddingLeft: number, private paddingTop: number, public x: number, public y: number, public width: number, public height: number, public onClick: () => void, public style: ButtonStyle = {}) {
        super(x, y, width, height, onClick, style);
    }
    public recalculatePosition(gridX: number, gridY: number): void {
        this.x = gridX + this.cellI * this.gridCellWidth + this.paddingLeft;
        this.y = gridY + this.cellJ * this.gridCellHeight + this.paddingTop;
    }
}