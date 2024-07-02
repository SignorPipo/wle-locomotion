import { Component, MeshComponent, Object3D, TextComponent } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { Cursor, CursorTarget } from "@wonderlandengine/components";
import { Timer } from "wle-pp/cauldron/cauldron/timer.js";
import { FSM, TransitionData } from "wle-pp/cauldron/fsm/fsm.js";
import { AudioPlayer } from "../../../../audio/audio_player.js";
import { AudioSetup } from "../../../../audio/audio_setup.js";
import { Vector3, Vector4 } from "../../../../cauldron/type_definitions/array_type_definitions.js";
import { ColorUtils } from "../../../../cauldron/utils/color_utils.js";
import { MathUtils } from "../../../../cauldron/utils/math_utils.js";
import { FlatMaterial, PhongMaterial } from "../../../../cauldron/wl/type_definitions/material_type_definitions.js";
import { InputUtils } from "../../../../input/cauldron/input_utils.js";
import { vec3_create, vec4_create } from "../../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../../pp/globals.js";
import { AnimatedNumber, AnimatedNumberParams } from "../animated_number.js";

/** You can return `true` to prevent the default behavior of the cursor button to be performed after the action has been handled */
export interface CursorButtonActionsHandler {

    /**
     * @param isSecondaryCursor `true` if the event is triggered but this is not the main cursor, which means the button is not actually changing the state  
     *                          so you might want to perform limited logic, like only making the gamepad pulse and  
     *                          play a sound to give the cursor feel but without changing the button state
     * 
     * @param isHoverFromDown `true` in the special case the button is pressed, another cursor enter the button, and the first cursor unhover
     *                        without releasing down.  
     *                        In this special case the button should go back to hover, but you might just want to perform limited logic based on the fact  
     *                        that is not hovering from unhover but it's a special case
     */
    onHover?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor, isSecondaryCursor: boolean, isHoverFromDown: boolean): boolean;

    /**
     * @param isSecondaryCursor `true` if the event is triggered but this is not the main cursor, which means the button is not actually changing the state  
     *                          so you might want to perform limited logic, like only making the gamepad pulse and  
     *                          play a sound to give the cursor feel but without changing the button state
     */
    onDown?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor, isSecondaryCursor: boolean): boolean;

    /**
     * @param isSecondaryCursor `true` if the event is triggered but this is not the main cursor, which means the button is not actually changing the state  
     *                          so you might want to perform limited logic, like only making the gamepad pulse and  
     *                          play a sound to give the cursor feel but without changing the button state
     */
    onUp?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor, isSecondaryCursor: boolean): boolean;

    /**
     * @param isSecondaryCursor `true` if the event is triggered but this is not the main cursor, which means the button is not actually changing the state  
     *                          so you might want to perform limited logic, like only making the gamepad pulse and  
     *                          play a sound to give the cursor feel but without changing the button state
     */
    onUnhover?(cursorButtonComponent: CursorButtonComponent, cursorComponent: Cursor, isSecondaryCursor: boolean): boolean;
}

export class CursorButtonComponent extends Component {
    public static override TypeName = "pp-cursor-button";

    /** This can be either a name of a component that is found on the same object of the cursor button,  
        or the name of an handler added through `CursorButtonComponent.addButtonActionHandler` */
    @property.string("")
    private readonly _myButtonActionsHandlerNames!: string;



    @property.float(0.075)
    private readonly _myScaleOffsetOnHover!: number;

    @property.float(-0.075)
    private readonly _myScaleOffsetOnDown!: number;

    @property.float(0.075)
    private readonly _myScaleOffsetOnUp!: number;



    @property.float(0.1)
    private readonly _myPulseIntensityOnHover!: number;

    @property.float(0)
    private readonly _myPulseIntensityOnDown!: number;

    @property.float(0.1)
    private readonly _myPulseIntensityOnUp!: number;

    @property.float(0)
    private readonly _myPulseIntensityOnUnhover!: number;



    @property.float(-0.1)
    private readonly _myColorBrigthnessOffsetOnHover!: number;

    @property.float(0)
    private readonly _myColorBrigthnessOffsetOnDown!: number;

    @property.float(-0.1)
    private readonly _myColorBrigthnessOffsetOnUp!: number;



    @property.bool(true)
    private readonly _myUseSpatialAudio!: boolean;

