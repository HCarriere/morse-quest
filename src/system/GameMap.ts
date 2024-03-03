import { MapInfo, MapObject, Maps, TileSettings } from "@game/content/Maps";
import { Camera } from "./Camera";
import { GameObject } from "./GameObject";

export interface Coordinates {
    x: number;
    y: number;
}

export class GameMap extends GameObject {
    
    static MAX_BLOCK_WIDTH_VIEW = 30;
    static MAX_BLOCK_HEIGHT_VIEW = 30;

    // Map Values
    
    
    private static currentMapInfo: MapInfo;

    static MapTiles: number[][];
    static MapWidth: number;
    static MapHeight: number;
    static SpawnPoints: Coordinates[];

    public init() {
        GameMap.loadMap('tuto');
    }

    public static loadMap(mapId: string) {
        console.log(`loading map <${mapId}>`)
        GameMap.MapTiles = [];
        GameMap.SpawnPoints = [];
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
                
                if (GameMap.getTileSetting(GameMap.MapTiles[i][j]).respawn) {
                    // spawn
                    GameMap.SpawnPoints.push({x: j, y: i});
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
        const lenx = Math.floor(this.canvas.width / Camera.cellSize);
        const leny = Math.floor(this.canvas.height / Camera.cellSize);
        for (let x = startx; x < Math.min(startx + lenx + 2, GameMap.MapWidth); x++) {
            for (let y = starty; y < Math.min(starty + leny + 2, GameMap.MapHeight); y++) {

                const tile = GameMap.getCollision({x, y});

                if (tile.visible && tile.color) {
                    this.ctx.fillStyle = tile.color;
                    this.ctx.fillRect(
                        Math.floor(x * Camera.cellSize - Camera.offsetX), 
                        Math.floor(y * Camera.cellSize - Camera.offsetY), 
                        Camera.cellSize, Camera.cellSize);
                }
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
        return GameMap.getTileSetting(GameMap.MapTiles[coordinates.y][coordinates.x]);
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
