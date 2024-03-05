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

    private static endCombatFlag = false;

    public init(): void {
        GameInterface.hudElements = [];
        GameInterface.dialogues = [];

        for (const obj of GameInterface.hudElements) {
            obj.init();
        }
    }
    
    public display() {
        // Combat
        if (GameInterface.endCombatFlag) {
            delete GameInterface.combat;
            GameInterface.endCombatFlag = false;
        }
        if (GameInterface.combat) {
            GameInterface.combat.display();
            GameInterface.combat.displayTooltips();
        }

        // Permanent HUD elements
        for (const obj of GameInterface.hudElements) {
            obj.display();
        }

        // process first dialogue
        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].display();

        // debug TODO REMOVE ME
        Graphics.ctx.fillStyle = 'purple';
        Graphics.ctx.fillRect(Controller.mouseX-5, Controller.mouseY-5, 10, 10);

        GameInterface.frame++;
    }

    public keyPressed(key: number): void {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.keyPressed(key);
        }

        for (const obj of GameInterface.hudElements) {
            obj.keyPressed(key);
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].keyPressed(key);
        
    }

    public mousePressed(x: number, y: number): void {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.mousePressed(x, y);
        }

        for (const obj of GameInterface.hudElements) {
            obj.mousePressed(x, y);
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].mousePressed(x, y);
    }

    public resize(): void {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.resize();
        }

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
        return GameInterface.dialogues.length > 0 ||
            GameInterface.combat != null;
    }

    public static addDialogue(pieces: DialoguePiece[]) {
        GameInterface.dialogues.push(new Dialogue(pieces));
    }

    public static removeCurrentDialogue() {
        GameInterface.dialogues.shift();
    }

    public static setCombat(combat: Combat) {
        GameInterface.combat = combat;
    }

    public static endCombat() {
        GameInterface.endCombatFlag = true;
    }
}