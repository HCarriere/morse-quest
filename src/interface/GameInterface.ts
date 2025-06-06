import { EngineObject } from "@game/core/EngineObject";
import { Dialogue, DialoguePiece } from "./Dialogue";
import { Combat } from "./Combat";
import { CharacterSheet } from "./CharacterSheet";
import { Button } from "./components/Button";
import { GameGraphics } from "@game/system/GameGraphics";
import { Ally } from "@game/content/Ally";
import { Spell } from "@game/content/spells";
import { GameStats } from "@game/content/GameStats";

export class GameInterface extends EngineObject {

    public static frame = 0;

    private static hudElements: EngineObject[];
    private static characterSheetButton: Button;
    private static dialogues: Dialogue[];
    private static combat: Combat;
    private static characterSheet: CharacterSheet;

    /**
     * Combat needs to be disabled inside the loop.
     * Do not handle combat end outside game loop.
     */
    private static endCombatFlag = false;

    private static displayCharacterSheet = false;

    public init(): void {
        GameInterface.hudElements = [];
        GameInterface.dialogues = [];

        GameInterface.characterSheet = new CharacterSheet();

        // init HUD elements
        GameInterface.characterSheetButton = new Button(5, 5, 110, 30, () => {
            if (GameInterface.displayCharacterSheet) GameInterface.hideCharacterSheet();
            else GameInterface.showCharacterSheet();
        }, {
            text: '☰ Personnage ❗',
            textColor: 'white',
            color: 'black',
            strokeColor: 'white',
            colorHover: 'darkgrey',
            textSize: 15,
        });
        GameInterface.hudElements.push(GameInterface.characterSheetButton);

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
        }

        if (GameInterface.displayCharacterSheet) {
            GameInterface.characterSheet.display();
        }

        // HUD elements
        if (!GameInterface.combat) {
            for (const obj of GameInterface.hudElements) {
                obj.display();
            }
        }

        // process first dialogue
        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].display();

        GameGraphics.displayInterfaceParticles();

        GameInterface.frame++;
    }

    public keyPressed(key: number): void {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.keyPressed(key);
        }

        if (GameInterface.displayCharacterSheet) {
            GameInterface.characterSheet.keyPressed(key);
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].keyPressed(key);  
    }

    public mousePressed(x: number, y: number): void {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.mousePressed(x, y);
        }

        if (GameInterface.displayCharacterSheet) {
            GameInterface.characterSheet.mousePressed(x, y);
        }

        if (!GameInterface.combat) {
            for (const obj of GameInterface.hudElements) {
                obj.mousePressed(x, y);
            }
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].mousePressed(x, y);
    }

    public resize(): void {
        // Combat
        if (GameInterface.combat) {
            GameInterface.combat.resize();
        }

        if (GameInterface.displayCharacterSheet) {
            GameInterface.characterSheet.resize();
        }

        if (!GameInterface.combat) {
            for (const obj of GameInterface.hudElements) {
                obj.resize();
            }
        }

        if (GameInterface.dialogues.length > 0) GameInterface.dialogues[0].resize();
    }

    /**
     * Will return true if overworld controls should be freezed, be it for
     * dialogue, interface, combat ... 
     */
    public static get freezeControls(): boolean {
        return GameInterface.dialogues.length > 0 ||
            GameInterface.combat != null ||
            GameInterface.displayCharacterSheet;
    }

    public static addDialogue(pieces: DialoguePiece[]) {
        GameInterface.dialogues.push(new Dialogue(pieces));
    }

    public static removeCurrentDialogue() {
        GameInterface.dialogues.shift();
    }

    public static setCombat(combat: Combat) {
        GameInterface.combat = combat;
        GameInterface.hideCharacterSheet();
    }

    public static endCombat() {
        GameInterface.endCombatFlag = true;
    }

    public static showCharacterSheet() {
        GameInterface.characterSheet.resize();
        GameInterface.displayCharacterSheet = true;
        GameInterface.characterSheetButton.style.text = `☰ Personnage`;
    }

    public static hideCharacterSheet() {
        GameInterface.displayCharacterSheet = false;
    }

    public static onNewCharacterData() {
        GameInterface.characterSheetButton.style.text = '☰ Personnage ❗';
    }

    public static addAllyToCombat(ally: Ally) {
        if (GameInterface.combat) {
            GameInterface.combat.addAlly(ally);
        } else {
            console.warn("Cannot add ally, no combat in progress.");
        }
    }

    public static bufferSpellInCombat(spell: Spell, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number, stat: GameStats}) {
        if (GameInterface.combat) {
            GameInterface.combat.bufferSpell(spell, targets, orig);
        } else {
            console.warn("Cannot buffer spell, no combat in progress.");
        }
    }
}
