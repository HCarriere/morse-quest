import { TileSettings } from "./GameMap";
import { GameInterface } from "@game/interface/GameInterface";

export class GameEvents {

    /**
     * Process anything that happens when the player cross this tile
     * @param event map tile number
     */
    public static processGameEvent(tile: TileSettings) {
        if (tile.debug == 'dialogue') {
            GameInterface.getInstance().addDialogue([{
                    id: 0,
                    textLines: ["Bonjour, jeune hero ! Process anything that happens when the player cross this tile", "Bordel."],
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
                }]
            )
        }
    }

}