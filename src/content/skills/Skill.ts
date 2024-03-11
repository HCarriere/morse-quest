import { Icon } from "@game/system/Graphics";
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

    public abstract onEnable(stats: GameStats);
    public abstract onDisable(stats: GameStats);
}