import { GameInterface } from "@game/interface/GameInterface";
import { Player } from "@game/system/Player";
import { SkinType } from "@game/system/Graphics";
import { DialoguesTuto } from "./dialogues/DialoguesTuto";
import { MapInfo, MapObject, TileSettings } from "@game/system/GameMap";
import { Combat } from "@game/interface/Combat";
import { Enemy } from "./Enemy";
import { GameStats } from "./GameStats";
import { SkinDrone } from "./skins/Drone";


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
                onWalk: () => {Player.teleport(null, 'tuto')},
                skin: {type: SkinType.Portal, primaryColor: 'white', secondaryColor: 'blue'}
            }],
            [900, {
                onWalk: () => {GameInterface.addDialogue(DialoguesTuto.INTRODUCTION)},
                skin: {type: SkinType.AttentionMark, primaryColor: 'red', secondaryColor: 'white'}
            }],
            [902, {
                onWalk: () => {GameInterface.setCombat(new Combat(
                    [new Enemy('Mr. Test #1', new SkinDrone(), new GameStats()),
                    new Enemy('Mr. Test #2', new SkinDrone(), new GameStats()),
                    new Enemy('Mr. Test ALPHA', new SkinDrone('purple'), new GameStats(10)),
                    new Enemy('Mr. Test #3', new SkinDrone(), new GameStats()),
                    new Enemy('Mr. Test #4', new SkinDrone(), new GameStats())]))},
                enemySkin: new SkinDrone()
            }]
        ]),
        raw: 
        `1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1
        1	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	1	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	1
        1																	1																					1
        1																	1																					1
        1																	11																					1
        1														21			21			21																		1
        1																																						1
        1																																						1
        1														21			21			21																		1
        1																																						1
        1																																						1
        1														21			21			21																		1
        1																												1	1	1	1	1						1
        1																	1											11	11	11	11	1						1
        1			901	2													1											902		900		1						1
        1																	1											1	1	1	1	1						1
        1																	1											11	11	11	11	11						1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1																	1																					1
        1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1`
    };

    private static MAP_TUTO: MapInfo = {
        objects: new Map<number, MapObject>([
            [900, {
                onWalk: () => {GameInterface.addDialogue(DialoguesTuto.INTRODUCTION)},
                skin: {type: SkinType.AttentionMark, primaryColor: 'red', secondaryColor: 'white'}
            }],
            [901, {
                onWalk: () => {Player.teleport(null, 'main')},
                skin: {type: SkinType.Portal, primaryColor: 'white', secondaryColor: 'blue'}
            }],
            [902, {
                onWalk: () => {GameInterface.setCombat(new Combat(
                    [new Enemy('Mr. Test ALPHA', new SkinDrone(), new GameStats()), 
                    new Enemy('Mr. Test #2', new SkinDrone(), new GameStats()),
                    new Enemy('Mr. Test #3', new SkinDrone(), new GameStats()),
                    new Enemy('Mr. Test #4', new SkinDrone(), new GameStats())].slice(Math.floor(Math.random() * 4))))},
                enemySkin: new SkinDrone()
            }]
        ]), 
        raw:
        `1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1								
        1	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	11	1								
        1																										1								
        1																										1	1	1	1	1	1	1	1	1
        1				900																						1	11	11	11	11	11	11	11	11
        1																										11								
        1			2						902																	902				901				1
        1																										1								
        1																										1	1	1	1	1	1	1	1   1
        1																										1								
        1																										1								
        1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1								`
    };

    public static MapIDS = {
        'main': this.MAP_MAIN,
        'tuto': this.MAP_TUTO,
    };
}