import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";

export class DebufBlind extends Buff {
    public name = "Blind";
    public description = ['Précision réduite de 50%'];
    public icon = {text: "👁️", color: '#666'};
    public duration = 2;
    public stackMax = 1;

    public onBuffed(stats: GameStats) {
        stats.accuracy -= 50;
    }

    public onUnbuffed(stats: GameStats) {
        stats.accuracy += 50;
    }

}