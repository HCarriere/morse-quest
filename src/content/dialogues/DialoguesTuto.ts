import { DialoguePiece } from "@game/interface/Dialogue"

export class DialoguesTuto {
    public static INTRODUCTION: DialoguePiece[] = [
    {
        id: 0,
        textLines: ["Bonjour, jeune héro ! Ceci est un simple dialogue de test.", "Bordel."],
        answers: [
            {
                text: "Bonjour",
                goto: 1,
            },
            {
                text: "Bye",
                goto: -1,
            }
        ]
    },{
        id: 1,
        textLines: ["Ravie de te connaitre."],
    }];

}