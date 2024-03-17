import { Combat } from "@game/interface/Combat";
import { DialoguePiece } from "@game/interface/Dialogue"
import { GameInterface } from "@game/interface/GameInterface";
import { Player } from "@game/system/Player";
import { SkinDrone } from "../skins/enemies/Drone";
import { GameStats } from "../GameStats";
import { Enemy } from "../Enemy";
import { GameMap } from "@game/system/GameMap";

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

    public static FIRST_FIGHT: DialoguePiece[] = [
        {
            id: 0,
            textLines: ["Le drone ne fait pas attention à vous.", "Cependant, en vous approchant, son attitude change."],
            answers: [
                {
                    text: "Se préparer au combat !",
                    goto: -1,
                    onAnswer: () => {GameInterface.setCombat(new Combat(
                        [new Enemy('Mr. Test ALPHA', new SkinDrone('orange'), new GameStats(50))],
                        () => {
                            // on combat win
                            GameMap.removeGameObjectById('tuto_fight');
                        }))}
                }
            ]
        }];

}