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
    private static SPELL_WIDTH = 200;
    private static SPELL_HEIGHT = 50;

    private static MIN_WIDTH = 1000;

    private spellsButtons: SpellButton[];

    private tooltipSpell: string[];
    private tooltipSpellDisplay = false;

    constructor() {
        super();

        this.resize();
    }

    public display() {
        // frame
        Graphics.ctx.lineWidth = 1;
        Graphics.ctx.fillStyle = '#020202';
        Graphics.ctx.strokeStyle = '#999999';
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // inventory

        // spells & skills
        for (const sb of this.spellsButtons) {
            sb.display();
        }

        // spell tooltip
        if (this.tooltipSpellDisplay) {
            this.tooltipSpellDisplay = false;
            Graphics.ctx.lineWidth = 1;
            Graphics.ctx.fillStyle = '#020202';
            Graphics.ctx.strokeStyle = '#999999';
            Graphics.ctx.fillRect(this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltipSpell.length);
            Graphics.ctx.strokeRect(this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltipSpell.length);

            Graphics.ctx.font = "18px "+Graphics.FONT;
            Graphics.ctx.fillStyle = 'white';
            Graphics.ctx.textAlign = "right";
            Graphics.ctx.textBaseline = "top";
            for (let i = 0; i<this.tooltipSpell.length; i++) {
                Graphics.ctx.fillText(this.tooltipSpell[i], 
                    this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 20, this.y + 50 + i*20);
            }
        }

        // spell slots
        Graphics.ctx.font = "14px "+Graphics.FONT;
        Graphics.ctx.fillStyle = 'lightgreen';
        Graphics.ctx.textAlign = "left";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(`Sorts choisis : ${Player.stats.activeSpellScore}/${Player.stats.activeSpellsMax}`, 
            this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 10,
            this.y + 10);
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
                this.x + this.width - 5 - CharacterSheet.SPELL_WIDTH - cx * (CharacterSheet.SPELL_WIDTH+5), 
                this.y + cy * (CharacterSheet.SPELL_HEIGHT+5) + 35, 
                CharacterSheet.SPELL_WIDTH, CharacterSheet.SPELL_HEIGHT, spell, i,
                (n, sb) => {
                    // on click
                    Player.stats.toggleActiveSpell(n);
                },
                (s) => {
                    // on hover
                    this.tooltipSpell = s.description;
                    this.tooltipSpellDisplay = true;
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