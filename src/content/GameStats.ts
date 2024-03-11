import { GameGraphics } from "@game/system/GameGraphics";
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
        GameGraphics.ctx.font = '14px monospace';
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
     * We don't want animation everytime
     */
    public cancelAnimation() {
        this.animTargetHealth = this.hp;
    }
}