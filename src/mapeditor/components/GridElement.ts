export interface GridElement {
    updatePosition(newX: number, newY: number, newWidth: number, newHeight: number): void;
    updateValue(value: string): void;
}