import { Graphics } from "@game/system/Graphics";
import { GameStats } from "./GameStats";
import { GameInterface } from "@game/interface/GameInterface";

export class Enemy {
    public name: string;
    public stats: GameStats;
    public skin: EnemySkin;

    constructor(name: string, skin: EnemySkin) {
        this.name = name;
        this.skin = skin;
        this.stats = new GameStats();
    }

    /**
     * Display enemy on x,y NON RELATIVE, top left
     * @param x 
     * @param y 
     * @param size
     */
    public display(x: number, y:number, size: number) {
        if (this.skin == EnemySkin.DRONE) {
            size = size/2; // drones are small
            Graphics.ctx.fillStyle = 'red';
            Graphics.ctx.save();
            Graphics.ctx.translate(x + size/2 , y + size/2);
            Graphics.ctx.rotate(GameInterface.frame * 0.02);
            Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
            Graphics.ctx.rotate(-GameInterface.frame*2 * 0.015);
            Graphics.ctx.fillRect( - size/2 , -size/2, size, size);
            Graphics.ctx.restore();
        }
    }
}

export enum EnemySkin {
    DRONE = 1,
}