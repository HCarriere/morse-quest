import { GameMap } from "./GameMap";

export class Game {

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private gameMap: GameMap;

    constructor(canvasid = 'morsequest') {
        this.initCanvas(canvasid);


        this.loop();
    }

    private initCanvas(canvasid: string) {
        this.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
        
        if (!this.canvas) {
            console.log('canvas no found');
            return;
        }

        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            console.log('2d context setup error');
            return;
        }

        this.gameMap = new GameMap(this.ctx, this.canvas);
    }

    private loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.gameMap.display();

        requestAnimationFrame(() => {this.loop();});
    }
}

