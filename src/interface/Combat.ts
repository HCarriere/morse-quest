import { Enemy } from "@game/content/Enemy";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";
import { Player } from "@game/system/Player";
import { GameInterface } from "./GameInterface";
import { GameController } from "@game/system/GameController";
import { Spell, TargetAlignment, TargetType } from "@game/content/spells/Spell";
import { SpellButton } from "./components/SpellButton";
import { Button } from "./components/Button";
import { GameStats } from "@game/content/GameStats";
import { BuffIcons } from "./components/BuffIcons";
import { Camera } from "@game/system/Camera";
import { Reward } from "@game/content/Reward";
import { RewardScreen } from "./RewardScreen";
import { Ally } from "@game/content/Ally";

type CombatEntity = Enemy | 'player' | Ally;

/**
 * Displays and process combats
 */
export class Combat extends EngineObject {

    private enemies: Enemy[]; // vs Player
    private allies: Ally[] = []; // allies of player
    private reward: Reward;
    private showRewardScreen: boolean = false;
    private rewardScreen: RewardScreen;

    /**
     * Reset to 0 each turn.
     * If == 0, then its player turn.
     */
    private currentRound = 0;

    // display
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private abilitiesY: number;
    private abilitiesHeight: number;
    private enemiesSize: number;
    private alliesSize: number;
    private playerSize: number;

    private onCombatWin: () => void;
    private onCombatLose: () => void;

    private frameAnim: number;

    private static MARGIN = 50;
    private static PADDING = 20;
    private static SPELL_WIDTH = 200;
    private static SPELL_HEIGHT = 65;
    private static REWARD_MARGIN_X = 300;
    private static REWARD_MARGIN_Y = 20;

    private endTurnButton: Button;
    private spellsButtons: SpellButton[];
    private buffIcons: BuffIcons[];
    private tooltip: string[];
    private tooltipDisplay = false;

    private currentSpellPlayed: Spell;
    private currentSpellPlayedFrame = 0;
    private currentSpellPlayedTargets: {x: number, y: number, stat: GameStats}[];
    private currentSpellPlayedOrig: {x: number, y: number, stat: GameStats};
    private currentSpellPlayedCallback: ()=>void;
    private spellMissed = false;

    // private actionPlayed = false;
    
    /**
     * Set this to the number of targets you have to choose from
     */
    private targetSelectionToChoose: number = 0;
    /**
     * From the enemies pool
     */
    private targetSelectionAlignment: TargetAlignment;
    private targetSelectionCurrent: CombatEntity[];
    private targetSelectionCallback: (targets: CombatEntity[])=>void;

