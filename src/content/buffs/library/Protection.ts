import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";

export class BuffProtection extends Buff {
    public name = "Protection";
    public description = ['Vous protège de 1 dégat par pile.'];
    public icon = {text: "🜟", color: '#666'};
    public stackMax = 100;

    public onBuffed(stats: GameStats) {
        stats.flatDamageReductor += 1;
        console.log(stats.flatDamageReductor)
    }

    public onUnbuffed(stats: GameStats) {
        stats.flatDamageReductor -= 1;
    }

    public onNewTurn(stats: GameStats) {}

}