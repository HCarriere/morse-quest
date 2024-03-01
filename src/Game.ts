import { Camera } from "./system/Camera";
import { Controller } from "./system/Controller";
import { GameMap } from "./system/GameMap";
import { GameObject } from "./system/GameObject";
import { Player } from "./system/Player";

export class Game {

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private gameMap: GameMap;
    private player: Player;
    private camera: Camera;

    private gameObjects: GameObject[];

    constructor(canvasid = 'morsequest') {
        this.initCanvas(canvasid);
        window.addEventListener('keydown', (e) => {this.keyPressed(e); });
        this.loop();
    }

    private initCanvas(canvasid: string) {
        this.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
        
        if (!this.canvas) {
            console.log('canvas no found');
            return;
        }

        window.onresize = () => { this.resize(); };

        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            console.log('2d context setup error');
            return;
        }

        this.gameObjects = [];

        this.gameMap = new GameMap(this.ctx, this.canvas);
        this.player = new Player(this.ctx, this.canvas);
        this.camera = new Camera(this.ctx, this.canvas);

        this.gameObjects.push(this.gameMap);
        this.gameObjects.push(this.player);
        this.gameObjects.push(this.camera);
        
        this.player.teleport(this.gameMap.getRandomSpawnPoint());

        this.resize();

        this.camera.snap();
    }

    private loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'lightgrey';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const go of this.gameObjects) {
            go.display();
        }

        requestAnimationFrame(() => {this.loop();});
    }

    private resize() {
        console.log('resize event');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        for (const go of this.gameObjects) {
            go.resize();
        }
    }

    private keyPressed(e: KeyboardEvent) {
        for (const go of this.gameObjects) {
            go.keyPressed(Controller.KeyMapping[e.key]);
        }
    }
}

