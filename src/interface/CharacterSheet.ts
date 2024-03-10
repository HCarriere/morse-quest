import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";

/**
 * Presents and interact with character skills, inventory, etc
 */
export class CharacterSheet extends GameObject {

    // display
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private static MARGIN = 50;
    private static PADDING = 20;

    constructor() {
        super();

        this.resize();
    }

    public display() {
        // frame
        Graphics.ctx.lineWidth = 1;
        Graphics.ctx.fillStyle = '#020202';
        Graphics.ctx.strokeStyle = 'white';
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        
    }


    public resize(): void {
        this.x = CharacterSheet.MARGIN;
        this.y = CharacterSheet.MARGIN;
        this.width = Graphics.canvas.width - CharacterSheet.MARGIN*2;
        this.height = Graphics.canvas.height - CharacterSheet.MARGIN*2;
    }

}