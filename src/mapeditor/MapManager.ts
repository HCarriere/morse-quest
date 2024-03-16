import { RawMaps } from "@game/content/RawMaps";
import { ServerApi } from "./ServerApi";

export class MapManager {
    private static _currentMapId: string;
    public static get currentMapId(): string { return this._currentMapId; }
    private static mapList: string[] = Object.keys(RawMaps);

    static MapTiles: number[][];
    static MapWidth: number;
    static MapHeight: number;

    private static loadListeners: (() => void)[] = [];

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
        for (let j = 0; j < lines.length; j++) {
            const cells = lines[j].split('\t');
            if (MapManager.MapWidth < cells.length) MapManager.MapWidth = cells.length;
            MapManager.MapTiles[j] = [];
            for (let i = 0; i < cells.length; i++) {
                MapManager.MapTiles[j][i] = parseInt(cells[i]);
            }
        }
        MapManager.MapHeight = lines.length;
        console.log(`${MapManager.MapWidth} x ${MapManager.MapHeight} map loaded`);
        this.loadListeners.forEach(listener => listener());
    }

    public static saveMap(): void {
        RawMaps[this.currentMapId] = MapManager.MapTiles.reduce((lines, newLine) => !lines ? this.serializeLine(newLine) : `${lines}\n${this.serializeLine(newLine)}`, '');
        ServerApi.saveRawMaps(RawMaps);
    }

    private static serializeLine(line: number[]): string { return line.reduce((cells, newCell, index) => index > 0 ? `${cells}\t${this.serializeCell(newCell)}` : this.serializeCell(newCell), ''); }
    private static serializeCell(cell: number): string { return isNaN(cell) ? '' : `${cell}`; }

    public static addNewMap(mapId): void {
        this.mapList.push(mapId);
        RawMaps[mapId] = '';
    }

    public static getMapList(): string[] {
        return this.mapList;
    }

    public static mapExists(mapId): boolean {
        return this.mapList.includes(mapId);
    }

    public static addLoadListener(listener: () => void): void {
        this.loadListeners.push(listener);
    }
}