import { Enemy } from "@game/content/Enemy";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";
import { Player } from "@game/system/Player";
import { GameInterface } from "./GameInterface";
import { Controller } from "@game/system/Controller";
import { Spell, TargetType } from "@game/content/spells/Spell";
import { SpellButton } from "./components/SpellButton";

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

    private frameAnim: number;

    private static MARGIN = 50;
    private static PADDING = 20;
    private static SPELL_WIDTH = 200;
    private static SPELL_HEIGHT = 65;

    private spellsButtons: SpellButton[];
    private tooltip: string[];
    private tooltipDisplay = false;

    private currentSpellPlayed: Spell;
    private currentSpellPlayedFrame: number;
    private currentSpellPlayedTargets: {x: number, y: number}[];
    private currentSpellPlayedOrig: {x: number, y: number};
    private currentSpellPlayedCallback: ()=>void;

    private actionPlayed = false;
    
    /**
     * Set this to the number of targets you have to choose from
     */
    private targetSelectionToChoose: number = 0;
    /**
     * From the enemies pool
     */
    private targetSelectionCurrent: number[];
    private targetSelectionCallback: (targets: Enemy[])=>void;

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
        if (!this.turnOrder) return;
        // frame
        Graphics.ctx.lineWidth = 1;
        Graphics.ctx.fillStyle = '#020202';
        Graphics.ctx.strokeStyle = 'white';
        Graphics.ctx.fillRect(this.x, this.y + this.frameAnim*this.height/2, this.width, this.height - this.frameAnim*this.height);
        Graphics.ctx.strokeRect(this.x, this.y + this.frameAnim*this.height/2, this.width, this.height - this.frameAnim*this.height);

        if (this.frameAnim > 0) {
            this.frameAnim -= 0.04;
        } else {
            this.frameAnim = 0;
        }
        if (this.frameAnim > 0) return;

        // player
        // (placeholder)
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
            this.enemies[i].display();
            
            // energy
            this.enemies[i].stats.displayHp(
                this.enemies[i].x - this.enemies[i].size/2, 
                this.enemies[i].y + this.enemies[i].size/2, 
                this.enemies[i].size
            );

            if (this.targetSelectionToChoose > 0 && this.enemies[i].isInbound(Controller.mouseX, Controller.mouseY)) {
                // display selectionitivity
                Graphics.ctx.fillStyle = 'yellow';
                Graphics.ctx.strokeStyle = 'yellow';
                Graphics.ctx.lineWidth = 1;
                Graphics.ctx.strokeRect(
                    this.enemies[i].x - this.enemies[i].size/2, 
                    this.enemies[i].y - this.enemies[i].size/2, 
                    this.enemies[i].size, this.enemies[i].size);
            }
        }

        // display spell
        if (this.currentSpellPlayedFrame > 0) {
            this.displaySpellAnimation();
        }

        // display target selection
        if (this.targetSelectionToChoose > 0){
            Graphics.ctx.fillStyle = 'yellow';
            Graphics.ctx.strokeStyle = 'yellow';
            Graphics.ctx.lineWidth = 3;

            for (let i = 0;i<this.targetSelectionToChoose; i++) {
                Graphics.ctx.strokeRect(this.width / 2 + i*25, this.abilitiesY - 25, 20, 20);
                if (this.targetSelectionCurrent[i] >= 0) {
                    Graphics.ctx.fillRect(this.width / 2 + i*25, this.abilitiesY - 25, 20, 20);

                    // display on target
                    const e = this.enemies[this.targetSelectionCurrent[i]];
                    Graphics.ctx.strokeRect(
                        e.x - e.size/2, 
                        e.y - e.size/2, 
                        e.size, e.size);
                }
            }
        }

        // next turn when ready
        if (this.currentSpellPlayedFrame <= 0 && this.targetSelectionToChoose <= 0) {
            if (this.actionPlayed) {
                this.currentSpellPlayedCallback();
                // no more frame to play & action is done
                this.advanceTurn();
            }
        }

        // abilities box
        Graphics.ctx.strokeStyle = 'white';
        Graphics.ctx.lineWidth = 1;
        Graphics.ctx.strokeRect(this.x+3, this.abilitiesY, this.width-6, this.abilitiesHeight);
        if (this.getCurrentTurn() == 'player') {
            for(const ob of this.spellsButtons) {
                ob.display();
            }
        }

        // spell tooltip
        if (this.tooltipDisplay) {
            this.tooltipDisplay = false;
            Graphics.ctx.lineWidth = 1;
            Graphics.ctx.fillStyle = '#020202';
            Graphics.ctx.strokeStyle = '#999999';
            Graphics.ctx.fillRect(this.x + this.width - Combat.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltip.length);
            Graphics.ctx.strokeRect(this.x + this.width - Combat.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltip.length);

            Graphics.ctx.font = "18px "+Graphics.FONT;
            Graphics.ctx.fillStyle = 'white';
            Graphics.ctx.textAlign = "right";
            Graphics.ctx.textBaseline = "top";
            for (let i = 0; i<this.tooltip.length; i++) {
                Graphics.ctx.fillText(this.tooltip[i], 
                    this.x + this.width - Combat.SPELL_WIDTH*2 - 20, this.y + 50 + i*20);
            }
        }

    }


    public playSpellAnimation(spell: Spell, targets: (Enemy|'player')[], origin: Enemy|'player', onEnd: () => void) {
        this.currentSpellPlayedCallback = onEnd;
        this.currentSpellPlayedFrame = spell.frameAnimationMax;
        this.currentSpellPlayed = spell;
        if (origin == 'player') {
            this.currentSpellPlayedOrig = {
                x: this.x + Combat.PADDING + this.playerSize/2,
                y: this.abilitiesY - Combat.PADDING - this.playerSize + this.playerSize/2,
            };
        } else {
            this.currentSpellPlayedOrig = {
                x: origin.x,
                y: origin.y,
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
                    x: t.x,
                    y: t.y,
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
        if (this.actionPlayed) return;
        console.log('do player turn');

        this.actionPlayed = true;
        
        switch(spell.targetType) {
            case TargetType.NoTarget:
                this.playSpellAnimation(spell, [], 'player', () => {
                    spell.effect([]);
                });
            break;
            case TargetType.Single:
                this.chooseTargets(1, (targets) => {
                    this.playSpellAnimation(spell, targets, 'player', () => {
                        spell.effect(targets.map(o => o.stats));
                    });
                });
            break;
            case TargetType.AllEnemies:
                this.playSpellAnimation(spell, this.enemies, 'player', () => {
                    spell.effect(this.enemies.map(o => o.stats));
                });
            break;
            case TargetType.Multiple:
                this.chooseTargets(spell.targetMax, (targets) => {
                    this.playSpellAnimation(spell, targets, 'player', () => {
                        spell.effect(targets.map(o => o.stats));
                    });
                });
            break;
            default: break;
        }
    }

    private chooseTargets(number: number, onTargetsAcquired: (targets: Enemy[])=>void) {
        console.log('choosing targets ...')
        this.targetSelectionToChoose = number;
        this.targetSelectionCurrent = [];
        this.targetSelectionCallback = onTargetsAcquired;
    }
    private selectTarget(i: number) {
        console.log('selected target ', i)
        this.targetSelectionCurrent.push(i);

        if (this.targetSelectionCurrent.length == this.targetSelectionToChoose) {
            // finished
            const targets: Enemy[] = [];
            for (const n of this.targetSelectionCurrent) {
                targets.push(this.enemies[n]);
            }
            this.targetSelectionCallback(targets);
            // reset
            this.targetSelectionToChoose = 0;
            this.targetSelectionCurrent = [];
        }
    }

    private doEnemyAction(enemy: Enemy) {
        if (!enemy.isDead) enemy.playTurn(this);
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
            if (this.enemies[i].isDead) {
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
        this.spellsButtons = [];
        let cx=0;
        let cy=0;
        let i=0;
        for (const spellIndex of Player.stats.activeSpells) {
            this.spellsButtons.push(new SpellButton(
                this.x + 10 + cx * (Combat.SPELL_WIDTH+10), 
                this.abilitiesY + 10 + cy * (Combat.SPELL_HEIGHT+10), 
                Combat.SPELL_WIDTH, Combat.SPELL_HEIGHT, Player.stats.spells[spellIndex], spellIndex,
                (n, sb) => {
                    // on click
                    this.doPlayerAction(Player.stats.spells[n]);
                },
                (s) => {
                    // on hover
                    this.tooltip = s.description;
                    this.tooltipDisplay = true;
                }));
            i++;
            if (i%2==0) {
                cx++;
                cy=0;
            } else {
                cy=1;
            }
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
        if (this.frameAnim > 0) return;

        if (this.targetSelectionToChoose > 0) {
            // select first
            for(let i = 0; i<this.enemies.length; i++) {
                if (this.enemies[i].isInbound(x, y)) {
                    // select this one
                    this.selectTarget(i);
                    return;
                }
            }
            return;
        }

        for(const ob of this.spellsButtons) {
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
        this.abilitiesHeight = this.height / 3 - 3;

        for (let i = 0; i<this.enemies.length; i++) {
            // skin
            this.enemies[i].x = this.width - Combat.PADDING - i*(Combat.PADDING+this.enemiesSize);
            this.enemies[i].y = this.y + Combat.PADDING + this.enemiesSize;
            this.enemies[i].size = this.enemiesSize;
        }
    }
}