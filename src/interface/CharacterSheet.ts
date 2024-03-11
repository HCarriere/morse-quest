import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { SpellButton } from "./components/SpellButton";
import { Player } from "@game/system/Player";

/**
 * Presents and interact with character skills, inventory, etc
 */
export class CharacterSheet extends GameObject {

    // display
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private static MARGIN = 45;
    private static PADDING = 20;

    private static MIN_WIDTH = 1000;

    private spellsButtons: SpellButton[];

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

        // inventory

        // spells & skills
        for (const sb of this.spellsButtons) {
            sb.display();
        }
    }


    public resize(): void {
        this.x = CharacterSheet.MARGIN;
        this.y = CharacterSheet.MARGIN;
        this.width = Graphics.canvas.width - CharacterSheet.MARGIN*2;
        this.height = Graphics.canvas.height - CharacterSheet.MARGIN*2;
        if (this.width < CharacterSheet.MIN_WIDTH) this.width = CharacterSheet.MIN_WIDTH;

        this.synchronizeSheet();
    }

    public mousePressed(x: number, y: number): void {
        for (const sb of this.spellsButtons) {
            sb.mousePressed(x ,y);
        }
    }

    /**
     * Synchronize character sheets with player stats
     */
    public synchronizeSheet() {
        if (!Player.stats) return;

        this.spellsButtons = [];
        let cx=0;
        let cy=0;
        let i=0;
        for (const spell of Player.stats.spells) {
            this.spellsButtons.push(new SpellButton(
                this.x + this.width - 5 - 200 - cx * 205, 
                this.y + cy * 65 + 5, 
                200, 60, spell, i, (n) => {
                    
                }));
            i++;
            if (i%2==0) {
                cy++;
                cx=0;
            } else {
                cx=1;
            }
        }
    }

}