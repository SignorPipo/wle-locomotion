/*
let visualParams = new PP.VisualLineParams();
visualParams.myStart = start;
visualParams.myDirection = direction;
visualParams.myLength = 0.1;
visualParams.myMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
visualParams.myMaterial.color = [1, 1, 1, 1];
PP.myVisualManager.draw(visualParams);

or

let visuaLine = new PP.VisualLine(visualParams);
*/

PP.VisualLineParams = class VisualLineParams {

    constructor() {
        this.myStart = [0, 0, 0];
        this.myDirection = [0, 0, 1];
        this.myLength = 0;

        this.myThickness = 0.005;

        this.myMaterial = null;

        this.myType = PP.DebugVisualElementType.LINE;
    }

    setStartEnd(start, end) {
        end.vec3_sub(start, this.myDirection);
        this.myLength = this.myDirection.vec3_length();
        this.myDirection.vec3_normalize(this.myDirection);
        this.myStart.vec3_copy(start);

        return this;
    }
};

PP.VisualLine = class VisualLine {

    constructor(params = new PP.VisualLineParams()) {
        this._myParams = params;

        this._myLineRootObject = null;

        this._myVisible = true;
        this._myAutoRefresh = true;

        this._myDirty = false;

        this._build();
        this._refresh();

        this.setVisible(true);
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myLineRootObject.pp_setActive(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    getParams() {
        return this._myParams;
    }

    setParams(params) {
        this._myParams = params;
        this._markDirty();
    }

    paramsUpdated() {
        this._markDirty();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this.update(0);
        }
    }

    refresh() {
        this.update(0);
    }

    update(dt) {
        if (this._myDirty) {
            this._refresh();

            this._myDirty = false;
        }
    }

    _refresh() {
        this._myLineRootObject.pp_setPosition(this._myParams.myStart);

        this._myLineObject.pp_resetPositionLocal();
        this._myLineObject.pp_resetScaleLocal();

        this._myLineObject.pp_scaleObject([this._myParams.myThickness / 2, this._myParams.myLength / 2, this._myParams.myThickness / 2]);

        this._myLineObject.pp_setUp(this._myParams.myDirection);
        this._myLineObject.pp_translateObject([0, this._myParams.myLength / 2, 0]);

        this._myLineMesh.material = this._myParams.myMaterial;
    }

    _build() {
        this._myLineRootObject = WL.scene.addObject(PP.myDebugData.myRootObject);
        this._myLineObject = WL.scene.addObject(this._myLineRootObject);

        this._myLineMesh = this._myLineObject.addComponent('mesh');
        this._myLineMesh.mesh = PP.myDefaultResources.myMeshes.myCylinder;
        this._myLineMesh.material = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
    }

    clone() {
        let clonedParams = new PP.VisualLineParams();
        clonedParams.myStart.pp_copy(this._myParams.myStart);
        clonedParams.myDirection.pp_copy(this._myParams.myDirection);
        clonedParams.myLength = this._myParams.myLength;
        clonedParams.myThickness = this._myParams.myThickness;
        if (this._myParams.myMaterial != null) {
            clonedParams.myMaterial = this._myParams.myMaterial.clone();
        }

        let clone = new PP.VisualLine(clonedParams);
        clone.setAutoRefresh(this._myAutoRefresh);
        clone.setVisible(this._myVisible);
        clone._myDirty = this._myDirty;

        return clone;
    }
};