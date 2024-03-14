import { RawMaps } from "@game/content/RawMaps";

export class MapManager {
    private static _currentMapId: string;
    public static get currentMapId(): string { return this._currentMapId; }
    private static mapList: string[] = Object.keys(RawMaps);
    
    static MAX_BLOCK_WIDTH_VIEW = 30;
    static MAX_BLOCK_HEIGHT_VIEW = 30;

    static MapTiles: number[][];
    static MapWidth: number;
    static MapHeight: number;

    public static loadMap(mapId: string) {
        console.log(`loading map <${mapId}>`)
        MapManager.MapTiles = [];
        MapManager.MapWidth = 0;
        MapManager.MapHeight = 0;
        
        if (!this.mapList.includes(mapId)) {
            console.log(`can't find map <${mapId}>, loading <main>`);
            mapId = 'main';
        }

        this._currentMapId = mapId;
        const lines = RawMaps[mapId].split('\n');
        for (let i = 0; i < lines.length; i++) {
            const cells = lines[i].split('\t');
            MapManager.MapWidth >= cells.length ? null : MapManager.MapWidth = cells.length;
            MapManager.MapTiles[i] = [];
            for (let j = 0; j < cells.length; j++) {
                MapManager.MapTiles[i][j] = parseInt(cells[j]);
            }
        }
        MapManager.MapHeight = lines.length;
        console.log(`${MapManager.MapWidth} x ${MapManager.MapHeight} map loaded`);
    }

    public static addNewMap(mapId): void {
        this.mapList.push(mapId);
        RawMaps[mapId] = '';
    }

    public static getMapList(): string[] {
        return this.mapList;
    }
}