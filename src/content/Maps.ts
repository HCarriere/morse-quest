import { GameInterface } from "@game/interface/GameInterface";
import { Player } from "@game/system/Player";
import { SkinType } from "@game/system/Graphics";
import { DialoguesTuto } from "./dialogues/DialoguesTuto";
import { MapInfo, MapObject, TileSettings } from "@game/system/GameMap";
import { Combat } from "@game/interface/Combat";
import { Enemy, EnemySkin } from "./Enemy";


export enum Biome {
    Normal = 0,
}

/**
 * - Tiles are for decoration, flags, generic events
 * - Map Objects are for specific and scripted events
 */
export class Maps {

    public static TilesInfo = new Map<number, TileSettings>([
        // tiles
        [1, {solid: true, visible: true, color: '#010289'}],
        [11, {solid: true, visible: true, color: '#0102CC'}],
        // events & flags
        [2, {respawn: true}],
        [21, {randomEncounter: true, visible: true, color: '#010203'}], // meant to be invisible
    ]);

    private static MAP_MAIN: MapInfo = {
        encounterLevel: 1,
        biome: Biome.Normal,
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
        1																																						1
        1					901							21		21			21			21																		1
        1								1																														1
        1                               11                                                 																		1
        1												21		21			21			21													1	1	1	1	1	1
        1				1																																		1
        1				1																																		1
        1				1								21		21			21			21																		1
        1	1	1	1	1	1		1																															1
        1																																						1
        1																																						1
        1																																						1
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
        1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1`
    };

    private static MAP_TUTO: MapInfo = {
        objects: new Map<number, MapObject>([
            [900, {
                onWalk: () => {GameInterface.addDialogue(DialoguesTuto.INTRODUCTION)},
                skin: {type: SkinType.AttentionMark, primaryColor: 'red', secondaryColor: 'yellow'}
            }],
            [901, {
                onWalk: () => {Player.teleport({x:5, y: 5}, 'main')},
                skin: {type: SkinType.Portal, primaryColor: 'white', secondaryColor: 'blue'}
            }],
            [902, {
                onWalk: () => {GameInterface.setCombat(new Combat([new Enemy('Mr. Test', EnemySkin.DRONE), new Enemy('Mr. Test #2', EnemySkin.DRONE)]))},
                skin: {type: SkinType.Portal, primaryColor: 'red', secondaryColor: '#550202'}
            }]
        ]), 
        raw:
        `1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1								
        1	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	1								
        1																										1								
        1																										1	1	1	1	1	1	1	1	1
        1					902																	901				11	11	11	11	11	11	11	11	11
        1																																		
        1		902	2																900											901				1
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