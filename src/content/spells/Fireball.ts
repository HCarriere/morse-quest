import { GameStats } from "../GameStats";
import { Spell, DamageType, TargetType } from "../Spell";

export class Fireball extends Spell {
    public name = "Boule de feu";
    public description = "Envoie une boule de feu sur un ennemi, infligeant des dégats de feu.";
    public manaCost = 20;
    
    public icon: any;
    public animation: any;
    public targetType: TargetType;

    public effect(target: GameStats): void {
        target.damage(50, DamageType.Fire);
    }
}