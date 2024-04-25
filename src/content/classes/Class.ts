import { Skill } from "../skills";
import { Spell } from "../spells";

export abstract class Class {
    public abstract baseHealth: number;
    public abstract initialSpells: Spell[];
    public abstract spells: Spell[][];
    public abstract skills: Skill[][];
    private spellPool: Spell[] = [];
    private levelTracker: number = 1;
    public init(): void {
        this.spellPool.push(...this.spells[0]);
        console.log('Spell Pool', this.spellPool);
    }
    public onLevelUp(): void {
        this.levelTracker++;
        if (this.spells.length >= this.levelTracker) this.spellPool.push(...this.spells[this.levelTracker - 1]);
        console.log('Spell Pool', this.spellPool);
    }
    public getRandomSpellFromPool(): Spell {
        if (this.spellPool.length == 0) {
            return null;
        }
        let spellIndex = Math.floor(Math.random() * this.spellPool.length);
        let spell = this.spellPool.splice(spellIndex, 1)[0];
        console.log('Spell Pool', this.spellPool);
        return spell;
    }
}