import { GameObject } from "./GameObject";

export class GameMap extends GameObject {
    
    
    public display() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
    }

}