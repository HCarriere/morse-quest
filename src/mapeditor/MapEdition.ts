import { RawMaps } from "@game/content/RawMaps";

export class MapEdition {
    private static currentMapId: string;
    
    static MAX_BLOCK_WIDTH_VIEW = 30;
    static MAX_BLOCK_HEIGHT_VIEW = 30;

    static MapTiles: number[][];
    static MapWidth: number;
    static MapHeight: number;

    public static loadMap(mapId: string) {
        console.log(`loading map <${mapId}>`)
        MapEdition.MapTiles = [];
        MapEdition.MapWidth = 0;
        MapEdition.MapHeight = 0;
        
        if (!Object.keys(RawMaps).includes(mapId)) {
            console.log(`can't find map <${mapId}>, loading <main>`);
            mapId = 'main';
        }

        this.currentMapId = mapId;
        const lines = RawMaps[mapId].split('\n');
        for (let i = 0; i < lines.length; i++) {
            const cells = lines[i].split('\t');
            MapEdition.MapWidth >= cells.length ? null : MapEdition.MapWidth = cells.length;
            MapEdition.MapTiles[i] = [];
            for (let j = 0; j < cells.length; j++) {
                MapEdition.MapTiles[i][j] = parseInt(cells[j]);
            }
        }
        MapEdition.MapHeight = lines.length;
        console.log(`${MapEdition.MapWidth} x ${MapEdition.MapHeight} map loaded`);
    }
}