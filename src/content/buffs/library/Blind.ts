import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";

export class DebufBlind extends Buff {
    public debuff = true;
    public name = "Blind";
    public description = ['Précision réduite de 50%'];
    public icon = {text: "👁️", color: '#666'};
    public duration = 2; // Debuff need +1 duration to account for the turn it is applied
    public stackMax = 2;
    private blinded = false;

    public onBuffed(stats: GameStats) {
        if (this.blinded) {
            this.duration = 2; // Reset duration if already blinded
            this.stack--; // Keep one stack
            return;
        }
        stats.accuracy -= 50;
        this.blinded = true;
    }

    public onUnbuffed(stats: GameStats) {
        stats.accuracy += 50;
    }

}