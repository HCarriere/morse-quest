import { GameObject } from "./GameObject";

export class GameMap extends GameObject {
    
    public cameraOffsetX = 0;
    public cameraOffsetY = 0;
    
    static MAX_BLOCK_WIDTH_VIEW = 12;
    static MAX_BLOCK_HEIGHT_VIEW = 12;

    private mapInfo: number[][];
    private cellSize = 16;

    public init() {
        this.mapInfo = [];
        const lines = mapRaw.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const cells = lines[i].split('\t');
            this.mapInfo[i] = [];
            for (let j = 0; j < cells.length; j++) {
                this.mapInfo[i][j] = parseInt(cells[j]);
            }
        }
    }

    public display() {
        // display N block 
        for (let i = Math.floor(this.cameraOffsetX / this.cellSize); i < Math.floor(this.cameraOffsetX / this.cellSize) + GameMap.MAX_BLOCK_WIDTH_VIEW; i++) {
            for (let j = Math.floor(this.cameraOffsetY / this.cellSize); j < Math.floor(this.cameraOffsetY / this.cellSize) + GameMap.MAX_BLOCK_HEIGHT_VIEW; j++) {
                const cell = this.mapInfo[i][j];
                if (cell >= 1) {
                    this.ctx.fillStyle = 'blue';
                    this.ctx.fillRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
                }
            }
        }

        this.cameraOffsetX ++;
        this.cameraOffsetY ++;
    }

    public resize() {
        this.cellSize = this.canvas.width / GameMap.MAX_BLOCK_WIDTH_VIEW;
    }

}

const mapRaw = 
`1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1
1																																						1
1						2																																1
1																																						1
1											2																											1
1																																						1
1		2					2																															1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1							2																															1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1																																						1
1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1	1
`;