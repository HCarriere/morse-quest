import { Pool } from "@game/core/Pool";
import { Skill } from "../skills";
import { Spell } from "../spells";
import { Icon } from "@game/system/GameGraphics";

export abstract class Class {
    public abstract name: string;
    public abstract icon: Icon;
    public abstract baseHealth: number;
    public abstract initialSpells: Spell[];
    public abstract spells: Spell[][];
    public abstract skills: Skill[][];
    private spellPool: Pool<Spell> = new Pool<Spell>('Spell Pool');
    private levelTracker: number = 1;
    public init(): void {
        this.spellPool.add(this.spells[0]);
    }
    public onLevelUp(): void {
        this.levelTracker++;
        if (this.spells.length >= this.levelTracker) this.spellPool.add(this.spells[this.levelTracker - 1]);
    }
    public getRandomSpellFromPool(): Spell {
        return this.spellPool.drawRandomItem();
    }
}