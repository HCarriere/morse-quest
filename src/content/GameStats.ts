import { Graphics } from "@game/system/Graphics";
import { DamageType, Spell } from "./spells/Spell";
import { Skill } from "./skills/Skill";
import { InventorySlot, Item } from "./items/Item";
import { SpellFireball } from "./spells/library/Fireball";

/**
 * Represents game statistics (like strengh, life, etc ...)
 */
export class GameStats {

    private static HP_BAR_HEIGHT = 22;

    // current hp
    public hp: number;
    public mana: number;

    // base stats (no modifiers)
    public baseConstitution: number;
    public baseStrengh: number;
    public baseDexterity: number;
    public baseIntelligence: number;
    public baseWisdom: number;

    // multiply this to obtain final hp
    public classHpMultiplicator: number;

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
    public activeSkills: number[];
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
    
    constructor(mult = 1) {
        this.baseConstitution = 1*mult;
        this.baseStrengh = 1*mult;
        this.baseDexterity = 1*mult;
        this.baseIntelligence = 1*mult;
        this.baseWisdom = 1*mult;

        this.initiative = 1*mult;
        
        this.classHpMultiplicator = 1;
        
        this.hp = this.maxHp;
        this.mana = this.maxMana;

        this.targetXp = GameStats.calculateNextXpTarget(this.level + 1);
        
        this.cancelAnimation();

        this.spells = [
            new SpellFireball(),
        ];
    }

    public get maxHp(): number {
        return Math.floor((1 + this.baseConstitution) * 10 * this.classHpMultiplicator + 100);
    }

    public get maxMana(): number {
        return Math.floor((1 + this.baseWisdom) * 10 + 100);
    }

    public healFull() {
        this.hp = this.maxHp;
    }

    public healHp(amount: number) {
        this.hp += amount;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
    }

    public healMana(amount: number) {
        this.mana += amount;
        if (this.mana > this.maxMana) this.mana = this.maxMana;
    }

    public damage(amount: number, type: DamageType) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
    }

    /**
     * Tries to select an active.
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
        Graphics.ctx.lineWidth = 3;
        Graphics.ctx.strokeStyle = 'white';
        Graphics.ctx.fillStyle = 'green';
        Graphics.ctx.fillRect(x, y, this.animTargetHealth * size / this.maxHp, GameStats.HP_BAR_HEIGHT);
        Graphics.ctx.strokeRect(x, y, size, GameStats.HP_BAR_HEIGHT);
        
        // text
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.font = '14px '+ Graphics.FONT;
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = 'left'
        Graphics.ctx.textBaseline = 'top';
        Graphics.ctx.fillText(`${this.hp} / ${this.maxHp}`, x + 5, y + 5);

        if (this.animTargetHealth < this.hp - 1) {
            this.animTargetHealth += 2;
        } else if (this.animTargetHealth > this.hp + 1) {
            this.animTargetHealth -= 2;
        } else {
            this.animTargetHealth = this.hp;
        }
    }

    /**
     * We don't want animation everytime
     */
    public cancelAnimation() {
        this.animTargetHealth = this.hp;
    }
    
}