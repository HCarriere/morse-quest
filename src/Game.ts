import { GameInterface } from "./interface/GameInterface";
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
        
        this.loop();
    }

    private initCanvas(canvasid: string) {
        this.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
        
        if (!this.canvas) {
            console.log('canvas no found');
            return;
        }

        window.addEventListener('resize', () => { this.resize(); }, false);
        window.addEventListener('keydown', (e) => {this.keyPressed(e); });
        window.addEventListener('mousemove', (e) => {this.mouseMove(e)})
        this.canvas.addEventListener('mousedown', (e) => {this.mousePressed(e); });


        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            console.log('2d context setup error');
            return;
        }

        this.gameObjects = [];

        this.gameMap = new GameMap(this.ctx, this.canvas);
        this.player = new Player(this.ctx, this.canvas);
        this.camera = new Camera(this.ctx, this.canvas);

        GameInterface.setInstance(new GameInterface(this.ctx, this.canvas));

        this.gameObjects.push(this.gameMap);
        this.gameObjects.push(this.player);
        this.gameObjects.push(this.camera);
        this.gameObjects.push(GameInterface.getInstance());
        
        Player.teleport(this.gameMap.getRandomSpawnPoint());

        this.resize();

        this.camera.snap();
    }

    private loop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // background test
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const obj of this.gameObjects) {
            obj.display();
        }

        this.writeDebug();

        requestAnimationFrame(() => {this.loop();});
    }

    private resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        for (const obj of this.gameObjects) {
            obj.resize();
        }
    }

    private keyPressed(e: KeyboardEvent) {
        for (const obj of this.gameObjects) {
            obj.keyPressed(Controller.KeyMapping[e.key]);
        }
    }

    private mousePressed(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (const obj of this.gameObjects) {
            // obj.mousePressed(e.offsetX, e.offsetY);
            obj.mousePressed(x, y);
        }
    }

    private mouseMove(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        Controller.mouseX = e.clientX - rect.left;
        Controller.mouseY = e.clientY - rect.top;
    }

    private writeDebug() {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = 'grey';
        this.ctx.textAlign = 'left'
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('offsetX: ' + Camera.offsetX, 5, this.canvas.height - 80);
        this.ctx.fillText('offsetY: ' + Camera.offsetY, 5, this.canvas.height - 60);
        this.ctx.fillText('playerX: ' + Player.x, 5, this.canvas.height - 40);
        this.ctx.fillText('playerY: ' + Player.y, 5, this.canvas.height - 20);

        this.ctx.fillText('mouseX: ' + Controller.mouseX, 80, this.canvas.height - 80);
        this.ctx.fillText('mouseY: ' + Controller.mouseY, 80, this.canvas.height - 60);
        this.ctx.fillText('mouseTileX: ' + Controller.mouseTileX, 80, this.canvas.height - 40);
        this.ctx.fillText('mouseTileY: ' + Controller.mouseTileY, 80, this.canvas.height - 20);
    }
}

