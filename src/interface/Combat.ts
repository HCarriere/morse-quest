import { Enemy } from "@game/content/Enemy";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { Player } from "@game/system/Player";
import { Button } from "./components/Button";

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
    private spellsWidth: number;
    private spellsHeight: number;

    private frameAnim: number;

    private static MARGIN = 50;
    private static PADDING = 20;

    private buttons: Button[];

    constructor(enemies: Enemy[]) {
        super();
        
        this.enemies = enemies;
        this.resize();
        this.frameAnim = 1.0;
        this.buildActions();

        console.log('Combat started', enemies);
    }

    /**
     * Combat interface
     */
    public display() {
        // frame
        Graphics.ctx.lineWidth = 4;
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
                this.y + Combat.PADDING + this.enemiesSize + Combat.PADDING*2, 
                this.enemiesSize
            );
        }

        // player actions
        Graphics.ctx.strokeRect(this.x, this.abilitiesY, this.width, this.abilitiesHeight);

        for(const ob of this.buttons) {
            ob.display();
        }
    }

    public displayTooltips() {
        for(const ob of this.buttons) {
            ob.displayTooltip();
        }
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
        this.spellsWidth = this.width / 6;
        this.spellsHeight = this.abilitiesHeight / 2;
    }

    private buildActions (){
        this.buttons = [];
        // column 1
        for (let i = 0; i < Player.stats.spells.length; i++) {
            this.buttons.push(new Button(
                this.x + this.abilitiesHeight/4 + (this.spellsWidth+this.abilitiesHeight/4) * i, 
                this.abilitiesY + this.abilitiesHeight/4, 
                this.spellsWidth, this.spellsHeight, 
            () => {
                console.log(Player.stats.spells[i].name);
            }, {
                text: Player.stats.spells[i].name,
                color: 'black',
                textColor: 'white',
                strokeColor: 'white',
                textSize: 18,
            }, Player.stats.spells[i].description));
        }
    }

    public mousePressed(x: number, y: number): void {
        for(const ob of this.buttons) {
            ob.mousePressed(x, y);
        }    
    }
}