import { Modale, ModaleContent } from "@game/core/Modale";
import { Input } from "../components/Input";
import { Button, ButtonStyle } from "@game/interface/components/Button";
import { Graphics } from "@game/core/Graphics";

export class InputModale extends ModaleContent {
    private input: Input;
    private okBtn: Button;
    private btnStyle: ButtonStyle;
    private okBtnWidth: number;
    private okBtnHeight: number;
    private okBtnPadding: number;
    constructor(private text: string, private onOk: (value: string) => void, private valideChar: (char: string) => boolean = () => true) {
        super();
    }
    protected initContent(): void {
        this.btnStyle = {
            strokeColor: 'white',
            textSize: 20,
            color: 'white',
            colorHover: 'grey',
            textColor: 'black'
        };
        this.okBtnWidth = 200;
        this.okBtnHeight = 50;
        this.okBtnPadding = 10;
        this.input = new Input(this.x + 10, this.y + this.height / 2 - 25, this.width - 20, 50, (char: string) => this.valideChar(char));
        this.okBtn = new Button(
            this.x + this.width - (this.okBtnWidth + this.okBtnPadding),
            this.y + this.height - (this.okBtnHeight + this.okBtnPadding),
            this.okBtnWidth,
            this.okBtnHeight,
            () => {
                this.onOk(this.input.value);
                Modale.closeModale();
            },
            {
                ...this.btnStyle,
                text: 'OK'
            }
        );
        this.modaleElements = [this.input, this.okBtn];
    }
    protected resizeContent(): void {
        this.input.x = this.x + 10;
        this.input.y = this.y + this.height / 2 - 25;
        this.input.width = this.width - 20;
        this.okBtn.x = this.x + this.width - (this.okBtnWidth + this.okBtnPadding);
        this.okBtn.y = this.y + this.height - (this.okBtnHeight + this.okBtnPadding);
    }
    protected displayCustomContent(): void {
        Graphics.ctx.save();
        Graphics.ctx.fillStyle = 'white';
        Graphics.ctx.textAlign = "center";
        Graphics.ctx.font = 50 + "px Luminari";
        Graphics.ctx.textBaseline = "middle";
        Graphics.ctx.fillText(this.text, this.x + this.width / 2, this.y + 35);
        Graphics.ctx.restore();
    }
}