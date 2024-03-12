import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";
import { SpellButton } from "./components/SpellButton";
import { Player } from "@game/system/Player";
import { SkillButton } from "./components/SkillButton";

/**
 * Presents and interact with character skills, inventory, etc
 */
export class CharacterSheet extends EngineObject {

    // display
    private x: number;
    private y: number;
    private width: number;
    private height: number;

    private static MARGIN = 45;
    private static SPELL_WIDTH = 200;
    private static SPELL_HEIGHT = 50;

    private static MIN_WIDTH = 1000;
    private static MIN_HEIGHT = 500;

    private spellsButtons: (SpellButton|SkillButton)[];

    private tooltipSpell: string[];
    private tooltipSpellDisplay = false;

    constructor() {
        super();

        this.resize();
    }

    public display() {
        // frame
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.fillStyle = '#020202';
        GameGraphics.ctx.strokeStyle = '#999999';
        GameGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        GameGraphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // inventory

        // spells & skills
        for (const sb of this.spellsButtons) {
            sb.display();
        }

        // spell tooltip
        if (this.tooltipSpellDisplay) {
            this.tooltipSpellDisplay = false;
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.fillStyle = '#020202';
            GameGraphics.ctx.strokeStyle = '#999999';
            GameGraphics.ctx.fillRect(this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltipSpell.length);
            GameGraphics.ctx.strokeRect(this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltipSpell.length);

            GameGraphics.ctx.font = "18px "+GameGraphics.FONT;
            GameGraphics.ctx.fillStyle = 'white';
            GameGraphics.ctx.textAlign = "right";
            GameGraphics.ctx.textBaseline = "top";
            for (let i = 0; i<this.tooltipSpell.length; i++) {
                GameGraphics.ctx.fillText(this.tooltipSpell[i], 
                    this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 20, this.y + 50 + i*20);
            }
        }

        // spell slots
        GameGraphics.ctx.font = "14px "+GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'lightgreen';
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(`Sorts choisis : ${Player.stats.activeSpellScore}/${Player.stats.activeSpellsMax}`, 
            this.x + this.width - CharacterSheet.SPELL_WIDTH*2 - 10,
            this.y + 10);

        // skill slots
        GameGraphics.ctx.font = "14px "+GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'yellow';
        GameGraphics.ctx.textAlign = "right";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(`Passifs choisis : ${Player.stats.activeSkillScore}/${Player.stats.passiveSkillsMax}`, 
            this.x + this.width - 10,
            this.y + 10);
    }


    public resize(): void {
        this.x = CharacterSheet.MARGIN;
        this.y = CharacterSheet.MARGIN;
        this.width = GameGraphics.canvas.width - CharacterSheet.MARGIN*2;
        this.height = GameGraphics.canvas.height - CharacterSheet.MARGIN*2;
        this.width = Math.max(CharacterSheet.MIN_WIDTH, this.width);
        this.height = Math.max(CharacterSheet.MIN_HEIGHT, this.height);

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
        let skillindex = 0;
        // spells
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

        // skills
        for (const skill of Player.stats.skills) {
            this.spellsButtons.push(new SkillButton(
                this.x + this.width - 5 - CharacterSheet.SPELL_WIDTH - cx * (CharacterSheet.SPELL_WIDTH+5), 
                this.y + cy * (CharacterSheet.SPELL_HEIGHT+5) + 35, 
                CharacterSheet.SPELL_WIDTH, CharacterSheet.SPELL_HEIGHT, skill, skillindex,
                (n, sb) => {
                    // on click
                    Player.stats.toggleActiveSkill(n);
                },
                (s) => {
                    // on hover
                    this.tooltipSpell = s.description;
                    this.tooltipSpellDisplay = true;
                }));
            i++;
            skillindex++;
            if (i%2==0) {
                cy++;
                cx=0;
            } else {
                cx=1;
            }
        }
    }

}