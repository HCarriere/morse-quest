import { EngineObject } from "@game/core/EngineObject";
import { Dialogue, DialoguePiece } from "./Dialogue";
import { GameController } from "@game/system/GameController";
import { Combat } from "./Combat";
import { GameGraphics } from "@game/system/GameGraphics";

export class GameInterface extends EngineObject {

    public static frame = 0;

    private static hudElements: EngineObject[];
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
        GameGraphics.ctx.fillStyle = 'purple';
        GameGraphics.ctx.fillRect(GameController.mouseX-5, GameController.mouseY-5, 10, 10);

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