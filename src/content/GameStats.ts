import { Graphics } from "@game/system/Graphics";
import { DamageType, Spell } from "./Spell";
import { SpellLibrary } from "./SpellLibrary";

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

    public spells: Spell[];

    public initiative: number;

    private animTargetHealth: number;
    
    constructor() {
        this.baseConstitution = 1;
        this.baseStrengh = 1;
        this.baseDexterity = 1;
        this.baseIntelligence = 1;
        this.baseWisdom = 1;

        this.initiative = 1;
        
        this.classHpMultiplicator = 1;
        
        this.hp = this.maxHp;
        this.mana = this.maxMana;
        
        this.cancelAnimation();

        this.spells = [
            SpellLibrary.Skipturn,
            SpellLibrary.Fireball,
        ];
    }

    public get maxHp(): number {
        return Math.floor((1 + this.baseConstitution) * 10 * this.classHpMultiplicator + 100);
    }

    public get maxMana(): number {
        return Math.floor((1 + this.baseWisdom) * 10 + 100);
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
        Graphics.ctx.font = '14px monospace';
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