import { Component, Property } from "@wonderlandengine/api";
import { XRUtils } from "../../pp/cauldron/utils/xr_utils";
import { Handedness, InputSourceType } from "../../pp/input/cauldron/input_types";
import { InputUtils } from "../../pp/input/cauldron/input_utils";
import { HandPose } from "../../pp/input/pose/hand_pose";

export class TestTrackedHandDrawJointsComponent extends Component {
    static TypeName = "test-tracked-hand-draw-joints";
    static Properties = {
        _myHandedness: Property.enum(['left', 'right'], 'left'),
        _myJointMesh: Property.mesh(),
        _myJointMaterial: Property.material()
    };

    init() {
        this._myHandPose = new HandPose(InputUtils.getHandednessByIndex(this._myHandedness));
        this._myHandPose.setFixForward(true);
    }

    start() {
        this._myHandednessType = InputUtils.getHandednessByIndex(this._myHandedness);

        this._myHandPose.start();
        this._buildTrackedHandHierarchy();

        XRUtils.registerSessionStartEndEventListeners(this, this._onXRSessionStart.bind(this), this._onXRSessionEnd.bind(this), false, false, this.engine);
    }

    update(dt) {
        this._myHandPose.update(dt);
        let handInputSource = InputUtils.getInputSource(this._myHandednessType, InputSourceType.TRACKED_HAND);

        if (handInputSource) {
            let tip = Module['webxr_frame'].getJointPose(handInputSource.hand.get("wrist"), this._myReferenceSpace);
            let index = Module['webxr_frame'].getJointPose(handInputSource.hand.get("middle-finger-phalanx-proximal"), this._myReferenceSpace);
            let tippp = Module['webxr_frame'].getJointPose(handInputSource.hand.get("index-finger-tip"), this._myReferenceSpace);

            if (tip && index) {
                let quat = [
                    tip.transform.orientation.x,
                    tip.transform.orientation.y,
                    tip.transform.orientation.z,
                    tip.transform.orientation.w];
                //quat.quat_toWorld(Globals.getPlayerObjects(this.engine).myPlayerPivot.pp_getTransformQuat(), quat);
                quat.quat_rotateAxis(180, quat.quat_getUp(), quat);
                quat = this._myHandPose.getRotationQuat();

                quat.quat_rotateAxis(-60, quat.quat_getRight(), quat);
                forwardRotation = 20;
                forwardRotation = (this._myHandednessType == Handedness.LEFT) ? forwardRotation : -forwardRotation;
                quat.quat_rotateAxis(forwardRotation, quat.quat_getForward(), quat);
                //quat.quat_rotateAxis(15, quat.quat_getRight(), quat);

                this._myTrackedHandObject.pp_setRotationLocalQuat(this._myHandPose.getRotationQuat());

                let position = [
                    index.transform.position.x,
                    index.transform.position.y,
                    index.transform.position.z];

                quat = [
                    tippp.transform.orientation.x,
                    tippp.transform.orientation.y,
                    tippp.transform.orientation.z,
                    tippp.transform.orientation.w];

                this._myTrackedHandObject2.pp_setPositionLocal(position);
                this._myTrackedHandObject2.pp_setRotationLocalQuat(this._myHandPose.getRotationQuat());

                let positionIndex = [
                    index.transform.position.x,
                    index.transform.position.y,
                    index.transform.position.z];

                this._myTrackedHandObject3.pp_setPositionLocal(positionIndex);

                position = position.vec3_add(positionIndex).vec3_scale(0.5);

                //position.vec3_convertPositionToWorld(Globals.getPlayerObjects(this.engine).myPlayerPivot.pp_getTransform(), position);

                this._myTrackedHandObject.pp_setPositionLocal(this._myHandPose.getPosition());
                //this._myTrackedHandObject.pp_translateObject(vec3_create(-0.02, 0, 0));

                //this._myTrackedHandObject.pp_setScale(tip.radius);
                //this._myTrackedHandObject.pp_rotateObject(vec3_create(0, 180, 0));
            }
        }
    }

    _onXRSessionStart(session) {
        session.requestReferenceSpace(WebXR.refSpace).then(function (referenceSpace) { this._myReferenceSpace = referenceSpace; }.bind(this));
    }

    _onXRSessionEnd(session) {
        this._myReferenceSpace = null;
    }

    _buildTrackedHandHierarchy() {
        let child = this.object.pp_getChildren()[0];
        this._myTrackedHandObject = this.object.pp_addObject();
        this._myTrackedHandObject2 = this.object.pp_addObject();
        this._myTrackedHandObject3 = this.object.pp_addObject();
        this._myTrackedHandObjectMesh = this._myTrackedHandObject.pp_addObject();
        //child.pp_setParent(this._myTrackedHandObject, false);
        //child.pp_resetTransformLocal();

        this._myTrackedHandObjectMesh.pp_setScale(0.0125);
        let mesh = this._myTrackedHandObjectMesh.pp_addComponent("mesh");
        this._myTrackedHandObjectMesh.pp_addComponent("pp-debug-transform");
        //this._myTrackedHandObject3.pp_addComponent("pp-debug-transform");
        this._myTrackedHandObject2.pp_addComponent("pp-debug-transform");
        mesh.mesh = this._myJointMesh;
        mesh.material = this._myJointMaterial;
    }
}