import { Graphics } from "./Graphics";
import { EngineController } from "./EngineController";
import { EngineObject } from "./EngineObject";
import { Modale } from "./Modale";

export abstract class Engine {

    protected engineObjects: EngineObject[];

    constructor(canvasid) {
        if (!this.initCanvas(canvasid)) return;

        this.loop();
    }

    protected initCanvas(canvasid: string): boolean {
        Graphics.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
        
        if (!Graphics.canvas) {
            console.log('canvas no found');
            return false;
        }

        window.addEventListener('resize', () => { this.resize(); }, false);
        window.addEventListener('keydown', (e) => {this.keyPressed(e); });
        window.addEventListener('mousemove', (e) => {this.mouseMove(e)})
        Graphics.canvas.addEventListener('mousedown', (e) => {this.mousePressed(e); });


        Graphics.ctx = Graphics.canvas.getContext("2d");
        if (!Graphics.ctx) {
            console.log('2d context setup error');
            return false;
        }
        Graphics.canvas.width = Graphics.canvas.parentElement.clientWidth;
        Graphics.canvas.height = Graphics.canvas.parentElement.clientHeight;

        this.engineObjects = [];

        return true;
    }

    private loop() {
        Graphics.ctx.clearRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
        // background test
        Graphics.ctx.fillStyle = '#111';
        Graphics.ctx.fillRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
        
        for (const obj of this.engineObjects) {
            obj.display();
        }

        if (Modale.showModale) {
            Modale.content.display();
        }
        
        this.onLoop();

        requestAnimationFrame(() => {this.loop();});
    }

    protected abstract onLoop(): void;

    protected resize() {
        Graphics.canvas.width = Graphics.canvas.parentElement.clientWidth;
        Graphics.canvas.height = Graphics.canvas.parentElement.clientHeight;
        for (const obj of this.engineObjects) {
            obj.resize();
        }
        if (Modale.showModale) {
            Modale.content.resize();
        }
    }

    protected keyPressed(e: KeyboardEvent) {
        if (Modale.showModale) {
            Modale.content.keyPressed(EngineController.KeyMapping[e.key]);
            Modale.content.originalKeyPressed(e.key);
            return;
        }
        for (const obj of this.engineObjects) {
            obj.keyPressed(EngineController.KeyMapping[e.key]);
            obj.originalKeyPressed(e.key);
        }
    }

    protected mousePressed(e: MouseEvent) {
        const rect = Graphics.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (Modale.showModale) {
            Modale.content.mousePressed(x, y);
            return;
        }
        for (const obj of this.engineObjects) {
            obj.mousePressed(x, y);
        }
    }

    protected mouseMove(e: MouseEvent) {
        const rect = Graphics.canvas.getBoundingClientRect();
        EngineController.mouseX = e.clientX - rect.left;
        EngineController.mouseY = e.clientY - rect.top;
    }
}

