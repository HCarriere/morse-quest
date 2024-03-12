import { GameGraphics } from "@game/system/GameGraphics";
import { DamageType, Spell } from "./spells/Spell";
import { Skill } from "./skills/Skill";
import { InventorySlot, Item } from "./items/Item";
import { SpellFireball } from "./spells/library/Fireball";

/**
 * Represents game statistics (like strengh, life, etc ...)
 */
export class GameStats {

    private static HP_BAR_HEIGHT = 22;

    /**
     * Current player hp
     */
    public hp: number;
    /**
     * Current player energy
     */
    public energy: number;

    // base stats (no modifiers)
    public baseConstitution: number;
    public baseStrengh: number;
    public baseDexterity: number;
    public baseIntelligence: number;
    public baseWisdom: number;

    // advanced stats

    // multiply this to obtain final hp
    public classHpMultiplicator: number;

    public flatDamageReductor = 0;

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

    public initiative: number;

    // unused inventory
    public iventory: Item[];

    // equiped items
    public equiped: Map<InventorySlot, Item> = new Map<InventorySlot, Item>();

    public currentXp = 0;
    public targetXp: number;
    public level = 1;

    public gold = 0;
    // animations values

    private animTargetHealth: number;
    private animTargetEnergy: number;
    
    constructor(mult = 1) {
        this.baseConstitution = 1*mult;
        this.baseStrengh = 1*mult;
        this.baseDexterity = 1*mult;
        this.baseIntelligence = 1*mult;
        this.baseWisdom = 1*mult;

        this.initiative = 1*mult;
        
        this.classHpMultiplicator = 1;
        
        this.hp = this.maxHp;
        this.energy = this.maxEnergy;

        this.targetXp = GameStats.calculateNextXpTarget(this.level + 1);
        
        this.cancelAnimation();

        this.spells = [
            new SpellFireball(),
        ];

        this.skills = [];
    }

    public get maxHp(): number {
        return Math.floor((1 + this.baseConstitution) * 10 * this.classHpMultiplicator + 100);
    }

    public get maxEnergy(): number {
        return Math.floor((1 + this.baseWisdom) + 4);
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
        amount = Math.max(0, amount - this.flatDamageReductor);
        this.hp -= amount;
        this.hp = Math.max(this.hp, 0);
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



    private static calculateNextXpTarget(nextLevel: number): number {
        return (nextLevel-1) * 1000;
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
        GameGraphics.ctx.lineWidth = 3;
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.fillStyle = 'green';
        GameGraphics.ctx.fillRect(x, y, this.animTargetHealth * size / this.maxHp, GameStats.HP_BAR_HEIGHT);
        GameGraphics.ctx.strokeRect(x, y, size, GameStats.HP_BAR_HEIGHT);
        
        // text
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.font = '14px '+ GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = 'left'
        GameGraphics.ctx.textBaseline = 'top';
        GameGraphics.ctx.fillText(`${this.hp} / ${this.maxHp}`, x + 5, y + 5);

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
        GameGraphics.ctx.lineWidth = 3;
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.fillStyle = 'rgb(5,118,231)';
        GameGraphics.ctx.fillRect(x, y, this.animTargetEnergy * size / this.maxEnergy, GameStats.HP_BAR_HEIGHT);
        GameGraphics.ctx.strokeRect(x, y, size, GameStats.HP_BAR_HEIGHT);
        
        // text
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.font = '14px '+ GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = 'left'
        GameGraphics.ctx.textBaseline = 'top';
        GameGraphics.ctx.fillText(`${this.energy} / ${this.maxEnergy}`, x + 5, y + 5);

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
    }
    
}
