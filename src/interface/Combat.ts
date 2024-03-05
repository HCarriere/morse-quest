import { Enemy } from "@game/content/Enemy";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { Player } from "@game/system/Player";
import { Button } from "./components/Button";
import { Spell, TargetType } from "@game/content/Spell";
import { GameInterface } from "./GameInterface";

/**
 * Displays and process combats
 */
export class Combat extends GameObject {

    private enemies: Enemy[]; // vs Player

    // fight
    private currentTurn: number;
    private turnOrder: (Enemy|'player')[];

    // display
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

    private currentSpellPlayed: Spell;
    private currentSpellPlayedFrame: number;
    private currentSpellPlayedTargets: {x: number, y: number}[];
    private currentSpellPlayedOrig: {x: number, y: number};

    private actionPlayed = false;

    constructor(enemies: Enemy[]) {
        super();
        
        this.enemies = enemies;
        this.resize();
        this.frameAnim = 1.0;
        this.buildActions();
        this.buildTurnOrder();
        Player.stats.cancelAnimation();
        console.log('Combat started', enemies);

        if (this.getCurrentTurn() != 'player') {
            this.doEnemyAction(this.getCurrentTurn() as Enemy);
        }
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
                this.enemies[i].combatX - this.enemiesSize/2, 
                this.enemies[i].combatY - this.enemiesSize/2, 
                this.enemiesSize
            );
            
            // energy
            this.enemies[i].stats.displayHp(
                this.width - Combat.PADDING - i*(Combat.PADDING+this.enemiesSize) - this.enemiesSize/2, 
                this.y + Combat.PADDING + this.enemiesSize + Combat.PADDING*2, 
                this.enemiesSize
            );
        }

        // spell
        if (this.currentSpellPlayedFrame > 0) {
            this.displaySpellAnimation();
        } else {
            if (this.actionPlayed) {
                // no more frame to play & action is done
                this.advanceTurn();
            }
        }

        // abilities box
        Graphics.ctx.strokeRect(this.x, this.abilitiesY, this.width, this.abilitiesHeight);

        if (this.getCurrentTurn() == 'player') {
            for(const ob of this.buttons) {
                ob.display();
            }
        }
        /* else if (!this.actionPlayed) {
            // player enemies turn
            this.doEnemyAction(this.getCurrentTurn() as Enemy);
            this.actionPlayed = true;
        }*/
    }

    public displayTooltips() {
        for(const ob of this.buttons) {
            ob.displayTooltip();
        }
    }

    public playSpellAnimation(spell: Spell, targets: (Enemy|'player')[], origin: Enemy|'player') {
        this.currentSpellPlayedFrame = spell.frameAnimationMax;
        this.currentSpellPlayed = spell;
        if (origin == 'player') {
            this.currentSpellPlayedOrig = {
                x: this.x + Combat.PADDING + this.playerSize/2,
                y: this.abilitiesY - Combat.PADDING - this.playerSize + this.playerSize/2,
            };
        } else {
            this.currentSpellPlayedOrig = {
                x: origin.combatX,
                y: origin.combatY,
            }
        }
        this.currentSpellPlayedTargets = [];
        for (const t of targets) {
            if (t == 'player') {
                this.currentSpellPlayedTargets.push({
                    x: this.x + Combat.PADDING + this.playerSize/2,
                    y: this.abilitiesY - Combat.PADDING - this.playerSize + this.playerSize/2,
                });
            } else {
                this.currentSpellPlayedTargets.push({
                    x: t.combatX,
                    y: t.combatY,
                });
            }
        }
    }

    public displaySpellAnimation() {
        if (!this.currentSpellPlayed) return;
        this.currentSpellPlayed.animate(this.currentSpellPlayedFrame, this.currentSpellPlayedTargets, this.currentSpellPlayedOrig, this.playerSize);
        this.currentSpellPlayedFrame --;
    }
    

    private doPlayerAction(spell: Spell) {
        if (spell.targetType == TargetType.Multiple) {
            for(const e of this.enemies) {
                spell.effect(e.stats);
            }
        } else {
            // TODO handle targets ...
        }
        this.actionPlayed = true;
        this.playSpellAnimation(spell, this.enemies, 'player');
        console.log('end player turn');
    }

    private doEnemyAction(enemy: Enemy) {
        console.log(enemy.name + ' is playing');
        enemy.playTurn(this);
        this.actionPlayed = true;
    }

    private advanceTurn() {
        // check death
        if (Player.stats.hp <= 0) {
            Player.die();
            this.end();
            return;
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].stats.hp <= 0) {
                console.log(this.enemies[i].name + ' is dead')
                this.enemies.splice(i, 1);
            }
        }
        if (this.enemies.length == 0) {
            // win the fight
            this.winFight();
            return;
        }
        this.actionPlayed = false;
        this.currentTurn ++;

        if (this.getCurrentTurn() != 'player') {
            this.doEnemyAction(this.getCurrentTurn() as Enemy);
        }
    }

    private winFight() {
        console.log('you won bro')
        this.end();
    }

    private end() {
        GameInterface.endCombat();
    }

    private buildActions() {
        this.buttons = [];
        // column 1
        for (let i = 0; i < Player.stats.spells.length; i++) {
            this.buttons.push(new Button(
                this.x + this.abilitiesHeight/4 + (this.spellsWidth+this.abilitiesHeight/4) * i, 
                this.abilitiesY + this.abilitiesHeight/4, 
                this.spellsWidth, this.spellsHeight, 
            () => {
                
                this.doPlayerAction(Player.stats.spells[i]);
            }, {
                text: Player.stats.spells[i].name,
                color: 'black',
                textColor: 'white',
                strokeColor: 'white',
                textSize: 18,
                colorHover: 'darkgrey'
            }, Player.stats.spells[i].description));
        }
    }

    private getCurrentTurn(): Enemy|'player' {
        return this.turnOrder[this.currentTurn % this.turnOrder.length];
    }
    

    private buildTurnOrder() {
        this.turnOrder = [];
        this.currentTurn = 0;
        this.turnOrder.push('player');
        this.turnOrder.push(...this.enemies);
        console.log('turn order', this.turnOrder);
        this.turnOrder.sort((a, b) => Math.random()-0.5);
        console.log('turn order after shuffle', this.turnOrder);
    }

    public mousePressed(x: number, y: number): void {
        for(const ob of this.buttons) {
            ob.mousePressed(x, y);
        }    
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

        for (let i = 0; i<this.enemies.length; i++) {
            // skin
            this.enemies[i].combatX = this.width - Combat.PADDING - i*(Combat.PADDING+this.enemiesSize);
            this.enemies[i].combatY = this.y + Combat.PADDING + this.enemiesSize;
        }
    }
}