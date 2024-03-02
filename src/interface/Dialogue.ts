import { Controller } from "@game/system/Controller";
import { GameObject } from "@game/system/GameObject";
import { GameInterface } from "./GameInterface";

export interface DialoguePiece {
    id: number,
    textLines: string[];
    answers?: DialogueAnswer[];
}

export interface DialogueAnswer {
    text: string;
    goto: number;
}

export class Dialogue extends GameObject {

    private static FONT = "30px monospace";
    private static INTERLINE = 30;

    private pieces: DialoguePiece[];
    private currentDialoguePiece: DialoguePiece;
    private currentTextAnimation: number;
    private answerUnlocked: boolean;

    private x: number;
    private y: number;
    private width: number;
    private height: number;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, pieces: DialoguePiece[]) {
        super(ctx, canvas);
        this.pieces = pieces;
        
        this.resize();
        this.selectDialoguePiece(0);
    }

    public display() {
        if (!this.currentDialoguePiece) return;

        // rect
        this.ctx.fillStyle = 'lightblue';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // text
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = "left";
        this.ctx.font = Dialogue.FONT;
        this.ctx.textBaseline = "top";
        /*this.ctx.fillText(this.currentDialoguePiece.textLines.substring(0, Math.floor(this.currentTextAnimation)), 
        this.x + 20, this.y + 20, this.width - 40);*/
        let charCount = 0;
        let currentAnimatingLine = 0;
        for (let i = 0; i < Math.min(this.currentDialoguePiece.textLines.length, currentAnimatingLine+1) ; i++) {
            if (this.currentTextAnimation > this.currentDialoguePiece.textLines[i].length + charCount) {
                // this line is already animated
                charCount += this.currentDialoguePiece.textLines[i].length;
                currentAnimatingLine ++;

                this.ctx.fillText(this.currentDialoguePiece.textLines[i], 
                    this.x + 20, this.y + 20 + Dialogue.INTERLINE * i, this.width - 40);
            }
            else if (currentAnimatingLine == i) {
                // this line is beeing animated
                this.ctx.fillText(this.currentDialoguePiece.textLines[i].substring(0, this.currentTextAnimation - charCount), 
                    this.x + 20, this.y + 20 + Dialogue.INTERLINE * i, this.width - 40);
            }
        }
        this.currentTextAnimation += 0.5;

        if (currentAnimatingLine >= this.currentDialoguePiece.textLines.length) {
            this.answerUnlocked = true;
        }

        // responses
        if (this.answerUnlocked) {
            this.ctx.textBaseline = "bottom";
            for (let i = this.currentDialoguePiece.answers.length - 1; i >= 0; i--) {
                this.ctx.fillStyle = 'black';
                if (this.isCoordsInsideAnswer(Controller.mouseX, Controller.mouseY, i)) {
                    this.ctx.fillRect(this.x, this.y + this.height - 20 - Dialogue.INTERLINE * i - Dialogue.INTERLINE, this.width, Dialogue.INTERLINE);
                    this.ctx.fillStyle = 'white';
                }
                this.ctx.fillText('> ' + this.currentDialoguePiece.answers[i].text, 
                    this.x + 20, this.y + this.height - 20 - Dialogue.INTERLINE * i, this.width - 40);
            }
        }
    }

    public mousePressed(x: number, y: number): void {
        if (!this.answerUnlocked) return;
        for (let i = this.currentDialoguePiece.answers.length - 1; i >= 0; i--) {
            // this.x + 20, this.y + this.height - 20 - Dialogue.INTERLINE * i
            if (this.isCoordsInsideAnswer(x, y, i)) {
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
        this.ctx.font = Dialogue.FONT;
        for (const line of this.currentDialoguePiece.textLines) {
            const size = this.ctx.measureText(line);
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

        this.currentDialoguePiece.answers.reverse();

        this.answerUnlocked = false;
    }

    public endDialogue() {
        GameInterface.getInstance().removeCurrentDialogue();
    }
    
    public resize(): void {
        this.x = 100;
        this.y = this.canvas.height - 250;
        this.width = this.canvas.width - 200;
        this.height = 200
    }
    
}