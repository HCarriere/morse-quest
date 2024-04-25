import { Reward } from "@game/content/Reward";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";
import { Button } from "./components/Button";
import { Text } from "./components/Text";


export class RewardScreen extends EngineObject {
    private title: Text;
    private gold: Text;
    private xp: Text;
    private items: Text[];
    private confirmButton: Button;
    private static BUTTON_WIDTH = 100;
    private static BUTTON_HEIGHT = 50;
    private static GOLD_XP_HEIGHT = 30;
    private static TITLE_HEIGHT = 50;
    constructor(
        public reward: Reward,
        public x: number,
        public y: number,
        public width: number,
        public height: number,
        public onConfirm: () => void,
    ) {
        super();
        this.title = new Text(x + 20, y + 20, width - 40, RewardScreen.TITLE_HEIGHT, 'Victory', 'white');
        this.gold = new Text(x + 20, y + 20 + RewardScreen.TITLE_HEIGHT + 20, width/2 - 40, RewardScreen.GOLD_XP_HEIGHT, `Gold : ${reward.gold}`, 'orange');
        this.xp = new Text(x + width/2 + 20, y + 20 + RewardScreen.TITLE_HEIGHT + 20, width/2 - 40, RewardScreen.GOLD_XP_HEIGHT, `XP : ${reward.xp}`, 'orange');
        this.rebuildItems();
        this.confirmButton = new Button(
            x + width - RewardScreen.BUTTON_WIDTH - 20,
            y + height - RewardScreen.BUTTON_HEIGHT - 20,
            RewardScreen.BUTTON_WIDTH,
            RewardScreen.BUTTON_HEIGHT,
            () => onConfirm(),
            {
                color: 'black',
                strokeColor: 'white',
                textColor: 'white',
                colorHover: '#332222',
                text: 'OK'
            }
        )
        this.resize();
    }
    public display() {
        GameGraphics.ctx.lineWidth = 1;
        GameGraphics.ctx.fillStyle = '#020202';
        GameGraphics.ctx.strokeStyle = 'white';
        GameGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);
        GameGraphics.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.title.display();
        this.gold.display();
        this.xp.display();
        this.items.forEach(item => item.display());
        this.confirmButton.display();
    }
    public resize(): void {
        this.confirmButton.x = this.x + this.width - RewardScreen.BUTTON_WIDTH - 20;
        this.confirmButton.y = this.y + this.height - RewardScreen.BUTTON_HEIGHT - 20;
        this.title.width = this.width - 40;
        this.gold.width = this.width/2 - 40;
        this.xp.x = this.x + this.width/2 + 20;
        this.xp.width = this.width/2 - 40;
        this.rebuildItems();
    }
    public mousePressed(x: number, y: number): void {
        this.confirmButton.mousePressed(x, y);
    }
    private rebuildItems(): void {
        let itemX = this.x + 50;
        let itemY = this.y + 20 + RewardScreen.TITLE_HEIGHT + 20 + RewardScreen.GOLD_XP_HEIGHT + 20;
        let itemHeight = 20;
        let itemWidth = 300;
        this.items = this.reward.items.map(item => {
            let text = new Text(itemX, itemY, itemWidth, itemHeight, `- ${item.name}`, 'white', 'left', 'middle');
            itemY += (itemHeight + 20);
            if (itemY + itemHeight > this.y + this.height - RewardScreen.BUTTON_HEIGHT - 40) {
                itemY = this.y + 20 + RewardScreen.TITLE_HEIGHT + 20 + RewardScreen.GOLD_XP_HEIGHT + 20;
                itemX += (itemWidth + 20);
            }
            return text;
        });
    }
}