import { GameStats } from "@game/content/GameStats";
import { Spell, TargetType } from "../Spell";

export class SpellSkipTurn extends Spell {
    public name = "Passer son tour";
    public description = "Passe le tour.";
    public manaCost = 0;
    
    public icon = {text: "S", color: 'grey'};
    public targetType = TargetType.NoTarget;
    public frameAnimationMax = 30;
    public cooldown = 1;

    public effect(targets: GameStats[]): void {}

    
    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
        // TODO sablier ?
    }
}