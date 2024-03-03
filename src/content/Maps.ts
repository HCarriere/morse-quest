import { GameInterface } from "@game/interface/GameInterface";
import { Player } from "@game/system/Player";
import { ObjectSkin, SkinType } from "@game/system/Graphics";
import { DialoguesTuto } from "./dialogues/DialoguesTuto";

export interface MapInfo {
    objects?: Map<number, MapObject>;
    raw: string;
}

export interface MapObject {
    skin?: ObjectSkin;
    onWalk: () => void;
}

export interface TileSettings {
    visible?: boolean;
    color?: string;
    solid?: boolean;

    respawn?: boolean;
}

export class Maps {

    public static TilesInfo = new Map<number, TileSettings>([
        // tiles
        [1, {solid: true, visible: true, color: '#010289'}],
        [11, {solid: true, visible: true, color: '#0102CC'}],
        // events & flags
        [2, {respawn: true}],
    ]);

    private static MAP_MAIN: MapInfo = {
        objects: new Map<number, MapObject>([
            [901, {
                onWalk: () => {Player.teleport({x:5, y: 5}, 'tuto')},
                skin: {type: SkinType.Portal, primaryColor: 'white', secondaryColor: 'blue'}
            }]
        ]),
        raw: 
        `1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1		1	1	1	1	1	1	1		1	1	1	1	1	1	1	1	1	1	1
        1	2			1																																		1
        1		1		1		1																																1
        1				1																																		1
        1											1																											1
        1					901																																	1
        1								1							1	1	1	1	1	1																		1
        1                               11                                                 1																		
        1														1	1			1		1													1	1	1	1	1	1
        1				1									1					1		1																		1
        1				1									1				1			1																		1
        1				1									1		1	1	1		1	1	1																	1
        1	1	1	1	1	1		1						1				1		1																			1
        1														1			1	1	1																			1
        1															1			1																				1
        1																1																						1
        1																												1										1
        1																													1									1
        1																														1								1
        1																															1							1
        1																																1						1
        1																																	1					1
        1																																	1					1
        1																																	1					1
        1																																	1					1
        1																																	1					1
        1																																	1					1
        1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1		1	1		1	1	1	1`
    };

    private static MAP_TUTO: MapInfo = {
        objects: new Map<number, MapObject>([
            [900, {
                onWalk: () => {GameInterface.getInstance().addDialogue(DialoguesTuto.INTRODUCTION)},
                skin: {type: SkinType.AttentionMark, primaryColor: 'red', secondaryColor: 'yellow'}
            }],
            [901, {
                onWalk: () => {Player.teleport({x:5, y: 5}, 'main')},
                skin: {type: SkinType.Portal, primaryColor: 'white', secondaryColor: 'blue'}
            }]
        ]), 
        raw:
        `1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1								
        1	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	1								
        1																										1								
        1																										1	1	1	1	1	1	1	1	1
        1																						901				11	11	11	11	11	11	11	11	11
        1																																		
        1			2																900											901				1
        1																																		
        1																						901				1	1	1	1	1	1	1	1   1
        1												900														1								
        1																										1								
        1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1								`
    };

    public static MapIDS = {
        'main': this.MAP_MAIN,
        'tuto': this.MAP_TUTO,
    };
}