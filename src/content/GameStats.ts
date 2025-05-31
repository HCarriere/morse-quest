import { GameGraphics } from "@game/system/GameGraphics";
import { DamageType, Spell } from "./spells/Spell";
import { Skill } from "./skills/Skill";
import { InventorySlot, Item } from "./items/Item";
import { Buff } from "./buffs/Buff";

/**
 * Represents game statistics (like strengh, life, etc ...)
 */
export class GameStats {

    private static HP_BAR_HEIGHT = 22;

    // for combat placement //
    public x: number;
    public y: number;
    public size: number;
    //////////////////////////

    /**
     * Current player hp
     */
    public hp: number;
    /**
     * Current player energy
     */
    public energy: number;

    public baseHp: number;
    public baseEnergy = 4;

    // advanced stats

    public flatDamageReductor = 0;
    public accuracy: number = 100; // 100% accuracy
    public evasion: number = 0; // 0% evasion

    /**
     * all the known spells
     */
    public spells: Spell[];
    // all the ACTIVE spells. Each number is an index of "this.spells"
    public activeSpells: number[] = [];
    public activeSpellScore = 0;
    public activeSpellsMax = 6;

    /**
     * all the known skills
     */
    public skills: Skill[];
    // all the active skills.
    public activeSkills: number[] = [];
    public activeSkillScore = 0;
    public passiveSkillsMax = 4;

    // unused inventory
    public inventory: Item[] = [];
    // equiped items
    public equipedItems: Map<InventorySlot, Item> = new Map<InventorySlot, Item>();

    
    /**
     * Buffs and debuff
    */
   public buffs: Buff[] = [];
   
   // animations values
    private animTargetHealth: number;
    private animTargetEnergy: number;
    
    constructor(spells: Spell[] = [], baseHp = 30) {
        this.baseHp = baseHp;

        this.hp = this.maxHp;
        this.energy = this.maxEnergy;
        
        this.cancelAnimation();

        this.spells = spells;

        this.skills = [];
    }

    public get maxHp(): number {
        return this.baseHp;
    }

    public get maxEnergy(): number {
        return this.baseEnergy;
    }

    public healFullHp() {
        this.hp = this.maxHp;
    }

    public healFullEnergy() {
        this.energy = this.maxEnergy;
    }

    public healHp(amount: number) {
        this.hp += amount;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
    }

    public healEnergy(amount: number) {
        this.energy += amount;
        if (this.energy > this.maxEnergy) this.energy = this.maxEnergy;
    }

    public damage(amount: number, type: DamageType) {
        // notify hit to buffs
        for (const buff of this.buffs) {
            buff.onBuffRecipientHit(this, amount, type);
        }

        // apply reduction
        const modAmount = Math.max(0, amount - this.flatDamageReductor);

        // notify damage to buffs
        for (const buff of this.buffs) {
            buff.onBuffRecipientDamaged(this, modAmount, type);
        }
        
        // remove hp
        this.hp -= modAmount;
        // constrain to 0
        this.hp = Math.max(this.hp, 0);

        GameGraphics.addInterfaceParticle({
            life: 120,
            size: 25,
            color: "red",
            text: `-${modAmount} ♡`,
            x: this.x,
            y: this.y,
            vx: Math.random()*4-2,
            vy: Math.random()*2-6,
            friction: 0.97,
        });
    }

    /**
     * Apply a buff, with that many stacks.
     * @param buff 
     * @param stack 
     */
    public applyBuff(buff: Buff, stacks: number) {
        const sBuff = this.buffs.find(b => b.name == buff.name);
        if (sBuff) {
            // already applied
            sBuff.applyNewStack(this, stacks);
        } else {
            buff.onBuffed(this);
            if (stacks > 1) {
                buff.applyNewStack(this, stacks - 1);
            }
            this.buffs.push(buff);
        }
    }

    /**
     * Advance buffs depletion AND plays their "onnewTurn" event.
     * To be played each new turn.
     */
    public advanceBuffDepletion() {
        for (const b of this.buffs) {
            b.onNewTurn(this);
            b.duration -= 1;
        }
        this.clearNecessaryBuffs();
    }

    /**
     * Clear buffs that have no more duration OR no more stacks
     */
    public clearNecessaryBuffs() {
        for (let i = this.buffs.length - 1; i >= 0; i--) {
            if (this.buffs[i].duration == 0 
                || this.buffs[i].stack == 0) {
                this.buffs[i].onUnbuffed(this);
                this.buffs.splice(i, 1);
            }
        }
    }

    /**
     * Force clear af all buffs
     */
    public clearAllBuffs() {
        for (let i = this.buffs.length - 1; i >= 0; i--) {
            this.buffs[i].onUnbuffed(this);
        }
        this.buffs = [];
    }

