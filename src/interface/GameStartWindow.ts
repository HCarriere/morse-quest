import { Class } from "@game/content/classes";
import { EngineObject } from "@game/core/EngineObject"
import { GameGraphics } from "@game/system/GameGraphics";
import { Player } from "@game/system/Player";
import { Text } from "./components/Text";
import { ClassButton } from "./components/ClassButton";
import { Button, ButtonStyle } from "./components/Button";
import { SpellButton } from "./components/SpellButton";
import { Spell } from "@game/content/spells";

export class GameStartWindow extends EngineObject {
    private classChoices: ClassButton[] = [];
    private title: Text;
    private validationBtn: Button;
    private static TITLE_HEIGHT: 50 = 50;
    private static CLASS_BTN_HEIGHT: 100 = 100;
    private static VALIDATION_BTN_HEIGHT: 100 = 100;
    private static VALIDATION_BTN_WIDTH: 200 = 200;
    private static SPELL_BTN_HEIGHT: 60 = 60;
    private get descriptionY(): number {
        return 20 + GameStartWindow.TITLE_HEIGHT + 50 + GameStartWindow.CLASS_BTN_HEIGHT + 50;
    }
    private get descriptionHeight(): number {
        return GameGraphics.canvas.height - (this.descriptionY + 5 + GameStartWindow.VALIDATION_BTN_HEIGHT + 5);
    }
    private btnDefaultStyle: ButtonStyle;
    private btnDisabledStyle: ButtonStyle;
    private hoveredClass: Class;
    private selectedClass: Class;
    private selectedClassSpellButtons: SpellButton[] = [];
    private showHoveredSpellDescription: boolean = false;
    private hoveredSpellDescription: string[];
    private selectedSpell: Spell;
    constructor(private close: () => void, private nbClassChoices: number = 3) {
        super();
        this.btnDefaultStyle = {
            strokeColor: 'white',
            textSize: 20,
            color: 'white',
            colorHover: 'grey',
            textColor: 'black'
        };
        this.btnDisabledStyle = {
            ...this.btnDefaultStyle,
            color: 'grey',
            colorHover: undefined
        }
        for (let index = 0; index < this.nbClassChoices; index++) {
            const choice = Player.classPool.drawRandomItem();
            if (!!choice) this.classChoices.push(new ClassButton(
                index * GameGraphics.canvas.width / this.nbClassChoices + 5,
                20 + GameStartWindow.TITLE_HEIGHT + 50,
                GameGraphics.canvas.width/3 - 10,
                GameStartWindow.CLASS_BTN_HEIGHT,
                choice,
                (btnClass: Class) => {
                    this.selectedClass = btnClass;
                    this.selectedClassSpellButtons = this.buildClassSpellButtons(btnClass);
                    delete this.selectedSpell;
                    this.validationBtn.style = {
                        ...this.validationBtn.style,
                        ...this.btnDefaultStyle
                    }
                },
                (btnClass: Class) => { this.hoveredClass = btnClass; }
            ));
        }
        this.title = new Text(20, 20, GameGraphics.canvas.width - 40, GameStartWindow.TITLE_HEIGHT, 'Choose a class', 'white');
        this.validationBtn = new Button(
            GameGraphics.canvas.width - GameStartWindow.VALIDATION_BTN_WIDTH - 5,
            GameGraphics.canvas.height - GameStartWindow.VALIDATION_BTN_HEIGHT - 5,
            GameStartWindow.VALIDATION_BTN_WIDTH,
            GameStartWindow.VALIDATION_BTN_HEIGHT,
            () => {
                if (!this.selectedClass) return;
                Player.setClass(this.selectedClass);
                this.close();
            },
            {
                ...this.btnDisabledStyle,
                text: 'Confirm',
            }
        );
    }
    private buildClassSpellButtons(btnClass: Class): SpellButton[] {
        let classSpellButtons = [];
        let spellWidth = (GameGraphics.canvas.width - 20) / btnClass.initialSpells.length;
        for (let index = 0; index < btnClass.initialSpells.length; index++) {
            const currentSpell = btnClass.initialSpells[index];
            classSpellButtons.push(new SpellButton(
                5 + 5 + index * spellWidth,
                this.descriptionY + 5 + 3 * 20,
                spellWidth,
                GameStartWindow.SPELL_BTN_HEIGHT,
                currentSpell,
                index,
                (n: number, sb: SpellButton) => {
                    this.selectedSpell = sb.spell;
                },
                (spell: Spell) => {
                    this.showHoveredSpellDescription = true;
                    this.hoveredSpellDescription = spell.description;
                }
            ));
        }
        return classSpellButtons;
    }
    public display() {
        GameGraphics.ctx.fillStyle = '#020202';
        GameGraphics.ctx.fillRect(0, 0, GameGraphics.canvas.width, GameGraphics.canvas.height);
        this.title.display();
        this.classChoices.forEach(classChoice => classChoice.display());
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.strokeRect(5, this.descriptionY, GameGraphics.canvas.width - 10, this.descriptionHeight);
        if (this.hoveredClass) {
            let hoveredClassSpellButtons = this.buildClassSpellButtons(this.hoveredClass);
            this.displayClassDescription(this.hoveredClass, hoveredClassSpellButtons);
            this.hoveredClass = null;
        } else if (this.selectedClass) {
            this.displayClassDescription(this.selectedClass, this.selectedClassSpellButtons);
        }
        if (this.showHoveredSpellDescription) {
            this.showHoveredSpellDescription = false;
            this.displaySpellDescription(this.hoveredSpellDescription);
        } else if (this.selectedSpell) {
            this.displaySpellDescription(this.selectedSpell.description);
        }
        this.validationBtn.display();
    }
    private displayClassDescription(classToDisplay: Class, classSpellButtons: SpellButton[]): void {
        GameGraphics.ctx.font = "18px "+GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(classToDisplay.name, 5 + 5, this.descriptionY + 5);
        GameGraphics.ctx.fillText(`Base HP : ${classToDisplay.baseHealth}`, 5 + 5, this.descriptionY + 5 + 20);
        GameGraphics.ctx.fillText(`Initial Spells :`, 5 + 5, this.descriptionY + 5 + 2 * 20);
        classSpellButtons.forEach(spellButton => spellButton.display());
    }
    private displaySpellDescription(spellDescription: string[]): void {
        GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.fillStyle = '#020202';
            GameGraphics.ctx.strokeStyle = '#999999';
            GameGraphics.ctx.fillRect(
                5 + 5,
                this.descriptionY + 5 + 3 * 20 + GameStartWindow.SPELL_BTN_HEIGHT + 5,
                GameGraphics.canvas.width - 20,
                10+20*spellDescription.length
            );
            GameGraphics.ctx.strokeRect(
                5 + 5,
                this.descriptionY + 5 + 3 * 20 + GameStartWindow.SPELL_BTN_HEIGHT + 5,
                GameGraphics.canvas.width - 20,
                10+20*spellDescription.length
            );

            GameGraphics.ctx.font = "18px "+GameGraphics.FONT;
            GameGraphics.ctx.fillStyle = 'white';
            GameGraphics.ctx.textAlign = "left";
            GameGraphics.ctx.textBaseline = "top";
            for (let i = 0; i<spellDescription.length; i++) {
                GameGraphics.ctx.fillText(
                    spellDescription[i],
                    5 + 5 + 5,
                    this.descriptionY + 5 + 3 * 20 + GameStartWindow.SPELL_BTN_HEIGHT + 5 + 5 + i*20,
                    GameGraphics.canvas.width - 30
                );
            }
    }
    public mousePressed(x: number, y: number): void {
        this.classChoices.forEach(classChoice => classChoice.mousePressed(x, y));
        this.validationBtn.mousePressed(x, y);
        this.selectedClassSpellButtons.forEach(spellButton => spellButton.mousePressed(x, y));
    }
    public resize(): void {
        this.title.width = GameGraphics.canvas.width - 40;
        this.classChoices.forEach((classChoice, index) => {
            classChoice.x = index * GameGraphics.canvas.width / this.nbClassChoices + 5;
            classChoice.width = GameGraphics.canvas.width/3 - 10;
        });
        this.validationBtn.x = GameGraphics.canvas.width - GameStartWindow.VALIDATION_BTN_WIDTH - 5;
        this.validationBtn.y = GameGraphics.canvas.height - GameStartWindow.VALIDATION_BTN_HEIGHT - 5;
        if (!!this.selectedClass) {
            let spellWidth = (GameGraphics.canvas.width - 50) / this.selectedClass.initialSpells.length;
            this.selectedClassSpellButtons.forEach((spellButton, index) => {
                spellButton.x = 5 + 35 + index * spellWidth;
                spellButton.width = spellWidth;
            });
        }
    }
}