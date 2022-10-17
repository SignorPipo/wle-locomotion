WL.registerComponent('pp-console-vr', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _myOverrideBrowserConsole: { type: WL.Type.Bool, default: true },
    _myShowOnStart: { type: WL.Type.Bool, default: false },
    _myShowVisibilityButton: { type: WL.Type.Bool, default: false },
    _myPulseOnNewMessage: { type: WL.Type.Enum, values: ['never', 'always', 'when hidden'], default: 'never' }
}, {
    init: function () {
        this._myWidget = new PP.ConsoleVRWidget();
    },
    start: function () {
        let additionalSetup = {};
        additionalSetup.myHandedness = [null, 'left', 'right'][this._myHandedness];
        additionalSetup.myOverrideBrowserConsole = this._myOverrideBrowserConsole;
        additionalSetup.myShowOnStart = this._myShowOnStart;
        additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
        additionalSetup.myPulseOnNewMessage = this._myPulseOnNewMessage;
        additionalSetup.myPlaneMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque;
        additionalSetup.myTextMaterial = PP.myDefaultResources.myMaterials.myText;

        this._myWidget.start(this.object, additionalSetup);

        this._myWidgetVisibleBackup = this._myWidget.isVisible();
        this._mySetVisibleNextUpdate = false;
    },
    update: function (dt) {
        if (this._mySetVisibleNextUpdate) {
            this._mySetVisibleNextUpdate = false;
            this._myWidget.setVisible(false);
            this._myWidget.setVisible(this._myWidgetVisibleBackup);
        }

        this._myWidget.update(dt);
    },
    onActivate() {
        this._mySetVisibleNextUpdate = true;
    },
    onDeactivate() {
        this._myWidgetVisibleBackup = this._myWidget.isVisible();

        this._myWidget.setVisible(false);
    },
});
