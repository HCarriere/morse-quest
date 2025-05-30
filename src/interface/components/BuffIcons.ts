import { GameStats } from "@game/content/GameStats";
import { Buff } from "@game/content/buffs/Buff";
import { EngineObject } from "@game/core/EngineObject";
import { GameController } from "@game/system/GameController";
import { GameGraphics } from "@game/system/GameGraphics";

/**
 * Display all buffs & debuff icons for a single entity
 */
export class BuffIcons extends EngineObject {
    
    private static ICON_SIZE = 25;

    private x: number;
    private y: number;
    private stats: GameStats;
    private columns: number;

    private onHover: (buff: Buff) => void;

    constructor(
        x: number, y: number, stats: GameStats, 
        onHover: (buff: Buff) => void, columns = 7,
        ) {
        super();
        this.x = x;
        this.y = y;
        this.stats = stats;
        this.columns = columns;
        this.onHover = onHover;
    }

    public display() {
        let cx = 0;
        let cy = 0;
        for (const buff of this.stats.buffs) {
            let duration = buff.debuff ? buff.duration - 1 : buff.duration; // debuffs need +1 duration to account for the turn it is applied
            const x = this.x + cx * (BuffIcons.ICON_SIZE + 3);
            const y = this.y + cy * (BuffIcons.ICON_SIZE + 3);
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.strokeStyle = '#222';
            GameGraphics.displayIcon(buff.icon, x, y, BuffIcons.ICON_SIZE);
            // stacks
            GameGraphics.ctx.fillStyle = '#FFF';
            GameGraphics.ctx.font = `12px `+ GameGraphics.FONT;
            GameGraphics.ctx.textAlign = "right";
            GameGraphics.ctx.textBaseline = "bottom";
            GameGraphics.ctx.fillText(buff.stack+'', x + BuffIcons.ICON_SIZE, y + BuffIcons.ICON_SIZE);
            //duration
            GameGraphics.ctx.textAlign = "left";
            GameGraphics.ctx.textBaseline = "top";
            GameGraphics.ctx.fillText(duration+'', x, y);

            if (this.isInbound(GameController.mouseX, GameController.mouseY, x, y, BuffIcons.ICON_SIZE, BuffIcons.ICON_SIZE)) {
                // mouse on buff
                GameGraphics.ctx.strokeStyle = '#444';
                this.onHover(buff);
            }
            
            GameGraphics.ctx.strokeRect(x, y, BuffIcons.ICON_SIZE, BuffIcons.ICON_SIZE);
            
            cx += 1;
            if (cx > this.columns) {
                cx = 0;
                cy+=1;
            }
        }
    }


    /**
     * Returns true if x,y is inside box
     * @param x 
     * @param y 
     * @param width
     * @param height 
     */
    private isInbound(x: number, y: number, boxx: number, boxy: number, width: number, height: number): boolean {
        return (x > boxx && x < boxx + width && 
                y > boxy && y < boxy + height);
    }

}