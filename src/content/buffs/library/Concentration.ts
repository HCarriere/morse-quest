import { GameStats } from "@game/content/GameStats";
import { Buff } from "../Buff";
import { DamageType } from "@game/content/spells";
import { GameGraphics } from "@game/system/GameGraphics";

export class BuffConcentration extends Buff {
    public name = "Concentration sur une action";
    public description = [
        'Tant que le lanceur est concentré et jusqu\'à la fin de la durée, une action s\'effectue au début de chaque tour.',
        'Si le lanceur reçoit des dégâts, sa concentration peut être interrompue.',
        `Action : ${this.actionName}`,
    ];
    public stackMax = 1;

    constructor(
        public icon: {text: string, color: string},
        public duration: number,
        public actionName: string,
        public action: () => void,
    ) {
        super();
    }

    public onBuffed(stats: GameStats) {
        // Nothing to do on buffed
    }

    public onBuffRecipientDamaged(stats: GameStats, damage: number, type: DamageType): void {
        // If the buff recipient is damaged, it may lose concentration
        if (damage > 0) {
            // Chance to lose concentration is 50%
            if (Math.random() < 0.5) {
                this.duration = 0; // Remove the buff
                GameGraphics.addInterfaceParticle({
                    x: stats.x - stats.size / 2,
                    y: stats.y - stats.size / 2,
                    text: 'Concentration interrompue',
                    color: '#666',
                    size: 25,
                    life: 120,
                    vx: Math.random()*4-2,
                    vy: Math.random()*2-6,
                    friction: 0.97,
                });
            }
        }
    }

    public onNewTurn(stats: GameStats) {
        this.action();
    }

    public onUnbuffed(stats: GameStats) {
        // Nothing to do on unbuffed
    }
}