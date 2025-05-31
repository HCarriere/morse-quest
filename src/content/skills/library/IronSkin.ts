import { GameStats } from "@game/content/GameStats";
import { Skill } from "../Skill";

export class SkillIronSkin extends Skill {
    

    public power: number;
    
    public name: string;
    public description: string[];
    public icon = {text: "🜟", color: '#666'};
    public slots: number;
    
    constructor(level = 1) {
        super();
        if (level == 1) {
            this.power = 1;
            this.name = `Peau de fer I`;
            this.description = ["Votre peau est aussi dure que l'acier.", `Réduit les dégats subis de ${this.power}.`]
            this.slots = 1;
        } else if (level == 2) {
            this.power = 3;
            this.name = `Peau de fer II`;
            this.icon.text = "🜟🜟";
            this.description = ["Votre peau est aussi dure que l'acier.", `Réduit les dégats subis de ${this.power}.`]
            this.slots = 2;
        } else {
            this.power = 6;
            this.name = `Peau de fer III`;
            this.icon.text = "🜟🜟🜟";
            this.description = ["Votre peau est aussi dure que l'acier.", `Réduit les dégats subis de ${this.power}.`]
            this.slots = 3;
        }
    }
    
    public onEnable(stats: GameStats) {
        stats.flatDamageReductor+=this.power;
    }
    public onDisable(stats: GameStats) {
        stats.flatDamageReductor-=this.power;
    }
}