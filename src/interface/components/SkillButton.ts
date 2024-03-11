import { Skill } from "@game/content/skills/Skill";
import { Controller } from "@game/system/Controller";
import { GameObject } from "@game/system/GameObject";
import { Graphics } from "@game/system/Graphics";

export class SkillButton extends GameObject {
    
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
        Graphics.ctx.fillStyle = '#000000';
        if (this.isInbound(Controller.mouseX, Controller.mouseY)) {
            Graphics.ctx.fillStyle = '#222222';
            this.onHover(this.skill);
        }
        Graphics.ctx.fillRect(this.x, this.y, this.width, this.height);

        // border 
        if (!this.skill.isActive) {
            Graphics.ctx.lineWidth = 1;
            Graphics.ctx.strokeStyle = '#DDDDDD';
        } else {
            
            Graphics.ctx.lineWidth = 2;
            Graphics.ctx.strokeStyle = 'yellow';
        }
        Graphics.ctx.strokeRect(this.x, this.y, this.width, this.height);

        // icon
        Graphics.displayIcon(this.skill.icon, this.x + 5, this.y + 5, 18);

        // title
        Graphics.ctx.font = "14px "+Graphics.FONT;
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "right";
        Graphics.ctx.textBaseline = "top";
        Graphics.ctx.fillText(this.skill.name, this.x + this.width - 5, this.y + 5);
    
        // cooldowns
        Graphics.ctx.textBaseline = "bottom";
        Graphics.ctx.fillStyle = 'yellow';
        Graphics.ctx.fillText(this.skill.slots + ' emplacement(s)', this.x + this.width - 5, this.y + this.height - 5);
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