    constructor(enemies: Enemy[],
                onCombatWin?: () => void,
                onCombatLose?: () => void,) {
        super();
        
        this.enemies = enemies;
        this.reward = Reward.fromEnemies(enemies);
        this.onCombatWin = onCombatWin;
        this.onCombatLose = onCombatLose;

        this.resize();
        this.frameAnim = 1.0;
        this.buildActions();
        this.synchronizeBuffs();
        // this.buildTurnOrder();
        Player.stats.cancelAnimation();
        console.log('Combat started', enemies);
        /*
        if (this.getCurrentTurn() != 'player') {
            this.doEnemyAction(this.getCurrentTurn() as Enemy);
        }
        */

        Player.stats.healFullEnergy();
        Player.stats.resetAllCooldowns();
        Player.stats.clearAllBuffs();

        // prepare enemies turns
        for (const e of this.enemies) {
            e.prepareTurn();
        }
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
        GameGraphics.displayHero(this.x + Combat.PADDING, this.abilitiesY - Combat.PADDING - this.playerSize, 
            this.playerSize);
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

        if (this.showRewardScreen) {
            this.rewardScreen.display();
            return;
        }
        
        if (
            this.targetSelectionToChoose > 0
            && (this.targetSelectionAlignment == TargetAlignment.Allies || this.targetSelectionAlignment == TargetAlignment.Both)
            && this.playerIsInbound(GameController.mouseX, GameController.mouseY)
        ) {
            // display selectionitivity
            GameGraphics.ctx.fillStyle = 'yellow';
            GameGraphics.ctx.strokeStyle = 'yellow';
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.strokeRect(
                this.x + Combat.PADDING, 
                this.abilitiesY - Combat.PADDING - this.playerSize, 
                this.playerSize, this.playerSize);
        }
        
        // allies
        for (let i = 0; i<this.allies.length; i++) {
            // skin
            this.allies[i].display();
            
            // energy
            this.allies[i].stats.displayHp(
                this.allies[i].x - this.allies[i].size/2,
                this.allies[i].y + this.allies[i].size/2,
                this.allies[i].size
                );
            this.allies[i].stats.displayEnergy(
                this.allies[i].x - this.allies[i].size/2,
                this.allies[i].y + this.allies[i].size/2 + 25,
                this.allies[i].size
            );

            // target selection
            if (
                this.targetSelectionToChoose > 0
                && (this.targetSelectionAlignment == TargetAlignment.Allies || this.targetSelectionAlignment == TargetAlignment.Both)
                && this.allies[i].isInbound(GameController.mouseX, GameController.mouseY)
            ) {
                // display selectionitivity
                GameGraphics.ctx.fillStyle = 'yellow';
                GameGraphics.ctx.strokeStyle = 'yellow';
                GameGraphics.ctx.lineWidth = 1;
                GameGraphics.ctx.strokeRect(
                    this.allies[i].x - this.allies[i].size/2, 
                    this.allies[i].y - this.allies[i].size/2, 
                    this.allies[i].size, this.allies[i].size);
            }
        }
        
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

            // turn intent
            GameGraphics.displayTurnIntent(this.enemies[i].turnIntent,this.enemies[i].x, this.enemies[i].y - this.enemies[i].size/2 - 20);

            // target selection
            if (
                this.targetSelectionToChoose > 0
                && (this.targetSelectionAlignment == TargetAlignment.Enemies || this.targetSelectionAlignment == TargetAlignment.Both)
                && this.enemies[i].isInbound(GameController.mouseX, GameController.mouseY)
            ) {
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

        // display all buffs
        for (const b of this.buffIcons) {
            b.display();
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
                if (i < this.targetSelectionCurrent.length) {
                    GameGraphics.ctx.fillRect(this.width / 2 + i*25, this.abilitiesY - 25, 20, 20);
                    let targetEntity = this.targetSelectionCurrent[i];
                    if (targetEntity == 'player') {
                        // display on player
                        GameGraphics.ctx.strokeRect(
                            this.x + Combat.PADDING, 
                            this.abilitiesY - Combat.PADDING - this.playerSize, 
                            this.playerSize, this.playerSize);
                    } else if (targetEntity instanceof Ally) {
                        // display on ally
                        GameGraphics.ctx.strokeRect(
                            targetEntity.x - targetEntity.size/2, 
                            targetEntity.y - targetEntity.size/2, 
                            targetEntity.size, targetEntity.size);
                    } else {
                        // display on enemy
                        GameGraphics.ctx.strokeRect(
                            targetEntity.x - targetEntity.size/2, 
                            targetEntity.y - targetEntity.size/2, 
                            targetEntity.size, targetEntity.size);
                    }
                }
            }
        }
        

        // abilities box
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.strokeRect(this.x+3, this.abilitiesY, this.width-6, this.abilitiesHeight);
        if (!(this.getCurrentTurn() instanceof Enemy)) {
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

        // next turn when ready
        if (this.currentSpellPlayedFrame <= 0 && this.currentSpellPlayed) {
            // If the animation is demanded AND the animation finished
            // then call current animation callback. Handle combat states 
            // in the according methods.
            this.currentSpellPlayed = null;
            this.currentSpellPlayedCallback();
        }

        if (this.spellMissed) {
            // If the spell missed, we still call the callback to advance the combat
            this.spellMissed = false;
            this.currentSpellPlayedCallback();
        }
    }

    /**
     * Animate, if needed, the current spell animation
     * @returns 
     */
    private displaySpellAnimation() {
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
    public castSpell(spell: Spell, targets: CombatEntity[], origin: CombatEntity, onEnd: () => void) {
        this.currentSpellPlayedCallback = onEnd;
        const stats = origin == 'player' ? Player.stats : origin.stats;
        if (stats.accuracy < 100 && spell.targetType != TargetType.NoTarget && spell.targetType != TargetType.Self) {
            // check if the spell hits its targets
            const hitChance = Math.random() * 100;
            if (hitChance > stats.accuracy) {
                this.spellMissed = true;
                GameGraphics.addInterfaceParticle({
                        x: stats.x - stats.size / 2,
                        y: stats.y - stats.size / 2,
                        text: 'Missed',
                        color: 'yellow',
                        size: 25,
                        life: 120,
                        vx: Math.random()*4-2,
                        vy: Math.random()*2-6,
                        friction: 0.97,
                    });
                return;
            }
        }
        this.currentSpellPlayedFrame = spell.frameAnimationMax;
        this.currentSpellPlayed = spell;
        console.log('playing spell animation : ', this.currentSpellPlayed);

        if (origin == 'player') {
            this.currentSpellPlayedOrig = {
                x: this.x + Combat.PADDING + this.playerSize/2,
                y: this.abilitiesY - Combat.PADDING - this.playerSize + this.playerSize/2,
                stat: Player.stats,
            };
        } else if (origin instanceof Ally) {
            this.currentSpellPlayedOrig = {
                x: origin.x,
                y: origin.y,
                stat: origin.stats,
            }
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
            } else if (t instanceof Ally) {
                this.currentSpellPlayedTargets.push({
                    x: t.x,
                    y: t.y,
                    stat: t.stats,
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

    private doPlayerOrAllyAction(spell: Spell) {
        const currentTurn = this.getCurrentTurn();
        if (currentTurn instanceof Enemy) return; // not player or ally turn
        const stats = currentTurn instanceof Ally ? currentTurn.stats : Player.stats;
        console.log(spell)
        // check if already is targeting something
        if (this.targetSelectionToChoose) {
            this.targetSelectionToChoose = 0;
            return;
        }

        // check if action is not already running 
        if (this.currentSpellPlayed) {
            return;
        }

        // check cooldown
        if (spell.currentCooldown > 0) {
            // cooldown not ready
            return;
        }
        // check energy
        if (stats.energy < spell.energyCost) {
            // not enough energy
            return;
        }

        this.targetSelectionAlignment = spell.targetAlignment;
        
        switch(spell.targetType) {
            case TargetType.NoTarget:
                // process cooldown & energy
                spell.currentCooldown = spell.cooldown;
                stats.energy -= spell.energyCost;
                this.castSpell(spell, [], currentTurn, () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.Self:
                // process cooldown & energy
                spell.currentCooldown = spell.cooldown;
                stats.energy -= spell.energyCost;
                this.castSpell(spell, [currentTurn], currentTurn, () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.Single:
                this.chooseTargets(1, (targets) => {
                    // process cooldown & energy
                    spell.currentCooldown = spell.cooldown;
                    stats.energy -= spell.energyCost;
                    this.castSpell(spell, targets, currentTurn, () => {
                        this.checkCombatState();
                    });
                });
            break;
            case TargetType.AllEnemies:
                // process cooldown & energy
                spell.currentCooldown = spell.cooldown;
                stats.energy -= spell.energyCost;
                this.castSpell(spell, this.enemies, currentTurn, () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.All:
                // process cooldown & energy
                spell.currentCooldown = spell.cooldown;
                stats.energy -= spell.energyCost;
                this.castSpell(spell, [...this.enemies, "player", ...this.allies], currentTurn, () => {
                    this.checkCombatState();
                });
            break;
            case TargetType.Multiple:
                this.chooseTargets(spell.targetMax, (targets) => {
                    // process cooldown & energy
                    spell.currentCooldown = spell.cooldown;
                    stats.energy -= spell.energyCost;
                    this.castSpell(spell, targets, currentTurn, () => {
                        this.checkCombatState();
                    });
                });
            break;
            default: break;
        }
    }

    private chooseTargets(number: number, onTargetsAcquired: (targets: CombatEntity[])=>void) {
        if (this.targetSelectionAlignment == TargetAlignment.NotApplicable) {
            // no target selection
            console.warn('No target selection available for this spell');
            return;
        }
        console.log('choosing targets ...')
        this.targetSelectionToChoose = number;
        this.targetSelectionCurrent = [];
        this.targetSelectionCallback = onTargetsAcquired;
    }

    private selectTarget(target: CombatEntity) {
        console.log('selected target ', target)
        this.targetSelectionCurrent.push(target);

        if (this.targetSelectionCurrent.length == this.targetSelectionToChoose) {

            // finished
            this.targetSelectionCallback(this.targetSelectionCurrent);
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

        if (this.enemies.length + this.allies.length < this.currentRound) {
            // new turn
            // prepare enemies turns
            for (const e of this.enemies) {
                e.prepareTurn();
            }
            // init player turn
            this.newPlayerTurn();
            this.currentRound = 0;
        }
        const roundTo = this.getCurrentTurn();

        if (roundTo instanceof Ally) {
            // new ally turn
            this.newAllyTurn(roundTo);
        }

        if (roundTo instanceof Enemy) {
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
        this.synchronizeBuffs();
        // advance spells cooldown
        for (const spellIndex of Player.stats.activeSpells) {
            Player.stats.spells[spellIndex].advanceCooldown();
        }
        this.buildActions();
    }

    /**
     * Happens when ally is playing
     */
    private newAllyTurn(ally: Ally) {
        // refill ally energy
        ally.stats.healFullEnergy();
        // advance ally buffs
        ally.stats.advanceBuffDepletion();
        this.synchronizeBuffs();
        // advance spells cooldown
        for (const spellIndex of ally.stats.activeSpells) {
            ally.stats.spells[spellIndex].advanceCooldown();
        }
        this.buildActions();
    }

    /**
     * Happens when an enemy takes its turn
     * @param enemy 
     */
    private newEnemyTurn(enemy: Enemy) {
        // advance its buffs
        enemy.stats.advanceBuffDepletion();
        this.synchronizeBuffs();
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

        this.synchronizeBuffs();
        
        // check death
        if (Player.stats.hp <= 0) {
            if (this.onCombatLose) {
                this.onCombatLose();
            } else {
                Player.die();
            }
            this.end();
            return;
        }

        for (let i = this.allies.length - 1; i >= 0; i--) {
            if (this.allies[i].isDead) {
                console.log(this.allies[i].name + ' is dead')
                this.allies.splice(i, 1);
            }
        }
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.enemies[i].isDead) {
                console.log(this.enemies[i].name + ' is dead')
                this.enemies.splice(i, 1);
            }
        }
        if (this.enemies.length == 0) {
            this.rewardScreen = new RewardScreen(
                this.reward,
                this.x + Combat.REWARD_MARGIN_X,
                this.y + Combat.REWARD_MARGIN_Y,
                this.width - 2*Combat.REWARD_MARGIN_X,
                this.height - 2*Combat.REWARD_MARGIN_Y,
                () => this.winFight()
            );
            this.showRewardScreen = true;
            return;
        }
    }

    /**
     * Player win.
     * Earn XP, Gold, Objects
     */
    private winFight() {
        // rewards
        // xp
        GameGraphics.addInterfaceParticle({
            life: 120,
            size: 20,
            text: `+${this.reward.xp} xp`,
            color: "orange",
            x: Player.x * Camera.cellSize - Camera.offsetX,
            y: Player.y * Camera.cellSize - Camera.offsetY,
            vx: -1,
            vy: -2,
            friction: 0.98,
        });
        // gold
        GameGraphics.addInterfaceParticle({
            life: 120,
            size: 20,
            text: `+${this.reward.gold} gold`,
            color: "orange",
            x: Player.x * Camera.cellSize - Camera.offsetX,
            y: Player.y * Camera.cellSize - Camera.offsetY,
            vx: 1,
            vy: -2,
            friction: 0.98,
        });
        Player.give(this.reward);
        let newLevels = 0;
        while (Player.shouldLevelUp()) {
            newLevels++;
            // level up
            setTimeout(() => {
                GameGraphics.addInterfaceParticle({
                    life: 120,
                    size: 20,
                    text: `level up`,
                    color: "lightgreen",
                    x: Player.x * Camera.cellSize - Camera.offsetX,
                    y: Player.y * Camera.cellSize - Camera.offsetY,
                    vx: 0,
                    vy: -1,
                    friction: 0.98,
                });
            }, 500 * newLevels);
            Player.levelUp();
        }
        // end fight
        this.end();
        if (this.onCombatWin) {
            this.onCombatWin();
        }
    }

    /**
     * Reset player stats 
     * End the combat interface
     */
    private end() {
        Player.stats.resetAllCooldowns();
        Player.stats.clearAllBuffs();
        Player.stats.healFullEnergy();
        
        GameInterface.endCombat();
    }

    /**
     * Build action buttons
     */
    private buildActions() {
        const currentTurn = this.getCurrentTurn();
        if (currentTurn instanceof Enemy) return; // not player or ally turn
        const stats = currentTurn instanceof Ally ? currentTurn.stats : Player.stats;
        this.spellsButtons = [];
        let cx=0;
        let cy=0;
        let i=0;
        for (const spellIndex of stats.activeSpells) {
            this.spellsButtons.push(new SpellButton(
                this.x + 10 + cx * (Combat.SPELL_WIDTH+10), 
                this.abilitiesY + 10 + cy * (Combat.SPELL_HEIGHT+10), 
                Combat.SPELL_WIDTH, Combat.SPELL_HEIGHT, stats.spells[spellIndex], spellIndex,
                (n, sb) => {
                    // on click
                    this.doPlayerOrAllyAction(stats.spells[n]);
                },
                (s) => {
                    // on hover
                    this.tooltip = s.description;
                    this.tooltipDisplay = true;
                },
                stats
            ));
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
     * Build ALL buffs icons (player & ennemies)
     * Recall this method to synchronize.
     */
    private synchronizeBuffs() {
        console.log('synchronizing all buffs and build buffs icons');
        this.buffIcons = [];
        
        // Player buffs
        Player.stats.clearNecessaryBuffs();
        this.buffIcons.push(new BuffIcons(
            this.x + Combat.PADDING + this.playerSize + Combat.PADDING, 
            this.abilitiesY - Combat.PADDING - this.playerSize+55, 
            Player.stats, (buff) => {
            // on hover
            this.tooltip = buff.description;
            this.tooltipDisplay = true;
        }));

        // allies buffs
        for (const e of this.allies) {
            e.stats.clearNecessaryBuffs();
            this.buffIcons.push(new BuffIcons(
                e.x - e.size/2,
                e.y + e.size/2 + 50,
                e.stats, (buff) => {
                // on hover
                this.tooltip = buff.description;
                this.tooltipDisplay = true;
            }, 3));
        }

        // enemies buffs
        for (const e of this.enemies) {
            e.stats.clearNecessaryBuffs();
            this.buffIcons.push(new BuffIcons(
                e.x - e.size/2,
                e.y + e.size/2 + 30,
                e.stats, (buff) => {
                // on hover
                this.tooltip = buff.description;
                this.tooltipDisplay = true;
            }, 3));
        }
    }

    /**
     * Get the current entity playing.
     */
    private getCurrentTurn(): CombatEntity {
        if (this.currentRound == 0) return 'player';
        if (this.currentRound <= this.allies.length) return this.allies[this.currentRound - 1];
        return this.enemies[this.currentRound - 1 - this.allies.length];
    }
    
    public mousePressed(x: number, y: number): void {
        if (this.frameAnim > 0) return;

        if (this.targetSelectionToChoose > 0) {
            // select first
            if (this.targetSelectionAlignment == TargetAlignment.Enemies || this.targetSelectionAlignment == TargetAlignment.Both) {
                // select from enemies
                for(let i = 0; i<this.enemies.length; i++) {
                    if (this.enemies[i].isInbound(x, y)) {
                        // select this one
                        this.selectTarget(this.enemies[i]);
                        return;
                    }
                }
            }
            if (this.targetSelectionAlignment == TargetAlignment.Allies || this.targetSelectionAlignment == TargetAlignment.Both) {
                // select from allies
                for(let i = 0; i<this.allies.length; i++) {
                    if (this.allies[i].isInbound(x, y)) {
                        // select this one
                        this.selectTarget(this.allies[i]);
                        return;
                    }
                }
                // select player
                if (this.playerIsInbound(x, y)) {
                    this.selectTarget('player');
                    return;
                }
            }
        }

        // if its player or ally turn & no animation running
        if (!(this.getCurrentTurn() instanceof Enemy) && this.currentSpellPlayedFrame <= 0) {
            // abilities
            for(const ob of this.spellsButtons) {
                ob.mousePressed(x, y);
            }  

            // end turn
            this.endTurnButton.mousePressed(x, y);
        }

        if (!!this.rewardScreen && this.showRewardScreen) this.rewardScreen.mousePressed(x, y);
    }

    public resize(): void {
        this.x = Combat.MARGIN;
        this.y = Combat.MARGIN;
        this.width = GameGraphics.canvas.width - Combat.MARGIN*2;
        this.height = GameGraphics.canvas.height - Combat.MARGIN*2;

        this.enemiesSize = this.height / 5;
        this.alliesSize = this.height / 6;
        this.playerSize = this.enemiesSize * 1.2;
        
        this.abilitiesY = (this.height / 3) * 2 + Combat.MARGIN;
        this.abilitiesHeight = this.height / 3 - 3;

        Player.stats.x = this.x + this.playerSize/2;
        Player.stats.y = this.abilitiesY - this.playerSize/2;

        for (let i = 0; i<this.allies.length; i++) {
            // skin
            this.allies[i].stats.x = this.x + Combat.PADDING + this.playerSize + Combat.PADDING + this.width / 6 + Combat.PADDING + i * (this.alliesSize + Combat.PADDING) + this.alliesSize/2;
            this.allies[i].stats.y = this.abilitiesY - this.alliesSize - 2 * Combat.PADDING;
            this.allies[i].stats.size = this.alliesSize;
        }

        for (let i = 0; i<this.enemies.length; i++) {
            // skin
            this.enemies[i].stats.x = this.width - Combat.PADDING - i*(Combat.PADDING+this.enemiesSize);
            this.enemies[i].stats.y = this.y + Combat.PADDING + this.enemiesSize;
            this.enemies[i].stats.size = this.enemiesSize;
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
        
        if (!!this.rewardScreen) {
            this.rewardScreen.x = this.x + Combat.REWARD_MARGIN_X;
            this.rewardScreen.y = this.y + Combat.REWARD_MARGIN_Y;
            this.rewardScreen.width = this.width - 2*Combat.REWARD_MARGIN_X;
            this.rewardScreen.height = this.height - 2*Combat.REWARD_MARGIN_Y;
            this.rewardScreen.resize();
        }
    }

    addAlly(ally: Ally) {
        ally.stats.x = this.x + Combat.PADDING + this.playerSize + Combat.PADDING + this.width / 6 + Combat.PADDING + this.allies.length * (this.alliesSize + Combat.PADDING) + this.alliesSize/2;
        ally.stats.y = this.abilitiesY - this.alliesSize - 2 * Combat.PADDING;
        ally.stats.size = this.alliesSize;
        ally.stats.healFullEnergy();
        this.allies.push(ally);
    }

    private playerIsInbound(x: number, y: number): boolean {
        return x >= this.x + Combat.PADDING && 
               x <= this.x + Combat.PADDING + this.playerSize &&
               y >= this.abilitiesY - Combat.PADDING - this.playerSize &&
               y <= this.abilitiesY - Combat.PADDING;
    }

    public getPlayerAndAllies(): CombatEntity[] {
        return ['player', ...this.allies];
    }
}