    @property.string("")
    private readonly _mySFXOnHover!: string;

    @property.string("")
    private readonly _mySFXOnDown!: string;

    @property.string("")
    private readonly _mySFXOnUp!: string;

    @property.string("")
    private readonly _mySFXOnUnhover!: string;



    /** Even if you barely interact with the button, it will keep staying in this state for the specified amount */
    @property.float(0)
    private readonly _myMinHoverSecond!: number;

    /** Even if you barely interact with the button, it will keep staying in this state for the specified amount */
    @property.float(0.15)
    private readonly _myMinDownSecond!: number;

    /** Even if you barely interact with the button, it will keep staying in this state for the specified amount */
    @property.float(0)
    private readonly _myMinUpSecond!: number;

    /** Even if you barely interact with the button, it will keep staying in this state for the specified amount */
    @property.float(0)
    private readonly _myMinUnhoverSecond!: number;


    @property.bool(false)
    private readonly _myUpWithSecondaryCursorIsMain!: number;

    @property.bool(true)
    private readonly _myPerformDefaultSecondaryCursorFeedbackOnHover!: number;

    @property.bool(true)
    private readonly _myPerformDefaultSecondaryCursorFeedbackOnDown!: number;

    @property.bool(true)
    private readonly _myPerformDefaultSecondaryCursorFeedbackOnUp!: number;

    @property.bool(true)
    private readonly _myPerformDefaultSecondaryCursorFeedbackOnUnhover!: number;



    private readonly _myCursorButtonComponentID: string = "cursor_button_component" + MathUtils.randomUUID();

    private readonly _myCursorTarget!: CursorTarget;

    private readonly _myButtonActionsHandlers: Map<unknown, CursorButtonActionsHandler> = new Map();

    private readonly _myFSM: FSM = new FSM();
    private readonly _myKeepCurrentStateTimer: Timer = new Timer(0);

    private readonly _myTransitionQueue: [string, Cursor, boolean, boolean | null][] = [];
    private _myApplyQueuedTransitions: boolean = false;

    private _myHoverCursors: Cursor[] = [];
    private _myDownCursors: Cursor[] = [];

    private readonly _myOriginalScaleLocal: Vector3 = vec3_create();
    private readonly _myAnimatedScale!: AnimatedNumber;

    private readonly _myAnimatedColorBrightnessOffset!: AnimatedNumber;

    private _myFlatMaterialOriginalColors: [FlatMaterial, Vector4][] = [];
    private _myPhongMaterialOriginalColors: [PhongMaterial, Vector4][] = [];

    private _myOnHoverAudioPlayer: AudioPlayer | null = null;
    private _myOnDownAudioPlayer: AudioPlayer | null = null;
    private _myOnUpAudioPlayer: AudioPlayer | null = null;
    private _myOnUnhoverAudioPlayer: AudioPlayer | null = null;

    private static _myCursorButtonActionHandlers: Map<string, CursorButtonActionsHandler> = new Map();

    /** Used to add handlers for every cursor buttons that can be indexes with a string */
    public static addButtonActionHandler(id: string, buttonActionHandler: Readonly<CursorButtonActionsHandler>): void {
        CursorButtonComponent._myCursorButtonActionHandlers.set(id, buttonActionHandler);
    }

    public static removeButtonActionHandler(id: string): void {
        CursorButtonComponent._myCursorButtonActionHandlers.delete(id);
    }

    public static getButtonActionHandler(id: string): CursorButtonActionsHandler | null {
        const buttonActionHandler = CursorButtonComponent._myCursorButtonActionHandlers.get(id);
        return buttonActionHandler != null ? buttonActionHandler : null;
    }

    /** Used to add handlers for this specific instance of cursor button */
    public addButtonActionHandler(id: unknown, buttonActionHandler: Readonly<CursorButtonActionsHandler>): void {
        this._myButtonActionsHandlers.set(id, buttonActionHandler);
    }

    public removeButtonActionHandler(id: unknown): void {
        this._myButtonActionsHandlers.delete(id);
    }

    public getButtonActionHandler(id: unknown): CursorButtonActionsHandler | null {
        const buttonActionHandler = this._myButtonActionsHandlers.get(id);
        return buttonActionHandler != null ? buttonActionHandler : null;
    }

