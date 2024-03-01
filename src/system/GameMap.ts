import { Camera } from "./Camera";
import { GameObject } from "./GameObject";

export interface Coordinates {
    x: number;
    y: number;
}

export class GameMap extends GameObject {
    
    static MAX_BLOCK_WIDTH_VIEW = 10;
    static MAX_BLOCK_HEIGHT_VIEW = 30;
    static COLLISION_WALL = 1;
    static COLLISION_RESPAWN = 2;
    
    
    static MapInfo: number[][];
    static MapWidth: number;
    static MapHeight: number;
    static SpawnPoints: Coordinates[];
    

    public init() {
        GameMap.MapInfo = [];
        GameMap.SpawnPoints = [];
        const lines = mapRaw.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const cells = lines[i].split('\t');
            GameMap.MapWidth ? null : GameMap.MapWidth = cells.length;
            GameMap.MapInfo[i] = [];
            for (let j = 0; j < cells.length; j++) {
                GameMap.MapInfo[i][j] = parseInt(cells[j]);
                
                if (GameMap.MapInfo[i][j] == 2) {
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
        const startx = Math.max(Math.floor(Camera.offsetX / Camera.cellSize), 0);
        const starty = Math.max(Math.floor(Camera.offsetY / Camera.cellSize), 0);
        const lenx = Math.floor(this.canvas.width / Camera.cellSize);
        const leny = Math.floor(this.canvas.height / Camera.cellSize);
        for (let x = startx; x < Math.min(startx + lenx + 2, GameMap.MapWidth); x++) {
            for (let y = starty; y < Math.min(starty + leny + 2, GameMap.MapHeight); y++) {
                const cell = GameMap.MapInfo[y][x];

                if (cell == GameMap.COLLISION_WALL) {
                    this.ctx.fillStyle = 'blue';
                    this.ctx.fillRect(
                        Math.floor(x * Camera.cellSize - Camera.offsetX), 
                        Math.floor(y * Camera.cellSize - Camera.offsetY), 
                        Camera.cellSize, Camera.cellSize);
                }
                else if (cell == GameMap.COLLISION_RESPAWN) {
                    this.ctx.fillStyle = 'green';
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

    static getCollision(coordinates: Coordinates): number {
        return GameMap.MapInfo[coordinates.y][coordinates.x];
    }

}



/**
 * CSV tab separated
 */
const mapRaw = 
`1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1
1				1																																		1
1		2		1		1																																1
1				1																																		1
1				1							1																											1
1				1																																		1
1							1																															1
1																																						1
1																		1															1	1	1	1	1	1
1				1														1																				1
1		2		1														1												2								1
1				1												1	1	1	1	1																		1
1	1	1	1	1	1		1											1																				1
1																		1																				1
1																		1																				1
1																																						1
1																												1										1
1																													1					2				1
1																														1								1
1																															1							1
1																																1						1
1																																	1					1
1																																	1					1
1																																	1					1
1																																	1					1
1																																	1					1
1																																	1					1
1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1
`;