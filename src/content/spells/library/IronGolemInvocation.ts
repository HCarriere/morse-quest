import { GameInterface } from "@game/interface/GameInterface";
import { Spell, SpellType, TargetType } from "../Spell";
import { Ally } from "@game/content/Ally";
import { IronGolem } from "@game/content/skins";
import { GameStats } from "@game/content/GameStats";
import { SpellFireball } from "./Fireball";

export class SpellIronGolemInvocation extends Spell {
    public name = "Golem de fer";
    public description = ["Un golem de fer robuste et puissant."];
    public energyCost = 4;
    public cooldown = 10;

    public spellType = SpellType.Invocation;

    public icon = {text: "🪨", color: 'gray'};
    public targetType = TargetType.NoTarget;
    public frameAnimationMax = 1;

    public animate(frameLeft: number, targets: {x: number, y: number}[], orig: {x: number, y: number}, size: number): void {
        if (frameLeft == 1) {
            GameInterface.addAllyToCombat(new Ally('Golem de fer', new IronGolem(), new GameStats([new SpellFireball(300)], 200), []));
        }
    }
}