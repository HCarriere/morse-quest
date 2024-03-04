import { Enemy } from "@game/content/Enemy";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { Player } from "@game/system/Player";

/**
 * Displays and process combats
 */
export class Combat extends GameObject {

    private enemies: Enemy[]; // vs Player

    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private abilitiesY: number;
    private abilitiesHeight: number;
    private enemiesSize: number;
    private playerSize: number;

    private frameAnim: number;

    private static MARGIN = 50;
    private static PADDING = 20;

    constructor(enemies: Enemy[]) {
        super();
        
        this.enemies = enemies;

        this.resize();

        this.frameAnim = 1.0;

        console.log('Combat started', enemies);
    }

    /**
     * Combat interface
     */
    public display() {
        // frame
        Graphics.ctx.fillStyle = '#020202';
        Graphics.ctx.strokeStyle = 'lightgrey';
        Graphics.ctx.fillRect(this.x, this.y + this.frameAnim*this.height/2, this.width, this.height - this.frameAnim*this.height);
        Graphics.ctx.strokeRect(this.x, this.y + this.frameAnim*this.height/2, this.width, this.height - this.frameAnim*this.height);

        if (this.frameAnim > 0) {
            this.frameAnim -= 0.03;
        } else {
            this.frameAnim = 0;
        }
        if (this.frameAnim > 0) return;

        // player
        // placeholder
        Graphics.ctx.fillStyle = '#804d32';
        Graphics.ctx.fillRect(this.x + Combat.PADDING, this.abilitiesY - Combat.PADDING - this.playerSize, 
            this.playerSize, this.playerSize);
        // player energy
        Player.stats.displayHp(
            this.x + Combat.PADDING + this.playerSize + Combat.PADDING, 
            this.abilitiesY - Combat.PADDING - this.playerSize, 
            Math.max(this.width / 6, this.playerSize)
        );
        
        // enemies
        for (let i = 0; i<this.enemies.length; i++) {
            // skin
            this.enemies[i].display(
                this.width - Combat.PADDING - i*(Combat.PADDING+this.enemiesSize) - this.enemiesSize/2, 
                this.y + Combat.PADDING + this.enemiesSize/2, 
                this.enemiesSize
            );
            
            // energy
            this.enemies[i].stats.displayHp(
                this.width - Combat.PADDING - i*(Combat.PADDING+this.enemiesSize) - this.enemiesSize/2, 
                this.y + Combat.PADDING + this.enemiesSize + Combat.PADDING, 
                this.enemiesSize
            );
        }

        


        // player actions
        Graphics.ctx.strokeRect(this.x, this.abilitiesY, this.width, this.abilitiesHeight);
        
    }

    private combatEnd() {

    }
    
    public resize(): void {
        this.x = Combat.MARGIN;
        this.y = Combat.MARGIN;
        this.width = Graphics.canvas.width - Combat.MARGIN*2;
        this.height = Graphics.canvas.height - Combat.MARGIN*2;

        this.enemiesSize = this.height / 5;
        this.playerSize = this.enemiesSize * 1.2;
        
        this.abilitiesY = (this.height / 3) * 2 + Combat.MARGIN;
        this.abilitiesHeight = this.height / 3;
    }
}