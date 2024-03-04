import { GameObject } from "@game/system/GameObject";
import { Dialogue, DialoguePiece } from "./Dialogue";
import { Controller } from "@game/system/Controller";
import { Combat } from "./Combat";
import { Graphics } from "@game/system/Graphics";

export class GameInterface extends GameObject {

    public static frame = 0;

    private static hudElements: GameObject[];
    private static dialogues: Dialogue[];
    private static combat: Combat;

    public init(): void {
        GameInterface.hudElements = [];
        GameInterface.dialogues = [];

        /*this.elements.push(new Button(this.ctx, this.canvas, 5, 5, 60, 60, () => {
            console.log('menu click')
        }, {
            text: 'MENU',
            color: 'lightgrey',
            textColor: 'black'
        }));*/

        for (const obj of GameInterface.hudElements) {
            obj.init();
        }
    }
    
    public display() {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.display();
        }

        // Permanent HUD elements
        for (const obj of GameInterface.hudElements) {
            obj.display();
        }

        // process first dialogue
        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].display();

        // debug TODO REMOVE ME
        Graphics.ctx.fillStyle = 'black';
        Graphics.ctx.fillRect(Controller.mouseX-5, Controller.mouseY-5, 10, 10);

        GameInterface.frame++;
    }

    public keyPressed(orientation: number): void {
        for (const obj of GameInterface.hudElements) {
            obj.keyPressed(orientation);
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].keyPressed(orientation);
        
    }

    public mousePressed(x: number, y: number): void {
        for (const obj of GameInterface.hudElements) {
            obj.mousePressed(x, y);
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].mousePressed(x, y);
    }

    public resize(): void {
        for (const obj of GameInterface.hudElements) {
            obj.resize();
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].resize();
    }

    /**
     * Will return true if overworld controls should be freezed, be it for
     * dialogue, interface, combat ... 
     */
    public static get freezeControls(): boolean {
        return GameInterface.dialogues.length > 0;
    }

    public static addDialogue(pieces: DialoguePiece[]) {
        GameInterface.dialogues.push(new Dialogue(pieces));
    }

    public static removeCurrentDialogue() {
        GameInterface.dialogues.shift();
    }
}