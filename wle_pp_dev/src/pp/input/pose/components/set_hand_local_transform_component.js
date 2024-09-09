import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../../cauldron/utils/xr_utils.js";
import { quat2_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../../pp/globals.js";
import { InputUtils } from "../../cauldron/input_utils.js";

export class SetHandLocalTransformComponent extends Component {
    static TypeName = "pp-set-hand-local-transform";
    static Properties = {
        _myHandedness: Property.enum(["Left", "Right"], "Left")
    };

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);
    }

    _onPoseUpdated(dt, pose) {
        // Implemented outside class definition
    }

    onActivate() {
        Globals.getHandPose(this._myHandednessType, this.engine).registerPoseUpdatedEventListener(this, this._onPoseUpdated.bind(this));
    }

    onDeactivate() {
        Globals.getHandPose(this._myHandednessType, this.engine)?.unregisterPoseUpdatedEventListener(this);
    }
}



// IMPLEMENTATION

SetHandLocalTransformComponent.prototype._onPoseUpdated = function () {
    let handPoseTransform = quat2_create();
    return function _onPoseUpdated(dt, pose) {
        if (this.active) {
            if (XRUtils.isSessionActive(this.engine)) {
                if (pose.isValid()) {
                    this.object.pp_setTransformLocalQuat(pose.getTransformQuat(handPoseTransform, null));
                }
            }
        }
    };
}();