import { Button, ButtonStyle } from "@game/interface/components/Button"
import { GridElement } from "./GridElement";

export class GridButton extends Button implements GridElement {
    constructor(public x: number, public y: number, public width: number, public height: number, public onClick: () => void, public style: ButtonStyle = {}) {
        super(x, y, width, height, onClick, style);
    }

    public updatePosition(newX: number, newY: number, newWidth: number, newHeight: number): void {
        this.x = newX;
        this.y = newY;
        this.width = newWidth;
        this.height = newHeight;
    }
    
    updateValue(value: string): void {
        console.log('cannot update value of grid button', this);
    }
}