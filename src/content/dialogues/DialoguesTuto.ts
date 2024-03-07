import { DialoguePiece } from "@game/interface/Dialogue"
import { Player } from "@game/system/Player";

export class DialoguesTuto {
    public static INTRODUCTION: DialoguePiece[] = [
    {
        id: 0,
        textLines: ["Un cristal est suspendu en l'air devant vous.", "Il vibre d'énergie."],
        answers: [
            {
                text: "Toucher le cristal.",
                goto: 1,
            },
            {
                text: "Ne rien faire.",
                goto: -1,
            }
        ]
    },{
        id: 1,
        textLines: ["Le cristal vol en éclat, vous projetant dans un nouvel univers."],
        onDialog: () => { Player.teleport(null, 'tuto'); }
    }];

}