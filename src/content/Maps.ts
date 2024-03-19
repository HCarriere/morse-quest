import { GameInterface } from "@game/interface/GameInterface";
import { Player } from "@game/system/Player";
import { DialoguesTuto } from "./dialogues/DialoguesTuto";
import { GameMap, MapInfo, MapObject, TileSettings } from "@game/system/GameMap";
import { Combat } from "@game/interface/Combat";
import { Enemy } from "./Enemy";
import { GameStats } from "./GameStats";
import { SkinDrone } from "./skins/enemies/Drone";
import { RawMaps } from "./RawMaps";
import { SkinInfo } from "./skins/objects/Info";
import { SkinPortal } from "./skins/objects/Portal";
import { SkinLock } from "./skins/objects/Lock";
import { SpellNPCAttack } from "./spells/library/NPCAttack";
import { SpellCreateShield } from "./spells/library/CreateShield";
import { GameGraphics } from "@game/system/GameGraphics";
import { Camera } from "@game/system/Camera";


/**
 * - Tiles are for decoration, flags, generic events
 * - Map Objects are for specific and scripted events
 */
export class Maps {

    /**
     * Generic tiles descriptions
     */
    public static TilesInfo = new Map<number, TileSettings>([
        // tiles
        [1, {solid: true, visible: true, color: '#666'}],
        [11, {solid: true, visible: true, color: '#777'}],
        // events & flags
        [2, {respawn: true}],
    ]);

    private static MAP_MAIN: MapInfo = {
        objects: new Map<number, MapObject>([
            [901, {
                onWalk: () => {Player.teleport(null, 'tuto')},
                skin: new SkinPortal()
            }],
            [900, {
                onWalk: () => {GameInterface.addDialogue(DialoguesTuto.INTRODUCTION)},
                skin: new SkinInfo()
            }],
            [902, {
                onWalk: () => {GameInterface.setCombat(new Combat(
                    [new Enemy('Mr. Test #1', new SkinDrone(), new GameStats([new SpellNPCAttack(15)])),
                    new Enemy('Mr. Test #2', new SkinDrone(), new GameStats([new SpellNPCAttack(15)])),
                    new Enemy('Mr. Test ALPHA', new SkinDrone('purple'), new GameStats([new SpellNPCAttack(15)], 120)),
                    new Enemy('Mr. Test #3', new SkinDrone(), new GameStats([new SpellNPCAttack(15)])),
                    new Enemy('Mr. Test #4', new SkinDrone(), new GameStats([new SpellNPCAttack(15)]))]))},
                skin: new SkinDrone()
            }]
        ]),
        raw: RawMaps.main
    };

    private static MAP_TUTO: MapInfo = {
        objects: new Map<number, MapObject>([
            [800, {
                id: 'tuto_wall',
                skin: new SkinLock(),
                solid: true,
                onDelete: (o) => {
                    GameGraphics.addTerrainParticle({
                        life: 200,
                        size: Camera.cellSize/2,
                        color: "grey",
                        x: o.x * Camera.cellSize - Camera.offsetX,
                        y: o.y * Camera.cellSize - Camera.offsetY,
                        vx: Math.random()-0.5,
                        vy: Math.random()-0.5,
                        friction: 1,
                        sizeLosePerFrame: 0.5,
                    });
                },
            }],
            [900, {
                onWalk: () => {GameInterface.addDialogue(DialoguesTuto.INTRODUCTION)},
                skin: new SkinInfo(),
            }],
            [901, {
                onWalk: () => {Player.teleport(null, 'main')},
                skin: new SkinPortal(),
            }],
            [902, {
                id: 'tuto_fight',
                onWalk: () => {GameInterface.addDialogue(DialoguesTuto.FIRST_FIGHT)},
                skin: new SkinDrone('orange'),
            }],
            [903, {
                id: 'tuto_fight2',
                onWalk: () => {GameInterface.setCombat(new Combat(
                    [new Enemy('Mr. Test #1', new SkinDrone(), new GameStats([new SpellNPCAttack(15), new SpellCreateShield(15)])),
                    new Enemy('Mr. Test #1', new SkinDrone(), new GameStats([new SpellNPCAttack(15), new SpellCreateShield(15)]))], () => {
                        GameMap.removeGameObjectById('tuto_fight2');
                    }))},
                skin: new SkinDrone('orange'),
            }]
        ]), 
        raw: RawMaps.tuto
    };

    public static MapIDS = {
        'main': this.MAP_MAIN,
        'tuto': this.MAP_TUTO,
    };
}
