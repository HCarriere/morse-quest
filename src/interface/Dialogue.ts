import { Controller } from "@game/system/Controller";
import { GameObject } from "@game/system/GameObject";
import { GameInterface } from "./GameInterface";
import { Graphics } from "@game/system/Graphics";

export interface DialoguePiece {
    id: number;
    textLines: string[];
    answers?: DialogueAnswer[];
    onDialog?: () => void;
}

export interface DialogueAnswer {
    text: string;
    goto: number;
    onAnswer?: () => void;
}

export class Dialogue extends GameObject {

    private static INTERLINE = 30;

    private pieces: DialoguePiece[];
    private currentDialoguePiece: DialoguePiece;
    private currentTextAnimation: number;
    private answerUnlocked: boolean;

    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(pieces: DialoguePiece[]) {
        super();
        this.pieces = pieces;
        
        this.resize();
        this.selectDialoguePiece(0);
    }

    public display() {
        if (!this.currentDialoguePiece) return;

        // rect
        Graphics.ctx.fillStyle = 'lightblue';
        Graphics.ctx.strokeStyle = 'black';
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // text
        Graphics.ctx.fillStyle = 'black';
        Graphics.ctx.textAlign = "left";
        Graphics.ctx.font = '25px '+Graphics.FONT;
        Graphics.ctx.textBaseline = "top";
        /*Graphics.ctx.fillText(this.currentDialoguePiece.textLines.substring(0, Math.floor(this.currentTextAnimation)), 
        this.x + 20, this.y + 20, this.width - 40);*/
        let charCount = 0;
        let currentAnimatingLine = 0;
        for (let i = 0; i < Math.min(this.currentDialoguePiece.textLines.length, currentAnimatingLine+1) ; i++) {
            if (this.currentTextAnimation > this.currentDialoguePiece.textLines[i].length + charCount) {
                // this line is already animated
                charCount += this.currentDialoguePiece.textLines[i].length;
                currentAnimatingLine ++;

                Graphics.ctx.fillText(this.currentDialoguePiece.textLines[i], 
                    this.x + 20, this.y + 20 + Dialogue.INTERLINE * i, this.width - 40);
            }
            else if (currentAnimatingLine == i) {
                // this line is beeing animated
                Graphics.ctx.fillText(this.currentDialoguePiece.textLines[i].substring(0, this.currentTextAnimation - charCount), 
                    this.x + 20, this.y + 20 + Dialogue.INTERLINE * i, this.width - 40);
            }
        }
        this.currentTextAnimation += 0.5;

        if (currentAnimatingLine >= this.currentDialoguePiece.textLines.length) {
            this.answerUnlocked = true;
        }

        // responses
        if (this.answerUnlocked) {
            Graphics.ctx.textBaseline = "bottom";
            for (let i = this.currentDialoguePiece.answers.length - 1; i >= 0; i--) {
                Graphics.ctx.fillStyle = 'black';
                if (this.isCoordsInsideAnswer(Controller.mouseX, Controller.mouseY, i)) {
                    Graphics.ctx.fillRect(this.x, this.y + this.height - 20 - Dialogue.INTERLINE * i - Dialogue.INTERLINE, this.width, Dialogue.INTERLINE);
                    Graphics.ctx.fillStyle = 'white';
                }
                Graphics.ctx.fillText('> ' + this.currentDialoguePiece.answers[i].text, 
                    this.x + 20, this.y + this.height - 20 - Dialogue.INTERLINE * i, this.width - 40);
            }
        }
    }

    public mousePressed(x: number, y: number): void {
        if (!this.answerUnlocked) {
            this.currentTextAnimation += 2000;
            return;
        }
        for (let i = this.currentDialoguePiece.answers.length - 1; i >= 0; i--) {
            // this.x + 20, this.y + this.height - 20 - Dialogue.INTERLINE * i
            if (this.isCoordsInsideAnswer(x, y, i)) {
                // trigger answer event
                if (this.currentDialoguePiece.answers[i].onAnswer) {
                    this.currentDialoguePiece.answers[i].onAnswer();
                }
                // move to next dialogue piece
                this.selectDialoguePiece(this.currentDialoguePiece.answers[i].goto);
            }
        }
    }

    private isCoordsInsideAnswer(x: number, y: number, i: number): boolean {
        if (x > this.x && x < this.x + this.width && 
            y > this.y + this.height - 20 - Dialogue.INTERLINE * i - Dialogue.INTERLINE && 
            y < this.y + this.height - 20 - Dialogue.INTERLINE * i) {
            return true;
        }
        return false;
    }

    /**
     * Select the correct dialogue piece
     * & resize it according to box dimensions
     * @param id 
     */
    private selectDialoguePiece(id: number) {
        this.currentTextAnimation = 0;
        this.currentDialoguePiece = null;
        this.answerUnlocked = false;
        if (id < 0) {
            this.endDialogue();
            return;
        }

        for (const d of this.pieces) {
            if (d.id == id) {
                this.currentDialoguePiece = d;
            }
        }
        if (!this.currentDialoguePiece) {
            this.endDialogue();
            return;
        }

        // resize it
        let newTextLines = [];
        Graphics.ctx.font = '25px '+Graphics.FONT;
        for (const line of this.currentDialoguePiece.textLines) {
            const size = Graphics.ctx.measureText(line);
            let portion = size.width / this.width;
            if (portion > 1) {
                // text > width, need splitting
                //determine char on which to split
                let charAt = Math.floor((line.length * this.width) /  size.width - 1);
                for (let i = charAt; i > 0; i--) {
                    // first sequable char
                    if (line.charAt(i) == ' ') {
                        charAt = i + 1;
                        break;
                    }
                }
                const textA = line.substring(0, charAt);
                const textB = line.substring(charAt);
                newTextLines.push(textA, textB);
            }
            else {
                newTextLines.push(line);
            }
        }
        this.currentDialoguePiece.textLines = newTextLines;

        // if there is no answer, generate a "end" answer leading to -1
        if (!this.currentDialoguePiece.answers) {
            this.currentDialoguePiece.answers = [];
            this.currentDialoguePiece.answers.push({
                goto: -1,
                text: 'Fin',
            })
        }
        // trigger dialog event
        if (this.currentDialoguePiece.onDialog) {
            this.currentDialoguePiece.onDialog();
        }

        this.answerUnlocked = false;
    }

    public endDialogue() {
        GameInterface.removeCurrentDialogue();
    }
    
    public resize(): void {
        this.x = 100;
        this.y = Graphics.canvas.height - 250;
        this.width = Graphics.canvas.width - 200;
        this.height = 200
    }
    
}