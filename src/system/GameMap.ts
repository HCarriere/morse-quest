import { Biome, Maps } from "@game/content/Maps";
import { Camera } from "./Camera";
import { GameObject } from "./GameObject";
import { Graphics, ObjectSkin } from "./Graphics";
import { GameEncounter, GameEvents } from "@game/content/GameEvents";

export interface Coordinates {
    x: number;
    y: number;
}

export interface MapInfo {
    objects?: Map<number, MapObject>;
    raw: string;

    encounterLevel?: number;
    biome?: Biome;
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
    randomEncounter?: boolean;
}

export class GameMap extends GameObject {
    
    static MAX_BLOCK_WIDTH_VIEW = 30;
    static MAX_BLOCK_HEIGHT_VIEW = 30;

    static MapTiles: number[][];
    static MapWidth: number;
    static MapHeight: number;
    static SpawnPoints: Coordinates[];
    static Encounters: Map<string, GameEncounter>;

    private static currentMapInfo: MapInfo;

    
    public init() {
        // 1st map to be loaded
        GameMap.loadMap('tuto');
    }

    public static loadMap(mapId: string) {
        console.log(`loading map <${mapId}>`)
        GameMap.MapTiles = [];
        GameMap.SpawnPoints = [];
        GameMap.MapWidth = 0;
        GameMap.MapHeight = 0;
        GameMap.currentMapInfo = null;
        GameMap.Encounters = new Map<string, GameEncounter>();
        
        if (!Maps.MapIDS[mapId]) {
            console.log(`can't find map <${mapId}>, loading <main>`);
            mapId = 'main';
        }

        GameMap.currentMapInfo = Maps.MapIDS[mapId];

        const lines = GameMap.currentMapInfo.raw.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const cells = lines[i].split('\t');
            GameMap.MapWidth >= cells.length ? null : GameMap.MapWidth = cells.length;
            GameMap.MapTiles[i] = [];
            for (let j = 0; j < cells.length; j++) {
                GameMap.MapTiles[i][j] = parseInt(cells[j]);
                
                // spawn point
                if (GameMap.getTileSetting(GameMap.MapTiles[i][j]).respawn) {
                    GameMap.SpawnPoints.push({x: j, y: i});
                }
                // encounter
                if (GameMap.getTileSetting(GameMap.MapTiles[i][j]).randomEncounter) {
                    const encounter = GameEvents.generateMapEncounters(GameMap.currentMapInfo);
                    if (encounter) {
                        GameMap.Encounters.set(`${j}:${i}`, encounter);
                    }
                }
            }
        }
        GameMap.MapHeight = lines.length;
        console.log(`${GameMap.MapWidth} x ${GameMap.MapHeight} map loaded`);
        console.log('spawn points', GameMap.SpawnPoints);
    }

    public display() {
        if (!GameMap.MapTiles) return;

        const startx = Math.max(Math.floor(Camera.offsetX / Camera.cellSize), 0);
        const starty = Math.max(Math.floor(Camera.offsetY / Camera.cellSize), 0);
        const lenx = Math.floor(Graphics.canvas.width / Camera.cellSize);
        const leny = Math.floor(Graphics.canvas.height / Camera.cellSize);

        for (let x = startx; x < Math.min(startx + lenx + 2, GameMap.MapWidth); x++) {
            for (let y = starty; y < Math.min(starty + leny + 2, GameMap.MapHeight); y++) {

                const tile = GameMap.getCollision({x, y});
                if (tile) Graphics.displayTile(tile, x, y);

                const obj = GameMap.getMapObject({x, y});
                if (obj) Graphics.displayObject(obj, x, y);
            }
        }
    }

    public getRandomSpawnPoint(): Coordinates {
        if (!GameMap.SpawnPoints) return null;
        const rand = Math.floor(Math.random() * GameMap.SpawnPoints.length);
        return GameMap.SpawnPoints[rand];
    }

    private static getTileSetting(id: number): TileSettings {
        if (Maps.TilesInfo.has(id)) {
            return Maps.TilesInfo.get(id);
        }
        return {};
    }

    public static getCollision(coordinates: Coordinates): TileSettings {
        if (coordinates.x >= 0 && coordinates.y >= 0) {
            return GameMap.getTileSetting(GameMap.MapTiles[coordinates.y][coordinates.x]);
        }
    }

    public static getMapObject(coordinates: Coordinates): MapObject {
        const n = GameMap.MapTiles[coordinates.y][coordinates.x];
        if (n <= 1 || !GameMap.currentMapInfo.objects) return;
        if (GameMap.currentMapInfo.objects.has(n)) {
            return GameMap.currentMapInfo.objects.get(n);
        }
        return null;
    }

}
