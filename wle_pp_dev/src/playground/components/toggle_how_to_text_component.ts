import { Component, Object3D, TextComponent } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor } from "@wonderlandengine/components";
import { CursorButtonActionsHandler, CursorButtonComponent } from "wle-pp";
import { AnimatedNumber, AnimatedNumberParams } from "wle-pp/gameplay/cauldron/animated_number.js";

export class ToggleHowToTextComponent extends Component implements CursorButtonActionsHandler {
    public static override TypeName = "toggle-how-to-text";

    @property.object()
    private _myTextObject!: Object3D;

    private readonly _myAnimatedScale!: AnimatedNumber;

    private _myTextVisible: boolean = true;

    public override init(): void {
        // Just to show how to use the cursor button handler from the class
        const textComponents = this.object.pp_getComponents(TextComponent);
        let visible = true;
        const switchButtonTextHandler = {
            onUp: function (): boolean {
                let textToSet = "Show";
                if (visible) {
                    visible = false;
                } else {
                    visible = true;
                    textToSet = "Hide";
                }

                for (const textComponent of textComponents) {
                    textComponent.text = textToSet;
                }

                return false;
            }
        };

        CursorButtonComponent.addButtonActionHandler("switch-button-text", switchButtonTextHandler);
    }

    public override start(): void {
        const animatedScaleParams = new AnimatedNumberParams();
        animatedScaleParams.myInitialValue = 1;
        animatedScaleParams.myAnimationSeconds = 0.5;
        (this._myAnimatedScale as AnimatedNumber) = new AnimatedNumber(animatedScaleParams);

    }

    public override update(dt: number): void {
        if (!this._myAnimatedScale.isDone()) {
            this._myAnimatedScale.update(dt);

            this._myTextObject.pp_resetScaleLocal();
            this._myTextObject.pp_scaleObject(this._myAnimatedScale.getCurrentValue());
        }
    }

    public onUp(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor): boolean {
        if (!this._myTextVisible) {
            this._myAnimatedScale.updateTargetValue(1);
        } else {
            this._myAnimatedScale.updateTargetValue(0);
        }

        this._myTextVisible = !this._myTextVisible;

        return false;
    }
}