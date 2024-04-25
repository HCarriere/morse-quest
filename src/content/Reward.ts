import { Enemy } from "./Enemy";
import { Item } from "./items/Item";

export class Reward {
    constructor(
        public gold: number,
        public xp: number,
        public items: Item[],
    ) {}

    public static fromEnemies(enemies: Enemy[]): Reward {
        let gold = 0;
        let xp = 0;
        let items = [];
        enemies.forEach(enemy => {
            gold += enemy.dropTable?.gold;
            xp += enemy.dropTable?.xp;
            let droppedItems = enemy.dropTable?.drops.filter(drop => drop.chance > Math.random()).map(drop => drop.item);
            if (!!droppedItems) {
                items.push(...droppedItems);
            }
        });
        return new Reward(gold, xp, items);
    }
}