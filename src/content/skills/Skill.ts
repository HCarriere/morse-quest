
/**
 * "Passive" skills
 */
export abstract class Skill {
    constructor(){}

    public abstract name: string;

    public abstract description: string;

    public slots = 1;
}