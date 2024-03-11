import { Icon } from "@game/system/Graphics";

/**
 * "Passive" skills
 */
export abstract class Skill {
    constructor(){}

    public abstract name: string;

    public abstract description: string;

    public abstract icon: Icon;

    public slots = 1;
}