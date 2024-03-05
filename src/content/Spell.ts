import { GameStats } from "./GameStats";

export enum TargetType {
    NoTarget = 0,
    Self = 1,
    Single = 2,
    Multiple = 3
}

export enum DamageType {
    Strike = 1,
    Piercing = 2,
    Slashing = 3,
    Fire = 4,
    Ice = 5,
    Earth = 6,
    Lightning = 7,
    Dark = 8,
    Light = 9,
}

export abstract class Spell {
    
    constructor(){}
    /**
     * User friendly name
     * 
     * "Fireball"
     */
    public abstract name: string;

    /**
     * User friendly description. Keep it short and explicative.
     * 
     * "Hurl a fireball at a single enemy, dealing fire damages"
     */
    public abstract description: string;

    /**
     * Can be 0.
     */
    public abstract manaCost: number;

    public abstract targetType: TargetType;

    public abstract icon: any;

    /**
     * effect to be played for *each* targets.
     * 
     * If there is no targets, *target* will be empty.
     * @param target 
     */
    public abstract effect(target: GameStats): void;

    /**
     * Player an animation (frameLeft = number of frame, until 0)
     * @param frameLeft 
     */
    //public abstract animate(frameLeft: number): void;
    
}

