import { Enemy } from "@game/content/Enemy";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";
import { Player } from "@game/system/Player";
import { GameInterface } from "./GameInterface";
import { GameController } from "@game/system/GameController";
import { Spell, TargetType } from "@game/content/spells/Spell";
import { SpellButton } from "./components/SpellButton";
import { Button } from "./components/Button";
import { GameStats } from "@game/content/GameStats";

/**
 * Displays and process combats
 */
export class Combat extends EngineObject {

    private enemies: Enemy[]; // vs Player

    /**
     * Reset to 0 each turn.
     * If == 0, then its player turn.
     */
    private currentRound = 0;
    // private turnOrder: (Enemy|'player')[];

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

    private endTurnButton: Button;
    private spellsButtons: SpellButton[];
    private tooltip: string[];
    private tooltipDisplay = false;

    private currentSpellPlayed: Spell;
    private currentSpellPlayedFrame = 0;
    private currentSpellPlayedTargets: {x: number, y: number, stat: GameStats}[];
    private currentSpellPlayedOrig: {x: number, y: number, stat: GameStats};
    private currentSpellPlayedCallback: ()=>void;

    // private actionPlayed = false;
    
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
        // this.buildTurnOrder();
        Player.stats.cancelAnimation();
        console.log('Combat started', enemies);
        /*
        if (this.getCurrentTurn() != 'player') {
            this.doEnemyAction(this.getCurrentTurn() as Enemy);
        }
        */
       Player.stats.healFullEnergy();
    }

    /**
     * Combat interface
     */
    public display() {
        // if (!this.turnOrder) return;
        // frame
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.fillStyle = '#020202';
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.fillRect(this.x, this.y + this.frameAnim*this.height/2, this.width, this.height - this.frameAnim*this.height);
        GameGraphics.ctx.strokeRect(this.x, this.y + this.frameAnim*this.height/2, this.width, this.height - this.frameAnim*this.height);

        if (this.frameAnim > 0) {
            this.frameAnim -= 0.04;
        } else {
            this.frameAnim = 0;
        }
        if (this.frameAnim > 0) return;

        // player
        // (placeholder)
        GameGraphics.ctx.fillStyle = '#804d32';
        GameGraphics.ctx.fillRect(this.x + Combat.PADDING, this.abilitiesY - Combat.PADDING - this.playerSize, 
            this.playerSize, this.playerSize);
        // player energy
        Player.stats.displayHp(
            this.x + Combat.PADDING + this.playerSize + Combat.PADDING, 
            this.abilitiesY - Combat.PADDING - this.playerSize, 
            Math.max(this.width / 6, this.playerSize)
        );
        Player.stats.displayEnergy(
            this.x + Combat.PADDING + this.playerSize + Combat.PADDING, 
            this.abilitiesY - Combat.PADDING - this.playerSize+25, 
            Math.max(this.width / 6-5, this.playerSize-5)
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

            if (this.targetSelectionToChoose > 0 && this.enemies[i].isInbound(GameController.mouseX, GameController.mouseY)) {
                // display selectionitivity
                GameGraphics.ctx.fillStyle = 'yellow';
                GameGraphics.ctx.strokeStyle = 'yellow';
                GameGraphics.ctx.lineWidth = 1;
                GameGraphics.ctx.strokeRect(
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
            GameGraphics.ctx.fillStyle = 'yellow';
            GameGraphics.ctx.strokeStyle = 'yellow';
            GameGraphics.ctx.lineWidth = 3;

            for (let i = 0;i<this.targetSelectionToChoose; i++) {
                GameGraphics.ctx.strokeRect(this.width / 2 + i*25, this.abilitiesY - 25, 20, 20);
                if (this.targetSelectionCurrent[i] >= 0) {
                    GameGraphics.ctx.fillRect(this.width / 2 + i*25, this.abilitiesY - 25, 20, 20);

                    // display on target
                    const e = this.enemies[this.targetSelectionCurrent[i]];
                    GameGraphics.ctx.strokeRect(
                        e.x - e.size/2, 
                        e.y - e.size/2, 
                        e.size, e.size);
                }
            }
        }

        // next turn when ready
        if (this.currentSpellPlayedFrame <= 0 && this.currentSpellPlayed) {
            /*if (this.actionPlayed) {
                // do the effect of the spell
                this.currentSpellPlayedCallback();
                // no more frame to play & action is done
                this.advanceTurn();
            }*/
            console.log('playing spell animation callback')
            this.currentSpellPlayed = null;
            this.currentSpellPlayedCallback();
        }

        // abilities box
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.strokeRect(this.x+3, this.abilitiesY, this.width-6, this.abilitiesHeight);
        if (this.getCurrentTurn() == 'player') {
            for(const ob of this.spellsButtons) {
                ob.display();
            }
    
            // end turn
            this.endTurnButton.display();
        }

        // spell tooltip
        if (this.tooltipDisplay) {
            this.tooltipDisplay = false;
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.fillStyle = '#020202';
            GameGraphics.ctx.strokeStyle = '#999999';
            GameGraphics.ctx.fillRect(this.x + this.width - Combat.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltip.length);
            GameGraphics.ctx.strokeRect(this.x + this.width - Combat.SPELL_WIDTH*2 - 15, this.y + 35,
                 -500, 30+20*this.tooltip.length);

            GameGraphics.ctx.font = "18px "+GameGraphics.FONT;
            GameGraphics.ctx.fillStyle = 'white';
            GameGraphics.ctx.textAlign = "right";
            GameGraphics.ctx.textBaseline = "top";
            for (let i = 0; i<this.tooltip.length; i++) {
                GameGraphics.ctx.fillText(this.tooltip[i], 
                    this.x + this.width - Combat.SPELL_WIDTH*2 - 20, this.y + 50 + i*20);
            }
        }
    }

    
    public displaySpellAnimation() {
        if (!this.currentSpellPlayed) return;
        this.currentSpellPlayed.animate(this.currentSpellPlayedFrame, this.currentSpellPlayedTargets, this.currentSpellPlayedOrig, this.playerSize);
        this.currentSpellPlayedFrame --;
    }
    
    /**
     * Triggers a spell to its 
     * @param spell 
     * @param targets 
     * @param origin 
     * @param onEnd 
     */
    public playSpellAnimation(spell: Spell, targets: (Enemy|'player')[], origin: Enemy|'player', onEnd: () => void) {
        this.currentSpellPlayedCallback = onEnd;
        this.currentSpellPlayedFrame = spell.frameAnimationMax;
        this.currentSpellPlayed = spell;
        console.log('playing spell animation : ', this.currentSpellPlayed);

        if (origin == 'player') {
            this.currentSpellPlayedOrig = {
                x: this.x + Combat.PADDING + this.playerSize/2,
                y: this.abilitiesY - Combat.PADDING - this.playerSize + this.playerSize/2,
                stat: Player.stats,
            };
        } else {
            this.currentSpellPlayedOrig = {
                x: origin.x,
                y: origin.y,
                stat: origin.stats,
            }
        }
        this.currentSpellPlayedTargets = [];
        for (const t of targets) {
            if (t == 'player') {
                this.currentSpellPlayedTargets.push({
                    x: this.x + Combat.PADDING + this.playerSize/2,
                    y: this.abilitiesY - Combat.PADDING - this.playerSize + this.playerSize/2,
                    stat: Player.stats,
                });
            } else {
                this.currentSpellPlayedTargets.push({
                    x: t.x,
                    y: t.y,
                    stat: t.stats,
                });
            }
        }
    }

    private doPlayerAction(spell: Spell) {
        // check cooldown
        if (spell.currentCooldown > 0) {
            // cooldown not ready
            return;
        }
        // check energy
        if (Player.stats.energy < spell.energyCost) {
            // not enough energy
            return;
        } 
        
        // process cooldown
        spell.currentCooldown = spell.cooldown;
        
        // process energy
        Player.stats.energy -= spell.energyCost;
        
        switch(spell.targetType) {
            case TargetType.NoTarget:
                this.playSpellAnimation(spell, [], 'player', () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.Self:
                this.playSpellAnimation(spell, ['player'], 'player', () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.Single:
                this.chooseTargets(1, (targets) => {
                    this.playSpellAnimation(spell, targets, 'player', () => {
                        this.checkCombatState();
                    });
                });
            break;
            case TargetType.AllEnemies:
                this.playSpellAnimation(spell, this.enemies, 'player', () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.All:
                this.playSpellAnimation(spell, [...this.enemies, "player"], 'player', () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.Multiple:
                this.chooseTargets(spell.targetMax, (targets) => {
                    this.playSpellAnimation(spell, targets, 'player', () => {
                        this.checkCombatState();
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
        if (enemy) enemy.playTurn(this, () => {
            // the enemy finished playing
            this.advanceRound();
        });
    }
    
    /**
     * Checks combat state & advance round.
     * 
     */
    private advanceRound() {
        
        this.checkCombatState();
        
        this.currentRound++;

        if (this.enemies.length < this.currentRound) {
            // new turn
            this.newPlayerTurn();
            this.currentRound = 0;
        }
        const roundTo = this.getCurrentTurn();

        if (roundTo != 'player') {
            // new enemy turn
            this.newEnemyTurn(roundTo);
        }
    }

    /**
     * Happens when player is playing again
     */
    private newPlayerTurn() {
        // refill player energy
        Player.stats.healFullEnergy();
        // advance player buffs
        Player.stats.advanceBuffDepletion();
        // advance spells cooldown
        for (const spellIndex of Player.stats.activeSpells) {
            Player.stats.spells[spellIndex].advanceCooldown();
        }
    }

    private newEnemyTurn(enemy: Enemy) {
        // advance its buffs
        enemy.stats.advanceBuffDepletion();
        // do its action
        this.doEnemyAction(enemy);
    }

    /**
     * Checks on combat state.
     * If player is dead, it loses the fight.
     * If an enemy is dead it removes it from the pool
     * @returns 
     */
    private checkCombatState() {
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

    /**
     * Get the current entity playing.
     */
    private getCurrentTurn(): Enemy|'player' {
        if (this.currentRound == 0) return 'player';
        return this.enemies[this.currentRound - 1];
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

        // if its player turn & no animation running
        if (this.getCurrentTurn() == 'player' && this.currentSpellPlayedFrame <= 0) {
            // abilities
            for(const ob of this.spellsButtons) {
                ob.mousePressed(x, y);
            }  

            // end turn
            this.endTurnButton.mousePressed(x, y);
        }
    }

    public resize(): void {
        this.x = Combat.MARGIN;
        this.y = Combat.MARGIN;
        this.width = GameGraphics.canvas.width - Combat.MARGIN*2;
        this.height = GameGraphics.canvas.height - Combat.MARGIN*2;

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

        this.endTurnButton = new Button(
            this.x + this.width - 155, 
            this.abilitiesY + 5, 150, 40, () => {
                // this.advanceTurn();
                this.advanceRound();
            }, {
                color: 'black',
                strokeColor: 'red',
                textColor: 'red',
                colorHover: '#332222',
                text: 'Fin du tour'
            });
    }
}