    public override start(): void {
        (this._myCursorTarget as CursorTarget) = this.object.pp_getComponent(CursorTarget)!;

        this._myCursorTarget.onUnhover.add(this._onUnhover.bind(this));
        this._myCursorTarget.onHover.add(this._onHover.bind(this));
        this._myCursorTarget.onDown.add(this._onDown.bind(this));
        this._myCursorTarget.onUpWithDown.add(this.onUpWithDown.bind(this));

        const buttonActionsHandlerNames = [...this._myButtonActionsHandlerNames.split(",")];
        for (let i = 0; i < buttonActionsHandlerNames.length; i++) {
            buttonActionsHandlerNames[i] = buttonActionsHandlerNames[i].trim();
        }

        for (const buttonActionsHandlerName of buttonActionsHandlerNames) {
            const buttonActionHandlerComponent = this.object.pp_getComponent(buttonActionsHandlerName) as CursorButtonActionsHandler;
            if (buttonActionHandlerComponent != null) {
                this._myButtonActionsHandlers.set(buttonActionsHandlerName, buttonActionHandlerComponent);
            } else {
                const buttonActionHandlerStatic = CursorButtonComponent.getButtonActionHandler(buttonActionsHandlerName);
                if (buttonActionHandlerStatic != null) {
                    this._myButtonActionsHandlers.set(buttonActionsHandlerName, buttonActionHandlerStatic);
                }
            }
        }

        this._setupVisualsAndSFXs();

        this._myKeepCurrentStateTimer.end();

        this._myFSM.setLogEnabled(true, "Cursor Button");

        this._myFSM.addState("unhover", { start: this._onUnhoverStart.bind(this) });
        this._myFSM.addState("hover", { start: this._onHoverStart.bind(this) });
        this._myFSM.addState("down", { start: this._onDownStart.bind(this) });
        this._myFSM.addState("up_with_down", { start: this._onUpWithDownStart.bind(this) });

        this._myFSM.addTransition("unhover", "hover", "hover");
        this._myFSM.addTransition("hover", "down", "down");
        this._myFSM.addTransition("down", "up_with_down", "up_with_down");
        this._myFSM.addTransition("down", "hover", "hover");
        this._myFSM.addTransition("up_with_down", "unhover", "unhover");
        this._myFSM.addTransition("up_with_down", "down", "down");

        this._myFSM.addTransition("hover", "unhover", "unhover");
        this._myFSM.addTransition("down", "unhover", "unhover");

        this._myFSM.init("unhover");
    }

    private static readonly _updateSV =
        {
            buttonScale: vec3_create(),
            hsvColor: vec4_create(),
            rgbColor: vec4_create()
        };
    public override update(dt: number): void {
        this._myFSM.update(dt);

        if (this._myKeepCurrentStateTimer.isRunning()) {
            this._myKeepCurrentStateTimer.update(dt);
            if (this._myKeepCurrentStateTimer.isDone()) {
                this._myApplyQueuedTransitions = true;
            }
        }

        if (this._myApplyQueuedTransitions) {
            this._myApplyQueuedTransitions = false;

            while (this._myTransitionQueue.length > 0) {
                const transitionToApply = this._myTransitionQueue.shift()!;
                if (transitionToApply[3] != null) {
                    this._myFSM.perform(transitionToApply[0], transitionToApply[1], transitionToApply[2], transitionToApply[3]);
                } else {
                    this._myFSM.perform(transitionToApply[0], transitionToApply[1], transitionToApply[2]);
                }

                if (this._myKeepCurrentStateTimer.isRunning()) {
                    break;
                }
            }
        }

        if (!this._myAnimatedScale.isDone()) {
            this._myAnimatedScale.update(dt);

            const buttonScale = CursorButtonComponent._updateSV.buttonScale;
            this.object.pp_setScaleLocal(this._myOriginalScaleLocal.vec3_scale(this._myAnimatedScale.getCurrentValue(), buttonScale));
        }

        if (!this._myAnimatedColorBrightnessOffset.isDone()) {
            this._myAnimatedColorBrightnessOffset.update(dt);

            const colorBrightnessOffsetCurrentValue = this._myAnimatedColorBrightnessOffset.getCurrentValue();

            const hsvColor = CursorButtonComponent._updateSV.hsvColor;
            const rgbColor = CursorButtonComponent._updateSV.rgbColor;

            for (const [material, originalColor] of this._myPhongMaterialOriginalColors) {
                ColorUtils.rgbToHSV(originalColor, hsvColor);
                hsvColor[2] = MathUtils.clamp(hsvColor[2] + colorBrightnessOffsetCurrentValue, 0, 1);
                material.diffuseColor = ColorUtils.hsvToRGB(hsvColor, rgbColor);
            }

            for (const [material, originalColor] of this._myFlatMaterialOriginalColors) {
                ColorUtils.rgbToHSV(originalColor, hsvColor);
                hsvColor[2] = MathUtils.clamp(hsvColor[2] + colorBrightnessOffsetCurrentValue, 0, 1);
                material.color = ColorUtils.hsvToRGB(hsvColor, rgbColor);
            }
        }
    }

