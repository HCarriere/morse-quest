import { GameController } from "@game/system/GameController";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";
import { Class } from "@game/content/classes";

export class ClassButton extends EngineObject {
    private selected: boolean = false;

    constructor(
        public x: number, public y: number, public width: number, public height: number, public btnClass: Class, 
        public onClick: (btnClass: Class) => void, public onHover: (btnClass: Class) => void,
        ) {
        super();
    }

    public display() {
        GameGraphics.ctx.save();

        // background
        GameGraphics.ctx.fillStyle = '#000000';
        if (this.isInbound(GameController.mouseX, GameController.mouseY)) {
            GameGraphics.ctx.fillStyle = '#222222';
            this.onHover(this.btnClass);
        }
        GameGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);

        // border 
        if (!this.selected) {
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.strokeStyle = '#DDDDDD';
        } else {
            
            GameGraphics.ctx.lineWidth = 2;
            GameGraphics.ctx.strokeStyle = 'lightgreen';
        }
        GameGraphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // icon
        GameGraphics.displayIcon(this.btnClass.icon, this.x + 5, this.y + 5, 18);

        // title
        GameGraphics.ctx.font = "14px " + GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = "right";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(this.btnClass.name, this.x + this.width - 5, this.y + 5);
        
        GameGraphics.ctx.restore();
    }



    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.selected = true;
            this.onClick(this.btnClass);
        }
    }

    /**
     * Returns true if x,y is inside button
     * @param x 
     * @param y 
     */
    private isInbound(x: number, y: number): boolean {
        return (x > this.x && x < this.x + this.width && 
                y > this.y && y < this.y + this.height);
    }

}
