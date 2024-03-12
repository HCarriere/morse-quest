import { Skill } from "@game/content/skills/Skill";
import { GameController } from "@game/system/GameController";
import { EngineObject } from "@game/core/EngineObject";
import { GameGraphics } from "@game/system/GameGraphics";

export class SkillButton extends EngineObject {
    
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private skill: Skill;
    private index: number;

    private onClick: (index: number, sb: SkillButton) => void;

    private onHover: (skill: Skill) => void;

    constructor(
        x: number, y: number, width: number, height: number, skill: Skill, 
        index: number, onClick: (n: number, sb: SkillButton) => void, onHover: (skill: Skill) => void,
        ) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.skill = skill;
        this.index = index;
        this.onClick = onClick;
        this.onHover = onHover;
    }

    public display() {
        // background
        GameGraphics.ctx.fillStyle = '#000000';
        if (this.isInbound(GameController.mouseX, GameController.mouseY)) {
            GameGraphics.ctx.fillStyle = '#222222';
            this.onHover(this.skill);
        }
        GameGraphics.ctx.fillRect(this.x, this.y, this.width, this.height);

        // border 
        if (!this.skill.isActive) {
            GameGraphics.ctx.lineWidth = 1;
            GameGraphics.ctx.strokeStyle = '#DDDDDD';
        } else {
            
            GameGraphics.ctx.lineWidth = 2;
            GameGraphics.ctx.strokeStyle = 'yellow';
        }
        GameGraphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // icon
        GameGraphics.displayIcon(this.skill.icon, this.x + 5, this.y + 5, 18);

        // title
        GameGraphics.ctx.font = "14px "+GameGraphics.FONT;
        GameGraphics.ctx.fillStyle = 'white';
        GameGraphics.ctx.textAlign = "right";
        GameGraphics.ctx.textBaseline = "top";
        GameGraphics.ctx.fillText(this.skill.name, this.x + this.width - 5, this.y + 5);
    
        // cooldowns
        GameGraphics.ctx.textBaseline = "bottom";
        GameGraphics.ctx.fillStyle = 'yellow';
        GameGraphics.ctx.fillText(this.skill.slots + ' emplacement(s)', this.x + this.width - 5, this.y + this.height - 5);
    }



    public mousePressed(x: number, y: number): void {
        if (this.isInbound(x, y)) {
            this.onClick(this.index, this);
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