    private _onUnhover(targetObject: Object3D, cursorComponent: Cursor): void {
        this._myHoverCursors.pp_removeEqual(cursorComponent);

        const isMainDown = this._myDownCursors.length > 0 && this._myDownCursors[0] == cursorComponent;

        this._myDownCursors.pp_removeEqual(cursorComponent);

        if (isMainDown && (!this._myUpWithSecondaryCursorIsMain || this._myDownCursors.length == 0)) {
            if (this._myHoverCursors.length > 0) {
                if (!this._myKeepCurrentStateTimer.isDone()) {
                    this._myTransitionQueue.push(["hover", cursorComponent, false, true]);
                } else {
                    this._myFSM.perform("hover", cursorComponent, false, true);
                }
            } else {
                if (!this._myKeepCurrentStateTimer.isDone()) {
                    this._myTransitionQueue.push(["unhover", cursorComponent, false, null]);
                } else {
                    this._myFSM.perform("unhover", cursorComponent, false);
                }
            }
        } else {
            const isSecondaryCursor = this._myHoverCursors.length > 0;

            if (!isSecondaryCursor) {
                if (!this._myKeepCurrentStateTimer.isDone()) {
                    this._myTransitionQueue.push(["unhover", cursorComponent, false, null]);
                } else {
                    this._myFSM.perform("unhover", cursorComponent, false);
                }
            } else {
                this._onUnhoverStart(null, null, cursorComponent, true);
            }
        }
    }

    private _onHover(targetObject: Object3D, cursorComponent: Cursor): void {
        const isSecondaryCursor = this._myHoverCursors.length > 0;

        this._myHoverCursors.pp_pushUnique(cursorComponent);

        if (!isSecondaryCursor) {
            if (!this._myKeepCurrentStateTimer.isDone()) {
                this._myTransitionQueue.push(["hover", cursorComponent, false, false]);
            } else {
                this._myFSM.perform("hover", cursorComponent, false, false);
            }
        } else {
            this._onHoverStart(null, null, cursorComponent, true, false);
        }
    }

    private _onDown(targetObject: Object3D, cursorComponent: Cursor): void {
        const isSecondaryCursor = this._myDownCursors.length > 0 && !this._myUpWithSecondaryCursorIsMain;

        this._myDownCursors.pp_pushUnique(cursorComponent);

        if (!isSecondaryCursor) {
            if (!this._myKeepCurrentStateTimer.isDone()) {
                this._myTransitionQueue.push(["down", cursorComponent, false, null]);
            } else {
                this._myFSM.perform("down", cursorComponent, false);
            }
        } else {
            this._onDownStart(null, null, cursorComponent, true);
        }
    }

    private onUpWithDown(targetObject: Object3D, cursorComponent: Cursor): void {
        const isSecondaryCursor = this._myDownCursors.length > 0 && this._myDownCursors[0] != cursorComponent && !this._myUpWithSecondaryCursorIsMain;

        this._myDownCursors.pp_removeEqual(cursorComponent);

        if (!isSecondaryCursor) {
            if (!this._myKeepCurrentStateTimer.isDone()) {
                this._myTransitionQueue.push(["up_with_down", cursorComponent, false, null]);
            } else {
                this._myFSM.perform("up_with_down", cursorComponent, false);
            }
        } else {
            this._onUpWithDownStart(null, null, cursorComponent, true);
        }
    }

