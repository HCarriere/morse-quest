import { Icon } from "@game/system/GameGraphics";
import { GameStats } from "../GameStats";

/**
 * "Passive" skills
 */
export abstract class Skill {
    constructor(){}

    public abstract name: string;

    public abstract description: string[];

    public abstract icon: Icon;

    public slots = 1;

    public isActive = false;

    /**
     * Happens when the skill is selected
     * @param stats 
     */
    public abstract onEnable(stats: GameStats);

    /**
     * Happends when the skill is disabled
     * @param stats 
     */
    public abstract onDisable(stats: GameStats);
}