    /**
     * Tries to activate a spell.
     * Will do nothing if spell is already active, or no free slots
     * @param index 
     * @returns true if success
     */
    public selectActiveSpell(index: number): boolean {
        if (this.activeSpellScore >= this.activeSpellsMax) return false;
        if (this.activeSpells.includes(index)) return false;
        this.activeSpells.push(index);
        this.activeSpellScore += 1;
        this.spells[index].isActive = true;
        return true;
    }

    /**
     * Unselect a spell
     * @param index
     */
    public unselectActiveSpell(index: number) {
        const i = this.activeSpells.indexOf(index);
        if (i < 0) return;
        this.activeSpells.splice(i, 1);
        this.activeSpellScore -= 1;
        this.spells[index].isActive = false;
    }

    /**
     * Toggle spell selection for given spell
     * @param index 
     * @returns true if the spell is now active
     */
    public toggleActiveSpell(index: number): boolean {
        if (this.activeSpells.includes(index)) {
            // disable
            this.unselectActiveSpell(index);
            return false;
        } else {
            // enable
            return this.selectActiveSpell(index);
        }
    }

    /**
     * Tries to activate a skill
     * Will do nothing if spell is already active, or no free slots
     * @param index 
     * @returns true if success
     */
    public selectActiveSkill(index: number): boolean {
        if (this.activeSkillScore + this.skills[index].slots > this.passiveSkillsMax) return false;
        if (this.activeSkills.includes(index)) return false;
        this.activeSkills.push(index);
        this.activeSkillScore += this.skills[index].slots;
        this.skills[index].isActive = true;
        this.skills[index].onEnable(this);
        return true;
    }

    /**
     * Deactivate a skill
     * @param index
     */
    public unselectActiveSkill(index: number) {
        const i = this.activeSkills.indexOf(index);
        if (i < 0) return;
        this.activeSkills.splice(i, 1);
        this.activeSkillScore -= this.skills[index].slots;
        this.skills[index].isActive = false;
        this.skills[index].onDisable(this);
    }

    /**
     * Toggle skill activation
     * @param index 
     * @returns true if the skill is now active
     */
    public toggleActiveSkill(index: number): boolean {
        if (this.activeSkills.includes(index)) {
            // disable
            this.unselectActiveSkill(index);
            return false;
        } else {
            // enable
            return this.selectActiveSkill(index);
        }
    }


    public resetAllCooldowns() {
        for (const s of this.spells) {
            s.currentCooldown = 0;
        }
    }

    // Animations

    /**
     * Displays HP
     * x and y are not relative
     * top left corner
     * @param x 
     * @param y 
     * @param size 
     */
    public displayHp(x: number, y: number, size: number) {
        // hp bar
        // GameGraphics.ctx.lineWidth = 3;
        // GameGraphics.ctx.strokeRect(x, y, size, GameStats.HP_BAR_HEIGHT);
        // GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.fillStyle = 'green';
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.roundRect(x, y, this.animTargetHealth * size / this.maxHp, GameStats.HP_BAR_HEIGHT, [10,10,10,10]);
        GameGraphics.ctx.fill();
        // text
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.font = '14px '+ GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = 'left'
        GameGraphics.ctx.textBaseline = 'top';
        GameGraphics.ctx.fillText(`${this.hp} / ${this.maxHp}`, x + 10, y + 5);

        if (this.animTargetHealth < this.hp - 1) {
            this.animTargetHealth += 2;
        } else if (this.animTargetHealth > this.hp + 1) {
            this.animTargetHealth -= 2;
        } else {
            this.animTargetHealth = this.hp;
        }
    }

    /**
     * Displays HP
     * x and y are not relative
     * top left corner
     * @param x 
     * @param y 
     * @param size 
     */
    public displayEnergy(x: number, y: number, size: number) {
        // hp bar
        // GameGraphics.ctx.lineWidth = 3;
        // GameGraphics.ctx.strokeStyle = 'white';
        // GameGraphics.ctx.strokeRect(x, y, size, GameStats.HP_BAR_HEIGHT);
        GameGraphics.ctx.beginPath();
        GameGraphics.ctx.fillStyle = 'rgb(5,118,231)';
        GameGraphics.ctx.roundRect(x, y, this.animTargetEnergy * size / this.maxEnergy, GameStats.HP_BAR_HEIGHT, [10,10,10,10]);
        GameGraphics.ctx.fill();
        
        // text
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.font = '14px '+ GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = 'left'
        GameGraphics.ctx.textBaseline = 'top';
        GameGraphics.ctx.fillText(`${this.energy} / ${this.maxEnergy}`, x + 10, y + 5);

        if (this.animTargetEnergy < this.energy - 1) {
            this.animTargetEnergy += 2;
        } else if (this.animTargetEnergy > this.energy + 1) {
            this.animTargetEnergy -= 2;
        } else {
            this.animTargetEnergy = this.energy;
        }
    }

    /**
     * We don't want animation everytime
     */
    public cancelAnimation() {
        this.animTargetHealth = this.hp;
        this.animTargetEnergy = this.energy;
    }
    
}
