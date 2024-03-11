import { EngineGraphics } from "./EngineGraphics";
import { EngineController } from "./EngineController";
import { EngineObject } from "./EngineObject";

export abstract class Engine {

    protected engineObjects: EngineObject[];

    constructor(canvasid) {
        if (!this.initCanvas(canvasid)) return;

        this.loop();
    }

    protected initCanvas(canvasid: string): boolean {
        EngineGraphics.canvas = document.getElementById(canvasid) as HTMLCanvasElement;
        
        if (!EngineGraphics.canvas) {
            console.log('canvas no found');
            return false;
        }

        window.addEventListener('resize', () => { this.resize(); }, false);
        window.addEventListener('keydown', (e) => {this.keyPressed(e); });
        window.addEventListener('mousemove', (e) => {this.mouseMove(e)})
        EngineGraphics.canvas.addEventListener('mousedown', (e) => {this.mousePressed(e); });


        EngineGraphics.ctx = EngineGraphics.canvas.getContext("2d");
        if (!EngineGraphics.ctx) {
            console.log('2d context setup error');
            return false;
        }

        this.engineObjects = [];

        return true;
    }

    private loop() {
        EngineGraphics.ctx.clearRect(0, 0, EngineGraphics.canvas.width, EngineGraphics.canvas.height);
        // background test
        EngineGraphics.ctx.fillStyle = '#111';
        EngineGraphics.ctx.fillRect(0, 0, EngineGraphics.canvas.width, EngineGraphics.canvas.height);
        
        for (const obj of this.engineObjects) {
            obj.display();
        }
        
        this.onLoop();

        requestAnimationFrame(() => {this.loop();});
    }

    protected abstract onLoop(): void;

    protected resize() {
        EngineGraphics.canvas.width = EngineGraphics.canvas.parentElement.clientWidth;
        EngineGraphics.canvas.height = EngineGraphics.canvas.parentElement.clientHeight;
        for (const obj of this.engineObjects) {
            obj.resize();
        }
    }

    protected keyPressed(e: KeyboardEvent) {
        for (const obj of this.engineObjects) {
            obj.keyPressed(EngineController.KeyMapping[e.key]);
        }
    }

    protected mousePressed(e: MouseEvent) {
        const rect = EngineGraphics.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        for (const obj of this.engineObjects) {
            // obj.mousePressed(e.offsetX, e.offsetY);
            obj.mousePressed(x, y);
        }
    }

    protected mouseMove(e: MouseEvent) {
        const rect = EngineGraphics.canvas.getBoundingClientRect();
        EngineController.mouseX = e.clientX - rect.left;
        EngineController.mouseY = e.clientY - rect.top;
    }
}

