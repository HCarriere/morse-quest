import { GameObject } from "@game/system/GameObject";
import { Button } from "./components/Button";
import { Dialogue, DialoguePiece } from "./Dialogue";
import { Controller } from "@game/system/Controller";

export class GameInterface extends GameObject {
    /**
     * Singleton
     */
    private static instance: GameInterface;

    private elements: GameObject[];
    private dialogues: Dialogue[];

    public init(): void {
        this.elements = [];
        this.dialogues = [];

        this.elements.push(new Button(this.ctx, this.canvas, 5, 5, 200, 50, () => {
            console.log('menu click')
        }, {
            text: 'MENU',
            color: 'red',
            textColor: 'yellow'
        }));

        for (const obj of this.elements) {
            obj.init();
        }
    }
    
    public display() {
        for (const obj of this.elements) {
            obj.display();
        }

        // process first dialogue
        if (this.dialogues.length > 0) this.dialogues[0].display();

        // debug TODO REMOVE ME
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(Controller.mouseX-5, Controller.mouseY-5, 10, 10);
    }

    public keyPressed(orientation: number): void {
        for (const obj of this.elements) {
            obj.keyPressed(orientation);
        }

        if (this.dialogues.length > 0) this.dialogues[0].keyPressed(orientation);
        
    }

    public mousePressed(x: number, y: number): void {
        for (const obj of this.elements) {
            obj.mousePressed(x, y);
        }

        if (this.dialogues.length > 0) this.dialogues[0].mousePressed(x, y);
    }

    public resize(): void {
        for (const obj of this.elements) {
            obj.resize();
        }

        if (this.dialogues.length > 0) this.dialogues[0].resize();
    }

    /**
     * Will return true if overworld controls should be freezed, be it for
     * dialogue, interface, combat ... 
     */
    public get freezeControls(): boolean {
        return this.dialogues.length > 0;
    }

    public addDialogue(pieces: DialoguePiece[]) {
        this.dialogues.push(new Dialogue(this.ctx, this.canvas, pieces));
    }

    public removeCurrentDialogue() {
        this.dialogues.shift();
    }


    public static getInstance(): GameInterface {
        if (!GameInterface.instance) {
            console.log('error : Interface not loaded');
        }

        return GameInterface.instance;
    }

    public static setInstance(obj: GameInterface) {
        GameInterface.instance = obj;
    }
}