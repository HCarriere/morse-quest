import { Biome, Maps } from "@game/content/Maps";
import { Camera } from "./Camera";
import { EngineObject } from "../core/EngineObject";
import { GameGraphics } from "./GameGraphics";
import { Skin } from "@game/content/skins/Skin";

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

/**
 * Displays an non-tile objects (enemies, traps, events, doors ...)
 */
export interface MapObject {
    /**
     * Used to identify unique mapobjects and act on them. 
     */
    id?: string;
    x?: number;
    y?: number;
    skin?: Skin;
    onWalk?: () => void;
    /**
     * If true, player can't cross this object
     */
    solid?: boolean;
}

export interface TileSettings {
    visible?: boolean;
    color?: string;
    solid?: boolean;

    respawn?: boolean;
    randomEncounter?: boolean;
}

export class GameMap extends EngineObject {
    
    static MAX_BLOCK_WIDTH_VIEW = 30;
    static MAX_BLOCK_HEIGHT_VIEW = 30;

    static MapTiles: number[][];
    static MapWidth: number;
    static MapHeight: number;
    static SpawnPoints: Coordinates[];
    static MapObjects: MapObject[];

    private static currentMapInfo: MapInfo;

    
    public init() {
        // 1st map to be loaded
        GameMap.loadMap('tuto');
    }

    public static loadMap(mapId: string) {
        console.log(`loading map <${mapId}>`)
        GameMap.MapTiles = [];
        GameMap.SpawnPoints = [];
        GameMap.MapObjects = [];
        GameMap.MapWidth = 0;
        GameMap.MapHeight = 0;
        GameMap.currentMapInfo = null;
        
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

                // map objects
                const mapObject = GameMap.getMapObjectFromRaw({x: j, y: i});
                if (mapObject) {
                    // init mapobject coordinates
                    const mo: MapObject = {
                        id: mapObject.id,
                        x: j,
                        y: i,
                        onWalk: mapObject.onWalk,
                        skin: mapObject.skin,
                        solid: mapObject.solid,
                    }
                    GameMap.MapObjects.push(mo);
                }
            }
        }
        GameMap.MapHeight = lines.length;
        console.log(`${GameMap.MapWidth} x ${GameMap.MapHeight} map loaded`);
        console.log('spawn points', GameMap.SpawnPoints);
        console.log('map objects', GameMap.MapObjects);
    }

    public display() {
        if (!GameMap.MapTiles) return;

        const startx = Math.max(Math.floor(Camera.offsetX / Camera.cellSize), 0);
        const starty = Math.max(Math.floor(Camera.offsetY / Camera.cellSize), 0);
        const lenx = Math.floor(GameGraphics.canvas.width / Camera.cellSize);
        const leny = Math.floor(GameGraphics.canvas.height / Camera.cellSize);

        for (let x = startx; x < Math.min(startx + lenx + 2, GameMap.MapWidth); x++) {
            for (let y = starty; y < Math.min(starty + leny + 2, GameMap.MapHeight); y++) {

                const tile = GameMap.getCollision({x, y});
                if (tile) GameGraphics.displayTile(tile, x, y);

                /*const obj = GameMap.getMapObject({x, y});
                */
            }
        }

        // display gameobjects
        for (const mo of GameMap.MapObjects) {
            
            // inside camera ?
            if (!Camera.isVisible({x: mo.x, y: mo.y})) continue;
            // display skin
            if (mo.skin) mo.skin.display(
                mo.x * Camera.cellSize - Camera.offsetX, 
                mo.y * Camera.cellSize - Camera.offsetY, 
                Camera.cellSize);
        }
    }

    public static getRandomSpawnPoint(): Coordinates {
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

    /**
     * Returns the first MapObject in this coordinate
     * @param coordinates 
     * @returns 
     */
    public static getMapObject(coordinates: Coordinates): MapObject {
        for (const mo of GameMap.MapObjects) {
            if (mo.x == coordinates.x && mo.y == coordinates.y) {
                return mo;
            }
        }
    }

    /**
     * Get a configured mapobject from raw coordinates.
     * @param coordinates 
     * @returns 
     */
    private static getMapObjectFromRaw(coordinates: Coordinates): MapObject {
        const n = GameMap.MapTiles[coordinates.y][coordinates.x];
        // not an object / invalid tile ID
        if (n <= 1 || !GameMap.currentMapInfo.objects) return;
        
        // this map has a definition for this ID
        if (GameMap.currentMapInfo.objects.has(n)) {
            return GameMap.currentMapInfo.objects.get(n);
        }
        return null;
    }

    /**
     * Remove all gameobjects sharing this id
     * @param id 
     * @returns 
     */
    public static removeGameObjectById(id: string) {
        for (let i=GameMap.MapObjects.length-1; i>=0; i--) {
            if (GameMap.MapObjects[i].id && GameMap.MapObjects[i].id == id) {
                GameMap.MapObjects.splice(i, 1);
            }
        }
    }

}
