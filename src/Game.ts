import { GameInterface } from "./interface/GameInterface";
import { Camera } from "./system/Camera";
import { Controller } from "./system/Controller";
import { GameMap } from "./system/GameMap";
import { GameObject } from "./system/GameObject";
import { Graphics } from "./system/Graphics";
import { Player } from "./system/Player";

export class Game {

    private gameMap: GameMap;
    private player: Player;
    private camera: Camera;
    private gameInterface: GameInterface;

    private gameObjects: GameObject[];

    private fpsLastCallTime: number;
    private fpsLastMeasures: number[] = [];
    private enableDebug = false;

    constructor(canvasid = 'morsequest') {
        this.initCanvas(canvasid);

        this.loop();
    }

    private initCanvas(canvasid: string) {
        Graphics.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
        
        if (!Graphics.canvas) {
            console.log('canvas no found');
            return;
        }

        window.addEventListener('resize', () => { this.resize(); }, false);
        window.addEventListener('keydown', (e) => {this.keyPressed(e); });
        window.addEventListener('mousemove', (e) => {this.mouseMove(e)})
        Graphics.canvas.addEventListener('mousedown', (e) => {this.mousePressed(e); });


        Graphics.ctx = Graphics.canvas.getContext("2d");
        if (!Graphics.ctx) {
            console.log('2d context setup error');
            return;
        }

        this.gameObjects = [];

        this.gameMap = new GameMap();
        this.player = new Player();
        this.camera = new Camera();
        this.gameInterface = new GameInterface();

        this.gameObjects.push(this.gameMap);
        this.gameObjects.push(this.player);
        this.gameObjects.push(this.camera);
        this.gameObjects.push(this.gameInterface);
        
        Player.teleport(GameMap.getRandomSpawnPoint());

        this.resize();

        Camera.snap();
    }

    private loop() {
        Graphics.ctx.clearRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
        // background test
        Graphics.ctx.fillStyle = '#111';
        Graphics.ctx.fillRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
        
        for (const obj of this.gameObjects) {
            obj.display();
        }

        if (this.enableDebug) {
            this.writeDebug();
        }

        requestAnimationFrame(() => {this.loop();});
    }

    private resize() {
        Graphics.canvas.width = Graphics.canvas.parentElement.clientWidth;
        Graphics.canvas.height = Graphics.canvas.parentElement.clientHeight;
        for (const obj of this.gameObjects) {
            obj.resize();
        }
    }

    private keyPressed(e: KeyboardEvent) {
        if (e.key == '²') {
            this.enableDebug = !this.enableDebug;
        }
        for (const obj of this.gameObjects) {
            obj.keyPressed(Controller.KeyMapping[e.key]);
        }
    }

    private mousePressed(e: MouseEvent) {
        const rect = Graphics.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (const obj of this.gameObjects) {
            // obj.mousePressed(e.offsetX, e.offsetY);
            obj.mousePressed(x, y);
        }
    }

    private mouseMove(e: MouseEvent) {
        const rect = Graphics.canvas.getBoundingClientRect();
        Controller.mouseX = e.clientX - rect.left;
        Controller.mouseY = e.clientY - rect.top;
    }

    private writeDebug() {
        if (!this.fpsLastCallTime) {
            this.fpsLastCallTime = performance.now();
        }
        const delta = (performance.now() - this.fpsLastCallTime);
        this.fpsLastCallTime = performance.now();
        const fps = Math.floor(1000 / delta);
        this.fpsLastMeasures.push(fps);
        if (this.fpsLastMeasures.length > 200) this.fpsLastMeasures.shift();

        Graphics.ctx.save();
        Graphics.ctx.translate(5, 5);
        Graphics.ctx.font = '11px Arial';
        Graphics.ctx.fillStyle = 'green';
        Graphics.ctx.textAlign = 'left'
        Graphics.ctx.textBaseline = 'top';
        Graphics.ctx.fillText('offsetX: ' + Camera.offsetX, 0, 15);
        Graphics.ctx.fillText('offsetY: ' + Camera.offsetY, 0, 30);
        Graphics.ctx.fillText('playerX: ' + Player.x, 0, 45);
        Graphics.ctx.fillText('playerY: ' + Player.y, 0, 60);

        Graphics.ctx.fillText('mouseX: ' + Controller.mouseX, 80, 15);
        Graphics.ctx.fillText('mouseY: ' + Controller.mouseY, 80, 30);
        Graphics.ctx.fillText('mouseTileX: ' + Controller.mouseTileX, 80, 45);
        Graphics.ctx.fillText('mouseTileY: ' + Controller.mouseTileY, 80, 60);

        Graphics.ctx.fillText('movements frozen: ' + GameInterface.freezeControls, 170, 15);
        Graphics.ctx.fillText('player dam reduc: ' + Player.stats.flatDamageReductor, 170, 30);
        
        Graphics.ctx.fillText('FPS : ' + fps, 0, 2);
        Graphics.ctx.strokeStyle = 'green';
        Graphics.ctx.lineWidth = 1;
        for (let i = 0; i<this.fpsLastMeasures.length - 1; i++) {
            Graphics.ctx.beginPath();
            Graphics.ctx.moveTo(60+i * 3, 70 - this.fpsLastMeasures[i]);
            Graphics.ctx.lineTo(60+(i+1) * 3, 70 - this.fpsLastMeasures[i+1]);
            Graphics.ctx.stroke();
        }

        Graphics.ctx.restore();
    }
}

