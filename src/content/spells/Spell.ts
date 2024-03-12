import { GameStats } from "@game/content/GameStats";
import { Icon } from "@game/system/GameGraphics";

export enum TargetType {
    NoTarget = 0,
    Self = 1,
    Single = 2,
    Multiple = 3, // Use targetMax
    AllEnemies = 4,
    All = 5,
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
    Acid = 10,
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
    public abstract description: string[];

    /**
     * Can be 0.
     */
    public abstract energyCost: number;

    public abstract targetType: TargetType;

    public abstract icon: Icon;

    public abstract frameAnimationMax: number;

    public abstract cooldown: number;

    public currentCooldown = 0;

    public isActive = false;

    public slots = 1;

    public targetMax: number;

    /**
     * effect to be played to targets.
     * 
     * If there is no targets, *target* will be empty.
     * @param target 
     */
    // public abstract effect(targets: GameStats[]): void;


    /**
     * Play an animation (frameLeft = number of frame, until 0)
     * @param frameLeft 
     * @param targets 
     * @param orig 
     * @param size 
     */
    public abstract animate(frameLeft: number, targets: {x: number, y: number, stat: GameStats}[], orig: {x: number, y: number}, size: number): void;
    

    public advanceCooldown() {
        if (this.currentCooldown > 0) this.currentCooldown--;
    }
}

