import { Class } from "@game/content/classes";
import { EngineObject } from "@game/core/EngineObject"
import { GameGraphics } from "@game/system/GameGraphics";
import { Player } from "@game/system/Player";
import { Text } from "./components/Text";
import { ClassButton } from "./components/ClassButton";
import { Button, ButtonStyle } from "./components/Button";

export class GameStartWindow extends EngineObject {
    private classChoices: ClassButton[] = [];
    private title: Text;
    private validationBtn: Button;
    private static TITLE_HEIGHT: 50 = 50;
    private static CLASS_BTN_HEIGHT: 100 = 100;
    private static VALIDATION_BTN_HEIGHT: 100 = 100;
    private static VALIDATION_BTN_WIDTH: 200 = 200;
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
    public display() {
        GameGraphics.ctx.fillStyle = '#020202';
        GameGraphics.ctx.fillRect(0, 0, GameGraphics.canvas.width, GameGraphics.canvas.height);
        this.title.display();
        this.classChoices.forEach(classChoice => classChoice.display());
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.strokeRect(5, this.descriptionY, GameGraphics.canvas.width - 10, this.descriptionHeight);
        if (this.hoveredClass) {
            this.displayClassDescription(this.hoveredClass);
            this.hoveredClass = null;
        } else if (this.selectedClass) {
            this.displayClassDescription(this.selectedClass);
        }
        this.validationBtn.display();
    }
    private displayClassDescription(classToDisplay: Class): void {
        GameGraphics.ctx.font = "18px "+GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = "left";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(classToDisplay.name, 5 + 5, this.descriptionY + 5);
        GameGraphics.ctx.fillText(`Base HP : ${classToDisplay.baseHealth}`, 5 + 5, this.descriptionY + 5 + 20);
        GameGraphics.ctx.fillText(`Initial Spells :`, 5 + 5, this.descriptionY + 5 + 2 * 20);
        let spellWidth = (GameGraphics.canvas.width - 50) / classToDisplay.initialSpells.length;
        for (let index = 0; index < classToDisplay.initialSpells.length; index++) {
            const spell = classToDisplay.initialSpells[index];
            GameGraphics.ctx.fillText(spell.name, 5 + 35 + index * spellWidth, this.descriptionY + 5 + 3 * 20, spellWidth);
        }
    }
    public mousePressed(x: number, y: number): void {
        this.classChoices.forEach(classChoice => classChoice.mousePressed(x, y));
        this.validationBtn.mousePressed(x, y);
    }
    public resize(): void {
        this.title.width = GameGraphics.canvas.width - 40;
        this.classChoices.forEach((classChoice, index) => {
            classChoice.x = index * GameGraphics.canvas.width / this.nbClassChoices + 5;
            classChoice.width = GameGraphics.canvas.width/3 - 10;
        });
        this.validationBtn.x = GameGraphics.canvas.width - GameStartWindow.VALIDATION_BTN_WIDTH - 5;
        this.validationBtn.y = GameGraphics.canvas.height - GameStartWindow.VALIDATION_BTN_HEIGHT - 5;
    }
}