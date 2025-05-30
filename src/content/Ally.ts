import { GameStats } from "./GameStats";
import { Skill } from "./skills";
import { Skin } from "./skins/Skin";
import { Spell } from "./spells";

export class Ally {
    constructor(
        public name: string, 
        public skin: Skin, 
        public stats: GameStats,
        private skills: Skill[] = [],
    ) {
        for (let index = 0; index < this.stats.spells.length; index++) {
            this.stats.selectActiveSpell(index);
        }
        this.stats.skills = this.skills;
        for (let index = 0; index < this.stats.skills.length; index++) {
            this.stats.selectActiveSkill(index);
        }
    }

    /**
     * Display enemy on x,y NON RELATIVE, top left
     * @param x 
     * @param y 
     * @param size
     */
    public display() {
        this.skin.display(this.x - this.size/2, this.y - this.size/2, this.size);
    }

    /**
     * Returns true if x,y is inside button.
     * Used to select enemy for target selection.
     * @param x 
     * @param y 
     */
    public isInbound(x: number, y: number): boolean {
        return (x > this.x - this.size/2 && x < this.x + this.size/2 && 
                y > this.y - this.size/2 && y < this.y + this.size/2);
    }
    
    /**
     * Return if the enemy is dead
     */
    public get isDead(): boolean {
        return this.stats.hp <=0;
    }

    public get x() {
        return this.stats.x;
    }

    public get y() {
        return this.stats.y;
    }

    public get size() {
        return this.stats.size;
    }
}