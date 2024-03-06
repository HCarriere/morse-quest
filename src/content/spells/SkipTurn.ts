import { GameStats } from "../GameStats";
import { Spell, TargetType } from "../Spell";

export class SpellSkipTurn extends Spell {
    public name = "Passer son tour";
    public description = "Passe le tour.";
    public manaCost = 0;
    
    public icon: any;
    public targetType = TargetType.NoTarget;
    public frameAnimationMax = 10;

    public effect(target: GameStats): void {}

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
        // TODO sablier ?
    }
}