    private _onUnhoverStart(fsm: FSM | null, transitionData: Readonly<TransitionData> | null, cursorComponent: Cursor, isSecondaryCursor: boolean): void {
        this._myKeepCurrentStateTimer.start(this._myMinUnhoverSecond);
        this._myKeepCurrentStateTimer.update(0); // Instantly end the timer if the duration is 0

        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onUnhover != null) {
                skipDefault ||= buttonActionsHandler.onUnhover(this, cursorComponent, isSecondaryCursor);
            }
        }

        if (skipDefault) {
            return;
        }

        if (!isSecondaryCursor) {
            if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
                this._myAnimatedScale.updateTargetValue(1);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnUnhover) {
            if (this._myPulseIntensityOnUnhover != 0) {
                const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
                if (handedness != null) {
                    Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnUnhover, 0.085);
                }
            }
        }

        if (!isSecondaryCursor) {
            if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
                this._myAnimatedColorBrightnessOffset.updateTargetValue(0);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnUnhover) {
            if (this._myOnUnhoverAudioPlayer != null) {
                this._myOnUnhoverAudioPlayer.setPosition(this.object.pp_getPosition());
                this._myOnUnhoverAudioPlayer.play();
            }
        }
    }


    private _onHoverStart(fsm: FSM | null, transitionData: Readonly<TransitionData> | null, cursorComponent: Cursor, isSecondaryCursor: boolean, isHoverFromDown: boolean): void {
        if (!isSecondaryCursor) {
            this._myKeepCurrentStateTimer.start(this._myMinHoverSecond);
            this._myKeepCurrentStateTimer.update(0); // Instantly end the timer if the duration is 0
        }

        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onHover != null) {
                skipDefault ||= buttonActionsHandler.onHover(this, cursorComponent, isSecondaryCursor, isHoverFromDown);
            }
        }

        if (skipDefault) {
            return;
        }

        if (!isSecondaryCursor) {
            if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
                this._myAnimatedScale.updateTargetValue(1 + this._myScaleOffsetOnHover);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnHover) {
            if (this._myPulseIntensityOnHover != 0) {
                const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
                if (handedness != null) {
                    Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnHover, 0.085);
                }
            }
        }

        if (!isSecondaryCursor) {
            if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
                this._myAnimatedColorBrightnessOffset.updateTargetValue(this._myColorBrigthnessOffsetOnHover);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnHover) {
            if (this._myOnHoverAudioPlayer != null) {
                this._myOnHoverAudioPlayer.setPosition(this.object.pp_getPosition());
                this._myOnHoverAudioPlayer.play();
            }
        }
    }

    private _onDownStart(fsm: FSM | null, transitionData: Readonly<TransitionData> | null, cursorComponent: Cursor, isSecondaryCursor: boolean): void {
        this._myKeepCurrentStateTimer.start(this._myMinDownSecond);
        this._myKeepCurrentStateTimer.update(0); // Instantly end the timer if the duration is 0

        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onDown != null) {
                skipDefault ||= buttonActionsHandler.onDown(this, cursorComponent, isSecondaryCursor);
            }
        }

        if (skipDefault) {
            return;
        }

        if (!isSecondaryCursor) {
            if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
                this._myAnimatedScale.updateTargetValue(1 + this._myScaleOffsetOnDown);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnDown) {
            if (this._myPulseIntensityOnDown != 0) {
                const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
                if (handedness != null) {
                    Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnDown, 0.085);
                }
            }
        }

        if (!isSecondaryCursor) {
            if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
                this._myAnimatedColorBrightnessOffset.updateTargetValue(this._myColorBrigthnessOffsetOnDown);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnDown) {
            if (this._myOnDownAudioPlayer != null) {
                this._myOnDownAudioPlayer.setPosition(this.object.pp_getPosition());
                this._myOnDownAudioPlayer.play();
            }
        }
    }

    private _onUpWithDownStart(fsm: FSM | null, transitionData: Readonly<TransitionData> | null, cursorComponent: Cursor, isSecondaryCursor: boolean): void {
        this._myKeepCurrentStateTimer.start(this._myMinUpSecond);
        this._myKeepCurrentStateTimer.update(0); // Instantly end the timer if the duration is 0

        let skipDefault = false;
        for (const buttonActionsHandler of this._myButtonActionsHandlers.values()) {
            if (buttonActionsHandler.onUp != null) {
                skipDefault ||= buttonActionsHandler.onUp(this, cursorComponent, isSecondaryCursor);
            }
        }

        if (skipDefault) {
            return;
        }

        if (!isSecondaryCursor) {
            if (this._myScaleOffsetOnHover != 0 || this._myScaleOffsetOnDown != 0 || this._myScaleOffsetOnUp != 0) {
                this._myAnimatedScale.updateTargetValue(1 + this._myScaleOffsetOnUp);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnUp) {
            if (this._myPulseIntensityOnUp != 0) {
                const handedness = InputUtils.getHandednessByString(cursorComponent.handedness as string);
                if (handedness != null) {
                    Globals.getGamepads()![handedness].pulse(this._myPulseIntensityOnUp, 0.085);
                }
            }
        }

        if (!isSecondaryCursor) {
            if (this._myColorBrigthnessOffsetOnHover != 0 || this._myColorBrigthnessOffsetOnDown != 0 || this._myColorBrigthnessOffsetOnUp != 0) {
                this._myAnimatedColorBrightnessOffset.updateTargetValue(this._myColorBrigthnessOffsetOnUp);
            }
        }

        if (!isSecondaryCursor || this._myPerformDefaultSecondaryCursorFeedbackOnUp) {
            if (this._myOnUpAudioPlayer != null) {
                this._myOnUpAudioPlayer.setPosition(this.object.pp_getPosition());
                this._myOnUpAudioPlayer.play();
            }
        }
    }

    private _setupVisualsAndSFXs(): void {
        this.object.pp_getScaleLocal(this._myOriginalScaleLocal);

        const animatedScaleParams = new AnimatedNumberParams();
        animatedScaleParams.myInitialValue = this._myOriginalScaleLocal[0];
        animatedScaleParams.myAnimationSeconds = 0.25;
        (this._myAnimatedScale as AnimatedNumber) = new AnimatedNumber(animatedScaleParams);

        const animatedColorBrightnessOffsetParams = new AnimatedNumberParams();
        animatedColorBrightnessOffsetParams.myInitialValue = 0;
        animatedColorBrightnessOffsetParams.myAnimationSeconds = 0.25;
        (this._myAnimatedColorBrightnessOffset as AnimatedNumber) = new AnimatedNumber(animatedColorBrightnessOffsetParams);

        const meshComponents = this.object.pp_getComponents(MeshComponent);
        for (const meshComponent of meshComponents) {
            meshComponent.material = meshComponent.material?.clone();

            const phongMaterial = meshComponent.material as PhongMaterial;
            if (phongMaterial.diffuseColor != null) {
                this._myPhongMaterialOriginalColors.push([phongMaterial, phongMaterial.diffuseColor.vec4_clone()]);
            } else {
                const flatMaterial = meshComponent.material as FlatMaterial;
                if (flatMaterial.color != null) {
                    this._myFlatMaterialOriginalColors.push([flatMaterial, flatMaterial.color.vec4_clone()]);
                }
            }
        }

        const textComponents = this.object.pp_getComponents(TextComponent);
        for (const textComponent of textComponents) {
            textComponent.material = textComponent.material?.clone();

            const flatMaterial = textComponent.material as FlatMaterial;
            if (flatMaterial.color != null) {
                this._myFlatMaterialOriginalColors.push([flatMaterial, flatMaterial.color.vec4_clone()]);
            }
        }

        const audioManager = Globals.getAudioManager(this.engine)!;
        if (this._mySFXOnHover.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnHover);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_hover";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnHoverAudioPlayer = audioManager.createAudioPlayer(audioID);
        }

        if (this._mySFXOnDown.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnDown);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_down";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnDownAudioPlayer = audioManager.createAudioPlayer(audioID);
        }

        if (this._mySFXOnUp.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnUp);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_up";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnUpAudioPlayer = audioManager.createAudioPlayer(audioID);
        }

        if (this._mySFXOnUnhover.length > 0) {
            const audioSetup = new AudioSetup(this._mySFXOnUnhover);
            audioSetup.mySpatial = this._myUseSpatialAudio;

            const audioID = this._myCursorButtonComponentID + "_on_unhover";
            audioManager.addAudioSetup(audioID, audioSetup);

            this._myOnUnhoverAudioPlayer = audioManager.createAudioPlayer(audioID);
        }
    }
}