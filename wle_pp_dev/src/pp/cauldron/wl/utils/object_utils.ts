import { MathUtils } from "../../js/utils/math_utils.js";
import { Globals } from "../../../pp/globals.js";
import { Mat3Utils } from "../../js/utils/mat3_utils.js";
import { Mat4Utils } from "../../js/utils/mat4_utils.js";
import { Quat2Utils } from "../../js/utils/quat2_utils.js";
import { QuatUtils } from "../../js/utils/quat_utils.js";
import { Vec3Utils } from "../../js/utils/vec3_utils.js";
import { ComponentUtils, CustomCloneParams, DeepCloneParams } from "./component_utils.js";
import { SceneUtils } from "./scene_utils.js";
import { Component, ComponentConstructor, Object3D, Scene } from "@wonderlandengine/api";
import { type Matrix3, type Matrix4, type Quaternion, type Quaternion2, type Vector3 } from "../../../cauldron/js/array_type_definitions.js";

export class CloneParams {

    public myCloneParent: Object3D | null | undefined;

    public myIgnoreNonCloneable: boolean;
    public myIgnoreComponents: boolean;
    public myIgnoreDescendants: boolean;

    public myComponentsToIgnore: string[];
    public myComponentsToInclude: string[];
    public myIgnoreComponentCallback = null;

    public myDescendantsToIgnore: Object[];
    public myDescendantsToInclude: Object[];
    public myIgnoreDescendantCallback = null;

    public myUseDefaultComponentClone: boolean;
    public myUseDefaultComponentCloneAsFallback: boolean;
    public myDefaultComponentCloneAutoStartIfNotActive: boolean;

    public myUseDefaultObjectClone: boolean;
    public myUseDefaultObjectCloneAsFallback: boolean;

    public myComponentDeepCloneParams: DeepCloneParams;

    public myComponentCustomCloneParams: CustomCloneParams;

    constructor() {
        this.myCloneParent = undefined;  // Defaults to the object to clone parent, null can be used to specify u want the scene root as the parent

        this.myIgnoreNonCloneable = false;      // Ignores components that are not clonable
        this.myIgnoreComponents = false;        // All components are ignored, cloning only the object hierarchy
        this.myIgnoreDescendants = false;       // Clones only the given object without the descendants

        this.myComponentsToIgnore = [];         // Ignores all component types in this list (example: "mesh"), has lower priority over myComponentsToInclude
        this.myComponentsToInclude = [];        // Clones only the component types in this list (example: "mesh"), has higher priority over myComponentsToIgnore, if empty it's ignored
        this.myIgnoreComponentCallback = null;  // Signature: callback(component) returns true if the component must be ignored, it is called after the previous filters

        this.myDescendantsToIgnore = [];        // Ignores all the objects in this list, has lower priority over myDescendantsToInclude
        this.myDescendantsToInclude = [];       // Clones only the objects in this list, has higher priority over myDescendantsToIgnore, if empty it's ignored
        this.myIgnoreDescendantCallback = null; // Signature: callback(object) returns true if the object must be ignored, it is called after the previous filters

        this.myUseDefaultComponentClone = false;               // Use the default component clone function
        this.myUseDefaultComponentCloneAsFallback = false;     // Use the default component clone function only as fallback, that is if there is no custom component clone
        this.myDefaultComponentCloneAutoStartIfNotActive = true;

        this.myUseDefaultObjectClone = false;               // Use the default object clone function, ignoring all the other clone settings but myCloneParent and myDefaultComponentCloneAutoStartIfNotActive
        this.myUseDefaultObjectCloneAsFallback = false;     // Use the default object clone function only as fallback, that is if the object is not pp cloneable

        this.myComponentDeepCloneParams = new DeepCloneParams();     // Used to specify if the object components must be deep cloned or not, you can also override the behavior for specific components and variables

        this.myComponentCustomCloneParams = new CustomCloneParams(); // This class can be filled with whatever custom paramater the component clone functions could need
    }
}

// GETTER

// Position

export function getPosition(object: Object3D, position: Vector3) {
    return ObjectUtils.getPositionWorld(object, position);
}

export function getPositionWorld(object: Object3D, position: Vector3 = Vec3Utils.create()) {
    object.getPositionWorld(position);
    return position;
}

export function getPositionLocal(object: Object3D, position: Vector3 = Vec3Utils.create()) {
    object.getPositionLocal(position);
    return position;
}

// Rotation

export function getRotation(object: Object3D, rotation) {
    return ObjectUtils.getRotationWorld(object, rotation);
}

export function getRotationDegrees(object: Object3D, rotation) {
    return ObjectUtils.getRotationWorldDegrees(object, rotation);
}

export function getRotationRadians(object: Object3D, rotation) {
    return ObjectUtils.getRotationWorldRadians(object, rotation);
}

export function getRotationMatrix(object: Object3D, rotation) {
    return ObjectUtils.getRotationWorldMatrix(object, rotation);
}

export function getRotationQuat(object: Object3D, rotation) {
    return ObjectUtils.getRotationWorldQuat(object, rotation);
}

// Rotation World

export function getRotationWorld(object: Object3D, rotation) {
    return ObjectUtils.getRotationWorldDegrees(object, rotation);
}

export function getRotationWorldDegrees(object: Object3D, rotation) {
    rotation = ObjectUtils.getRotationWorldRadians(object, rotation);
    rotation = Vec3Utils.toDegrees(rotation, rotation);
    return rotation;
}

export let getRotationWorldRadians = function () {
    let quat = QuatUtils.create();
    return function getRotationWorldRadians(object: Object3D, rotation = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.toRadians(quat, rotation);
        return rotation;
    };
}();

export let getRotationWorldMatrix = function () {
    let quat = QuatUtils.create();
    return function getRotationWorldMatrix(object: Object3D, rotation = Mat3Utils.create()) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.toMatrix(quat, rotation);
        return rotation;
    };
}();

export function getRotationWorldQuat(object: Object3D, rotation = QuatUtils.create()) {
    object.getRotationWorld(rotation);
    return rotation;
}

// Rotation Local

export function getRotationLocal(object: Object3D, rotation) {
    return ObjectUtils.getRotationLocalDegrees(object, rotation);
}

export function getRotationLocalDegrees(object: Object3D, rotation) {
    rotation = ObjectUtils.getRotationLocalRadians(object, rotation);
    rotation = Vec3Utils.toDegrees(rotation, rotation);
    return rotation;
}

export let getRotationLocalRadians = function () {
    let quat = QuatUtils.create();
    return function getRotationLocalRadians(object: Object3D, rotation = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.toRadians(quat, rotation);
        return rotation;
    };
}();

export let getRotationLocalMatrix = function () {
    let quat = QuatUtils.create();
    return function getRotationLocalMatrix(object: Object3D, rotation = Mat3Utils.create()) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.toMatrix(quat, rotation);
        return rotation;
    };
}();

export function getRotationLocalQuat(object: Object3D, rotation = QuatUtils.create()) {
    object.getRotationLocal(rotation);
    return rotation;
}

// Scale

export function getScale(object: Object3D, scale: Vector3) {
    return ObjectUtils.getScaleWorld(object, scale);
}

export function getScaleWorld(object: Object3D, scale: Vector3 = Vec3Utils.create()) {
    object.getScalingWorld(scale);
    return scale;
}

export function getScaleLocal(object: Object3D, scale: Vector3 = Vec3Utils.create()) {
    object.getScalingLocal(scale);
    return scale;
}

// Transform

export function getTransform(object: Object3D, transform) {
    return ObjectUtils.getTransformWorld(object, transform);
}

export function getTransformMatrix(object: Object3D, transform) {
    return ObjectUtils.getTransformWorldMatrix(object, transform);
}

export function getTransformQuat(object: Object3D, transform) {
    return ObjectUtils.getTransformWorldQuat(object, transform);
}

// Transform World

export function getTransformWorld(object: Object3D, transform) {
    return ObjectUtils.getTransformWorldMatrix(object, transform);
}

export let getTransformWorldMatrix = function () {
    let transformQuat = Quat2Utils.create();
    let scale = Vec3Utils.create();
    return function getTransformWorldMatrix(object: Object3D, transform = Mat4Utils.create()) {
        ObjectUtils.getTransformWorldQuat(object, transformQuat);
        ObjectUtils.getScaleWorld(object, scale);
        Mat4Utils.fromQuat(transformQuat, transform);
        Mat4Utils.scale(transform, scale, transform);
        return transform;
    };
}();

export function getTransformWorldQuat(object: Object3D, transform = Quat2Utils.create()) {
    object.getTransformWorld(transform);
    return transform;
}

// Transform Local

export function getTransformLocal(object: Object3D, transform) {
    return ObjectUtils.getTransformLocalMatrix(object, transform);
}

export let getTransformLocalMatrix = function () {
    let transformQuat = Quat2Utils.create();
    let scale = Vec3Utils.create();
    return function getTransformLocalMatrix(object: Object3D, transform = Mat4Utils.create()) {
        ObjectUtils.getTransformLocalQuat(object, transformQuat);
        ObjectUtils.getScaleLocal(object, scale);
        Mat4Utils.fromQuat(transformQuat, transform);
        Mat4Utils.scale(transform, scale, transform);
        return transform;
    };
}();

export function getTransformLocalQuat(object: Object3D, transform = Quat2Utils.create()) {
    object.getTransformLocal(transform);
    return transform;
}

// Axes

export function getAxes(object: Object3D, axes) {
    return ObjectUtils.getAxesWorld(object, axes);
}

export function getAxesWorld(object: Object3D, axes = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
    ObjectUtils.getLeftWorld(object, axes[0]);
    ObjectUtils.getUpWorld(object, axes[1]);
    ObjectUtils.getForwardWorld(object, axes[2]);
    return axes;
}

export function getAxesLocal(object: Object3D, axes = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]) {
    ObjectUtils.getLeftLocal(object, axes[0]);
    ObjectUtils.getUpLocal(object, axes[1]);
    ObjectUtils.getForwardLocal(object, axes[2]);
    return axes;
}

// Forward

export function getForward(object: Object3D, forward: Vector3) {
    return ObjectUtils.getForwardWorld(object, forward);
}

export let getForwardWorld = function () {
    let rotation = Mat3Utils.create();
    return function getForwardWorld(object: Object3D, forward = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        forward[0] = rotation[6];
        forward[1] = rotation[7];
        forward[2] = rotation[8];
        return forward;
    };
}();

export let getForwardLocal = function () {
    let rotation = Mat3Utils.create();
    return function getForwardLocal(object: Object3D, forward = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        forward[0] = rotation[6];
        forward[1] = rotation[7];
        forward[2] = rotation[8];
        return forward;
    };
}();

// Backward

export function getBackward(object: Object3D, backward: Vector3) {
    return ObjectUtils.getBackwardWorld(object, backward);
}

export let getBackwardWorld = function () {
    let rotation = Mat3Utils.create();
    return function getBackwardWorld(object: Object3D, backward = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        backward[0] = -rotation[6];
        backward[1] = -rotation[7];
        backward[2] = -rotation[8];
        return backward;
    };
}();

export let getBackwardLocal = function () {
    let rotation = Mat3Utils.create();
    return function getBackwardLocal(object: Object3D, backward = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        backward[0] = -rotation[6];
        backward[1] = -rotation[7];
        backward[2] = -rotation[8];
        return backward;
    };
}();

// Up

export function getUp(object: Object3D, up: Vector3) {
    return ObjectUtils.getUpWorld(object, up);
}

export let getUpWorld = function () {
    let rotation = Mat3Utils.create();
    return function getUpWorld(object: Object3D, up = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        up[0] = rotation[3];
        up[1] = rotation[4];
        up[2] = rotation[5];
        return up;
    };
}();

export let getUpLocal = function () {
    let rotation = Mat3Utils.create();
    return function getUpLocal(object: Object3D, up = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        up[0] = rotation[3];
        up[1] = rotation[4];
        up[2] = rotation[5];
        return up;
    };
}();

// Down

export function getDown(object: Object3D, down: Vector3) {
    return ObjectUtils.getDownWorld(object, down);
}

export let getDownWorld = function () {
    let rotation = Mat3Utils.create();
    return function getDownWorld(object: Object3D, down = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        down[0] = -rotation[3];
        down[1] = -rotation[4];
        down[2] = -rotation[5];
        return down;
    };
}();

export let getDownLocal = function () {
    let rotation = Mat3Utils.create();
    return function getDownLocal(object: Object3D, down = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        down[0] = -rotation[3];
        down[1] = -rotation[4];
        down[2] = -rotation[5];
        return down;
    };
}();

// Left

export function getLeft(object: Object3D, left: Vector3) {
    return ObjectUtils.getLeftWorld(object, left);
}

export let getLeftWorld = function () {
    let rotation = Mat3Utils.create();
    return function getLeftWorld(object: Object3D, left = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        left[0] = rotation[0];
        left[1] = rotation[1];
        left[2] = rotation[2];
        return left;
    };
}();

export let getLeftLocal = function () {
    let rotation = Mat3Utils.create();
    return function getLeftLocal(object: Object3D, left = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        left[0] = rotation[0];
        left[1] = rotation[1];
        left[2] = rotation[2];
        return left;
    };
}();

// Right

export function getRight(object: Object3D, right: Vector3) {
    return ObjectUtils.getRightWorld(object, right);
}

export let getRightWorld = function () {
    let rotation = Mat3Utils.create();
    return function getRightWorld(object: Object3D, right = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldMatrix(object, rotation);
        right[0] = -rotation[0];
        right[1] = -rotation[1];
        right[2] = -rotation[2];
        return right;
    };
}();

export let getRightLocal = function () {
    let rotation = Mat3Utils.create();
    return function getRightLocal(object: Object3D, right = Vec3Utils.create()) {
        ObjectUtils.getRotationLocalMatrix(object, rotation);
        right[0] = -rotation[0];
        right[1] = -rotation[1];
        right[2] = -rotation[2];
        return right;
    };
}();

// SETTER

// Position

export function setPosition(object: Object3D, position: Vector3) {
    ObjectUtils.setPositionWorld(object, position);
}

export function setPositionWorld(object: Object3D, position: Vector3) {
    object.setTranslationWorld(position);
}

export function setPositionLocal(object: Object3D, position: Vector3) {
    object.setTranslationLocal(position);
}

// Rotation

export function setRotation(object: Object3D, rotation) {
    ObjectUtils.setRotationWorld(object, rotation);
}

export function setRotationDegrees(object: Object3D, rotation) {
    ObjectUtils.setRotationWorldDegrees(object, rotation);
}

export function setRotationRadians(object: Object3D, rotation) {
    ObjectUtils.setRotationWorldRadians(object, rotation);
}

export function setRotationMatrix(object: Object3D, rotation) {
    ObjectUtils.setRotationWorldMatrix(object, rotation);
}

export function setRotationQuat(object: Object3D, rotation) {
    ObjectUtils.setRotationWorldQuat(object, rotation);
}

// Rotation World

export function setRotationWorld(object: Object3D, rotation) {
    ObjectUtils.setRotationWorldDegrees(object, rotation);
}

export let setRotationWorldDegrees = function () {
    let quat = QuatUtils.create();
    return function setRotationWorldDegrees(object: Object3D, rotation) {
        Vec3Utils.degreesToQuat(rotation, quat);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setRotationWorldRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function setRotationWorldRadians(object: Object3D, rotation) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.setRotationWorldDegrees(object, degreesRotation);
    };
}();

export let setRotationWorldMatrix = function () {
    let quat = QuatUtils.create();
    return function setRotationWorldMatrix(object: Object3D, rotation) {
        Mat3Utils.toQuat(rotation, quat);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export function setRotationWorldQuat(object: Object3D, rotation) {
    object.setRotationWorld(rotation);
}

// Rotation Local

export function setRotationLocal(object: Object3D, rotation) {
    ObjectUtils.setRotationLocalDegrees(object, rotation);
}

export let setRotationLocalDegrees = function () {
    let quat = QuatUtils.create();
    return function setRotationLocalDegrees(object: Object3D, rotation) {
        Vec3Utils.degreesToQuat(rotation, quat);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

export let setRotationLocalRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function setRotationLocalRadians(object: Object3D, rotation) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.setRotationLocalDegrees(object, degreesRotation);
    };
}();

export let setRotationLocalMatrix = function () {
    let quat = QuatUtils.create();
    return function setRotationLocalMatrix(object: Object3D, rotation) {
        Mat3Utils.toQuat(rotation, quat);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

export function setRotationLocalQuat(object: Object3D, rotation) {
    object.setRotationLocal(rotation);
}

// Scale

export function setScale(object: Object3D, scale: number | Vector3) {
    ObjectUtils.setScaleWorld(object, scale);
}

export let setScaleWorld = function () {
    let vector = Vec3Utils.create();
    return function setScaleWorld(object: Object3D, scale: number | Vector3) {
        if (isNaN(scale as number)) {
            object.setScalingWorld(scale as Vector3);
        } else {
            Vec3Utils.set(vector, scale);
            object.setScalingWorld(vector);
        }
    };
}();

export let setScaleLocal = function () {
    let vector = Vec3Utils.create();
    return function setScaleLocal(object: Object3D, scale: number | Vector3) {
        if (isNaN(scale as number)) {
            object.setScalingLocal(scale as Vector3);
        } else {
            Vec3Utils.set(vector, scale);
            object.setScalingLocal(vector);
        }
    };
}();

// Axes    

export function setAxes(object: Object3D, left: Vector3, up: Vector3, forward: Vector3) {
    ObjectUtils.setAxesWorld(object, left, up, forward);
}

export function setAxesWorld(object: Object3D, left: Vector3, up: Vector3, forward: Vector3) {
    if (forward != null) {
        ObjectUtils.setForwardWorld(object, forward, up, left);
    } else if (up != null) {
        ObjectUtils.setUpWorld(object, up, forward, left);
    } else {
        ObjectUtils.setLeftWorld(object, left, up, forward);
    }
}

export function setAxesLocal(object: Object3D, left: Vector3, up: Vector3, forward: Vector3) {
    if (forward != null) {
        ObjectUtils.setForwardLocal(object, forward, up, left);
    } else if (up != null) {
        ObjectUtils.setUpLocal(object, up, forward, left);
    } else {
        ObjectUtils.setLeftLocal(object, left, up, forward);
    }
}

// Forward

export function setForward(object: Object3D, forward: Vector3, up: Vector3, left: Vector3) {
    ObjectUtils.setForwardWorld(object, forward, up, left);
}

export let setForwardWorld = function () {
    let quat = QuatUtils.create();
    return function setForwardWorld(object: Object3D, forward: Vector3, up = null, left = null) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setForward(quat, forward, up, left);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setForwardLocal = function () {
    let quat = QuatUtils.create();
    return function setForwardLocal(object: Object3D, forward: Vector3, up = null, left = null) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setForward(quat, forward, up, left);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Backward

export function setBackward(object: Object3D, backward: Vector3, up: Vector3, left: Vector3) {
    ObjectUtils.setBackwardWorld(object, backward, up, left);
}

export let setBackwardWorld = function () {
    let quat = QuatUtils.create();
    return function setBackwardWorld(object: Object3D, backward: Vector3, up = null, left = null) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setBackward(quat, backward, up, left);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setBackwardLocal = function () {
    let quat = QuatUtils.create();
    return function setBackwardLocal(object: Object3D, backward: Vector3, up = null, left = null) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setBackward(quat, backward, up, left);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Up

export function setUp(object: Object3D, up: Vector3, forward: Vector3, left: Vector3) {
    ObjectUtils.setUpWorld(object, up, forward, left);
}

export let setUpWorld = function () {
    let quat = QuatUtils.create();
    return function setUpWorld(object: Object3D, up: Vector3, forward = null, left = null) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setUp(quat, up, forward, left);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setUpLocal = function () {
    let quat = QuatUtils.create();
    return function setUpLocal(object: Object3D, up: Vector3, forward = null, left = null) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setUp(quat, up, forward, left);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Down

export function setDown(object: Object3D, down: Vector3, forward: Vector3, left: Vector3) {
    ObjectUtils.setDownWorld(object, down, forward, left);
}

export let setDownWorld = function () {
    let quat = QuatUtils.create();
    return function setDownWorld(object: Object3D, down: Vector3, forward = null, left = null) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setDown(quat, down, forward, left);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setDownLocal = function () {
    let quat = QuatUtils.create();
    return function setDownLocal(object: Object3D, down: Vector3, forward = null, left = null) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setDown(quat, down, forward, left);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Left

export function setLeft(object: Object3D, left: Vector3, up: Vector3, forward: Vector3) {
    ObjectUtils.setLeftWorld(object, left, up, forward);
}

export let setLeftWorld = function () {
    let quat = QuatUtils.create();
    return function setLeftWorld(object: Object3D, left: Vector3, up = null, forward = null) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setLeft(quat, left, up, forward);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setLeftLocal = function () {
    let quat = QuatUtils.create();
    return function setLeftLocal(object: Object3D, left: Vector3, up = null, forward = null) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setLeft(quat, left, up, forward);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Right

export function setRight(object: Object3D, right: Vector3, up: Vector3, forward: Vector3) {
    ObjectUtils.setRightWorld(object, right, up, forward);
}

export let setRightWorld = function () {
    let quat = QuatUtils.create();
    return function setRightWorld(object: Object3D, right: Vector3, up = null, forward = null) {
        ObjectUtils.getRotationWorldQuat(object, quat);
        QuatUtils.setRight(quat, right, up, forward);
        ObjectUtils.setRotationWorldQuat(object, quat);
    };
}();

export let setRightLocal = function () {
    let quat = QuatUtils.create();
    return function setRightLocal(object: Object3D, right: Vector3, up = null, forward = null) {
        ObjectUtils.getRotationLocalQuat(object, quat);
        QuatUtils.setRight(quat, right, up, forward);
        ObjectUtils.setRotationLocalQuat(object, quat);
    };
}();

// Transform

export function setTransform(object: Object3D, transform) {
    ObjectUtils.setTransformWorld(object, transform);
}

export function setTransformMatrix(object: Object3D, transform) {
    ObjectUtils.setTransformWorldMatrix(object, transform);
}

export function setTransformQuat(object: Object3D, transform) {
    ObjectUtils.setTransformWorldQuat(object, transform);
}

// Transform World

export function setTransformWorld(object: Object3D, transform) {
    return ObjectUtils.setTransformWorldMatrix(object, transform);
}

export let setTransformWorldMatrix = function () {
    let position = Vec3Utils.create();
    let rotation = QuatUtils.create();
    let scale = Vec3Utils.create();
    let transformMatrixNoScale = Mat4Utils.create();
    let inverseScale = Vec3Utils.create();
    let one = Vec3Utils.create(1);
    return function setTransformWorldMatrix(object: Object3D, transform) {
        Mat4Utils.getPosition(transform, position);
        Mat4Utils.getScale(transform, scale);
        Vec3Utils.div(one, scale, inverseScale);
        Mat4Utils.scale(transform, inverseScale, transformMatrixNoScale);
        Mat4Utils.getRotationQuat(transformMatrixNoScale, rotation);
        QuatUtils.normalize(rotation, rotation);
        ObjectUtils.setScaleWorld(object, scale);
        ObjectUtils.setRotationWorldQuat(object, rotation);
        ObjectUtils.setPositionWorld(object, position);
    };
}();

export function setTransformWorldQuat(object: Object3D, transform) {
    object.setTransformWorld(transform);
}

// Transform Local

export function setTransformLocal(object: Object3D, transform) {
    return ObjectUtils.setTransformLocalMatrix(object, transform);
}

export let setTransformLocalMatrix = function () {
    let position = Vec3Utils.create();
    let rotation = QuatUtils.create();
    let scale = Vec3Utils.create();
    let transformMatrixNoScale = Mat4Utils.create();
    let inverseScale = Vec3Utils.create();
    let one = Vec3Utils.create(1);
    return function setTransformLocalMatrix(object: Object3D, transform) {
        Mat4Utils.getPosition(transform, position);
        Mat4Utils.getScale(transform, scale);
        Vec3Utils.div(one, scale, inverseScale);
        Mat4Utils.scale(transform, inverseScale, transformMatrixNoScale);
        Mat4Utils.getRotationQuat(transformMatrixNoScale, rotation);
        QuatUtils.normalize(rotation, rotation);
        ObjectUtils.setScaleLocal(object, scale);
        ObjectUtils.setRotationLocalQuat(object, rotation);
        ObjectUtils.setPositionLocal(object, position);
    };
}();

export function setTransformLocalQuat(object: Object3D, transform) {
    object.setTransformLocal(transform);
}

// RESET

// Position

export function resetPosition(object: Object3D) {
    ObjectUtils.resetPositionWorld(object);
}

export let resetPositionWorld = function () {
    let zero = Vec3Utils.create();
    return function resetPositionWorld(object: Object3D) {
        ObjectUtils.setPositionWorld(object, zero);
    };
}();

export let resetPositionLocal = function () {
    let zero = Vec3Utils.create();
    return function resetPositionLocal(object: Object3D) {
        ObjectUtils.setPositionLocal(object, zero);
    };
}();

// Rotation

export function resetRotation(object: Object3D) {
    ObjectUtils.resetRotationWorld(object);
}

export let resetRotationWorld = function () {
    let identity = QuatUtils.create();
    return function resetRotationWorld(object: Object3D) {
        ObjectUtils.setRotationWorldQuat(object, identity);
    };
}();

export let resetRotationLocal = function () {
    let identity = QuatUtils.create();
    return function resetRotationLocal(object: Object3D) {
        ObjectUtils.setRotationLocalQuat(object, identity);
    };
}();

// Scale

export function resetScale(object: Object3D) {
    ObjectUtils.resetScaleWorld(object);
}

export let resetScaleWorld = function () {
    let one = Vec3Utils.create(1);
    return function resetScaleWorld(object: Object3D) {
        ObjectUtils.setScaleWorld(object, one);
    };
}();

export let resetScaleLocal = function () {
    let one = Vec3Utils.create(1);
    return function resetScaleLocal(object: Object3D) {
        ObjectUtils.setScaleLocal(object, one);
    };
}();

// Transform

export function resetTransform(object: Object3D) {
    ObjectUtils.resetTransformWorld(object);
}

export function resetTransformWorld(object: Object3D) {
    ObjectUtils.resetScaleWorld(object);
    ObjectUtils.resetRotationWorld(object);
    ObjectUtils.resetPositionWorld(object);
}

export function resetTransformLocal(object: Object3D) {
    ObjectUtils.resetScaleLocal(object);
    ObjectUtils.resetRotationLocal(object);
    ObjectUtils.resetPositionLocal(object);
}

// TRANSFORMATIONS

// Translate

export function translate(object: Object3D, translation: Vector3) {
    ObjectUtils.translateWorld(object, translation);
}

export function translateWorld(object: Object3D, translation: Vector3) {
    object.translateWorld(translation);
}

export function translateLocal(object: Object3D, translation: Vector3) {
    object.translate(translation);
}

export function translateObject(object: Object3D, translation: Vector3) {
    object.translateObject(translation);
}

// Translate Axis

export function translateAxis(object: Object3D, amount: number, direction: Vector3) {
    ObjectUtils.translateAxisWorld(object, amount, direction);
}

export let translateAxisWorld = function () {
    let translation = Vec3Utils.create();
    return function translateAxisWorld(object: Object3D, amount: number, direction: Vector3) {
        Vec3Utils.scale(direction, amount, translation);
        ObjectUtils.translateWorld(object, translation);
    };
}();

export let translateAxisLocal = function () {
    let translation = Vec3Utils.create();
    return function translateAxisLocal(object: Object3D, amount: number, direction: Vector3) {
        Vec3Utils.scale(direction, amount, translation);
        ObjectUtils.translateLocal(object, translation);
    };
}();

export let translateAxisObject = function () {
    let translation = Vec3Utils.create();
    return function translateAxisObject(object: Object3D, amount: number, direction: Vector3) {
        Vec3Utils.scale(direction, amount, translation);
        ObjectUtils.translateObject(object, translation);
    };
}();

// Rotate

export function rotate(object: Object3D, rotation) {
    ObjectUtils.rotateWorld(object, rotation);
}

export function rotateDegrees(object: Object3D, rotation) {
    ObjectUtils.rotateWorldDegrees(object, rotation);
}

export function rotateRadians(object: Object3D, rotation) {
    ObjectUtils.rotateWorldRadians(object, rotation);
}

export function rotateMatrix(object: Object3D, rotation) {
    ObjectUtils.rotateWorldMatrix(object, rotation);
}

export function rotateQuat(object: Object3D, rotation) {
    ObjectUtils.rotateWorldQuat(object, rotation);
}

// Rotate World

export function rotateWorld(object: Object3D, rotation) {
    ObjectUtils.rotateWorldDegrees(object, rotation);
}

export let rotateWorldDegrees = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateWorldDegrees(object: Object3D, rotation) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        ObjectUtils.rotateWorldQuat(object, rotationQuat);
    };
}();

export let rotateWorldRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function rotateWorldRadians(object: Object3D, rotation) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.rotateWorldDegrees(object, degreesRotation);
    };
}();

export let rotateWorldMatrix = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateWorldMatrix(object: Object3D, rotation) {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        ObjectUtils.rotateWorldQuat(object, rotationQuat);
    };
}();

export let rotateWorldQuat = function () {
    let currentRotationQuat = QuatUtils.create();
    return function rotateWorldQuat(object: Object3D, rotation) {
        ObjectUtils.getRotationWorldQuat(object, currentRotationQuat);
        QuatUtils.mul(rotation, currentRotationQuat, currentRotationQuat);
        QuatUtils.normalize(currentRotationQuat, currentRotationQuat);
        ObjectUtils.setRotationWorldQuat(object, currentRotationQuat);
    };
}();

// Rotate Local

export function rotateLocal(object: Object3D, rotation) {
    ObjectUtils.rotateLocalDegrees(object, rotation);
}

export let rotateLocalDegrees = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateLocalDegrees(object: Object3D, rotation) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        ObjectUtils.rotateLocalQuat(object, rotationQuat);
    };
}();

export let rotateLocalRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function rotateLocalRadians(object: Object3D, rotation) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.rotateLocalDegrees(object, degreesRotation);
    };
}();

export let rotateLocalMatrix = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateLocalMatrix(object: Object3D, rotation) {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        ObjectUtils.rotateLocalQuat(object, rotationQuat);
    };
}();

export let rotateLocalQuat = function () {
    let currentRotationQuat = QuatUtils.create();
    return function rotateLocalQuat(object: Object3D, rotation) {
        ObjectUtils.getRotationLocalQuat(object, currentRotationQuat);
        QuatUtils.mul(rotation, currentRotationQuat, currentRotationQuat);
        QuatUtils.normalize(currentRotationQuat, currentRotationQuat);
        ObjectUtils.setRotationLocalQuat(object, currentRotationQuat);
    };
}();

// Rotate Object

export function rotateObject(object: Object3D, rotation) {
    ObjectUtils.rotateObjectDegrees(object, rotation);
}

export let rotateObjectDegrees = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateObjectDegrees(object: Object3D, rotation) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        ObjectUtils.rotateObjectQuat(object, rotationQuat);
    };
}();

export let rotateObjectRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function rotateObjectRadians(object: Object3D, rotation) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.rotateObjectDegrees(object, degreesRotation);
    };
}();

export let rotateObjectMatrix = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateObjectMatrix(object: Object3D, rotation) {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        ObjectUtils.rotateObjectQuat(object, rotationQuat);
    };
}();

export function rotateObjectQuat(object: Object3D, rotation) {
    object.rotateObject(rotation);
}

// Rotate Axis

export function rotateAxis(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisWorld(object, angle, axis);
}

export function rotateAxisDegrees(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisWorldDegrees(object, angle, axis);
}

export function rotateAxisRadians(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisWorldRadians(object, angle, axis);
}

// Rotate Axis World

export function rotateAxisWorld(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisWorldDegrees(object, angle, axis);
}

export function rotateAxisWorldDegrees(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisWorldRadians(object, MathUtils.toRadians(angle), axis);
}

export let rotateAxisWorldRadians = function () {
    let rotation = QuatUtils.create();
    return function rotateAxisWorldRadians(object: Object3D, angle: number, axis: Vector3) {
        QuatUtils.fromAxisRadians(angle, axis, rotation);
        ObjectUtils.rotateWorldQuat(object, rotation);
    };
}();

// Rotate Axis Local

export function rotateAxisLocal(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisLocalDegrees(object, angle, axis);
}

export function rotateAxisLocalDegrees(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisLocalRadians(object, MathUtils.toRadians(angle), axis);
}

export let rotateAxisLocalRadians = function () {
    let rotation = QuatUtils.create();
    return function rotateAxisLocalRadians(object: Object3D, angle: number, axis: Vector3) {
        QuatUtils.fromAxisRadians(angle, axis, rotation);
        ObjectUtils.rotateLocalQuat(object, rotation);
    };
}();

// Rotate Axis Object

export function rotateAxisObject(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisObjectDegrees(object, angle, axis);
}

export function rotateAxisObjectDegrees(object: Object3D, angle: number, axis: Vector3) {
    ObjectUtils.rotateAxisObjectRadians(object, MathUtils.toRadians(angle), axis);
}

export let rotateAxisObjectRadians = function () {
    let rotation = QuatUtils.create();
    return function rotateAxisObjectRadians(object: Object3D, angle: number, axis: Vector3) {
        QuatUtils.fromAxisRadians(angle, axis, rotation);
        ObjectUtils.rotateObjectQuat(object, rotation);
    };
}();

// Rotate Around

export function rotateAround(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundWorld(object, rotation, origin);
}

export function rotateAroundDegrees(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundWorldDegrees(object, rotation, origin);
}

export function rotateAroundRadians(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundWorldRadians(object, rotation, origin);
}

export function rotateAroundMatrix(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundWorldMatrix(object, rotation, origin);
}

export function rotateAroundQuat(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundWorldQuat(object, rotation, origin);
}

// Rotate Around World

export function rotateAroundWorld(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundWorldDegrees(object, rotation, origin);
}

export let rotateAroundWorldDegrees = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateAroundWorldDegrees(object: Object3D, rotation, origin: Vector3) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        ObjectUtils.rotateAroundWorldQuat(object, rotationQuat, origin);
    };
}();

export let rotateAroundWorldRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function rotateAroundWorldRadians(object: Object3D, rotation, origin: Vector3) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.rotateAroundWorldDegrees(object, degreesRotation, origin);
    };
}();

export let rotateAroundWorldMatrix = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateAroundWorldMatrix(object: Object3D, rotation, origin: Vector3) {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        ObjectUtils.rotateAroundWorldQuat(object, rotationQuat, origin);
    };
}();

export let rotateAroundWorldQuat = function () {
    let axis = Vec3Utils.create();
    return function rotateAroundWorldQuat(object: Object3D, rotation, origin: Vector3) {
        QuatUtils.getAxis(rotation, axis);
        let angle = QuatUtils.getAngleRadians(rotation,);
        ObjectUtils.rotateAroundAxisWorldRadians(object, angle, axis, origin);
    };
}();

// Rotate Around Local

export function rotateAroundLocal(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundLocalDegrees(object, rotation, origin);
}

export let rotateAroundLocalDegrees = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateAroundLocalDegrees(object: Object3D, rotation, origin: Vector3) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        ObjectUtils.rotateAroundLocalQuat(object, rotationQuat, origin);
    };
}();

export let rotateAroundLocalRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function rotateAroundLocalRadians(object: Object3D, rotation, origin: Vector3) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.rotateAroundLocalDegrees(object, degreesRotation, origin);
    };
}();

export let rotateAroundLocalMatrix = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateAroundLocalMatrix(object: Object3D, rotation, origin: Vector3) {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        ObjectUtils.rotateAroundLocalQuat(object, rotationQuat, origin);
    };
}();

export let rotateAroundLocalQuat = function () {
    let axis = Vec3Utils.create();
    return function rotateAroundLocalQuat(object: Object3D, rotation, origin: Vector3) {
        QuatUtils.getAxis(rotation, axis);
        let angle = QuatUtils.getAngleRadians(rotation,);
        ObjectUtils.rotateAroundAxisLocalRadians(object, angle, axis, origin);
    };
}();

// Rotate Around Object

export function rotateAroundObject(object: Object3D, rotation, origin: Vector3) {
    ObjectUtils.rotateAroundObjectDegrees(object, rotation, origin);
}

export let rotateAroundObjectDegrees = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateAroundObjectDegrees(object: Object3D, rotation, origin: Vector3) {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        ObjectUtils.rotateAroundObjectQuat(object, rotationQuat, origin);
    };
}();

export let rotateAroundObjectRadians = function () {
    let degreesRotation = Vec3Utils.create();
    return function rotateAroundObjectRadians(object: Object3D, rotation, origin: Vector3) {
        degreesRotation = Vec3Utils.toDegrees(rotation, degreesRotation);
        ObjectUtils.rotateAroundObjectDegrees(object, degreesRotation, origin);
    };
}();

export let rotateAroundObjectMatrix = function () {
    let rotationQuat = QuatUtils.create();
    return function rotateAroundObjectMatrix(object: Object3D, rotation, origin: Vector3) {
        Mat3Utils.toQuat(rotation, rotationQuat);
        QuatUtils.normalize(rotationQuat, rotationQuat);
        ObjectUtils.rotateAroundObjectQuat(object, rotationQuat, origin);
    };
}();

export let rotateAroundObjectQuat = function () {
    let axis = Vec3Utils.create();
    return function rotateAroundObjectQuat(object: Object3D, rotation, origin: Vector3) {
        QuatUtils.getAxis(rotation, axis);
        let angle = QuatUtils.getAngleRadians(rotation,);
        ObjectUtils.rotateAroundAxisObjectRadians(object, angle, axis, origin);
    };
}();

// Rotate Around Axis

export function rotateAroundAxis(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisWorld(object, angle, axis, origin);
}

export function rotateAroundAxisDegrees(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisWorldDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisRadians(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisWorldRadians(object, angle, axis, origin);
}

// Rotate Around Axis World

export function rotateAroundAxisWorld(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisWorldDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisWorldDegrees(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisWorldRadians(object, MathUtils.toRadians(angle), axis, origin);
}

export let rotateAroundAxisWorldRadians = function () {
    let transformToRotate = Quat2Utils.create();
    let transformToRotateConjugate = Quat2Utils.create();
    let transformQuat = Quat2Utils.create();
    let defaultQuat = QuatUtils.create();
    return function rotateAroundAxisWorldRadians(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
        Quat2Utils.setPositionRotationQuat(transformToRotate, origin, defaultQuat);
        ObjectUtils.getTransformWorldQuat(object, transformQuat);
        Quat2Utils.conjugate(transformToRotate, transformToRotateConjugate);
        Quat2Utils.mul(transformToRotateConjugate, transformQuat, transformQuat);
        Quat2Utils.rotateAxisRadians(transformToRotate, angle, axis, transformToRotate);
        Quat2Utils.mul(transformToRotate, transformQuat, transformQuat);
        ObjectUtils.setTransformWorldQuat(object, transformQuat);
    };
}();

// Rotate Around Axis Local

export function rotateAroundAxisLocal(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisLocalDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisLocalDegrees(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisLocalRadians(object, MathUtils.toRadians(angle), axis, origin);
}

export let rotateAroundAxisLocalRadians = function () {
    let convertedPosition = Vec3Utils.create();
    let convertedAxis = Vec3Utils.create();
    return function rotateAroundAxisLocalRadians(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
        ObjectUtils.convertPositionLocalToWorld(object, origin, convertedPosition);
        ObjectUtils.convertDirectionLocalToWorld(object, axis, convertedAxis);
        ObjectUtils.rotateAroundAxisWorldRadians(object, angle, convertedAxis, convertedPosition);
    };
}();

// Rotate Around Axis Object

export function rotateAroundAxisObject(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisObjectDegrees(object, angle, axis, origin);
}

export function rotateAroundAxisObjectDegrees(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
    ObjectUtils.rotateAroundAxisObjectRadians(object, MathUtils.toRadians(angle), axis, origin);
}

export let rotateAroundAxisObjectRadians = function () {
    let convertedPosition = Vec3Utils.create();
    let convertedAxis = Vec3Utils.create();
    return function rotateAroundAxisObjectRadians(object: Object3D, angle: number, axis: Vector3, origin: Vector3) {
        ObjectUtils.convertPositionObjectToWorld(object, origin, convertedPosition);
        ObjectUtils.convertDirectionObjectToWorld(object, axis, convertedAxis);
        ObjectUtils.rotateAroundAxisWorldRadians(object, angle, convertedAxis, convertedPosition);
    };
}();

// Scale

// For now it does not really make sense in WL to scale in world space or parent space
// so there is no scale default function

export let scaleObject = function () {
    let vector = Vec3Utils.create();
    return function scaleObject(object: Object3D, scale: number | Vector3) {
        if (isNaN(scale as number)) {
            object.scaleLocal(scale as Vector3);
        } else {
            Vec3Utils.set(vector, scale);
            object.scaleLocal(vector);
        }
    };
}();

// Look At

export function lookAt(object: Object3D, position: Vector3, up: Vector3) {
    ObjectUtils.lookAtWorld(object, position, up);
}

export let lookAtWorld = function () {
    let direction = Vec3Utils.create();
    return function lookAtWorld(object: Object3D, position: Vector3, up: Vector3) {
        ObjectUtils.getPositionWorld(object, direction);
        Vec3Utils.sub(position, direction, direction);
        ObjectUtils.lookToWorld(object, direction, up);
    };
}();

export let lookAtLocal = function () {
    let direction = Vec3Utils.create();
    return function lookAtLocal(object: Object3D, position: Vector3, up: Vector3) {
        ObjectUtils.getPositionLocal(object, direction);
        Vec3Utils.sub(position, direction, direction);
        ObjectUtils.lookToLocal(object, direction, up);
    };
}();

export function lookTo(object: Object3D, direction: Vector3, up: Vector3) {
    ObjectUtils.lookToWorld(object, direction, up);
}

export let lookToWorld = function () {
    let internalUp = Vec3Utils.create();
    return function lookToWorld(object: Object3D, direction: Vector3, up = ObjectUtils.getUpWorld(object: Object3D, internalUp)) {
        ObjectUtils.setForwardWorld(object, direction, up);
    };
}();

export let lookToLocal = function () {
    let internalUp = Vec3Utils.create();
    return function lookToLocal(object: Object3D, direction: Vector3, up = ObjectUtils.getUpLocal(object: Object3D, internalUp)) {
        ObjectUtils.setForwardLocal(object, direction, up);
    };
}();

// EXTRA

// Parent

export let setParent = function () {
    let position = Vec3Utils.create();
    let rotation = QuatUtils.create();
    let scale = Vec3Utils.create();
    return function setParent(object: Object3D, newParent: Object3D, keepTransformWorld: boolean = true): Object3D {
        if (!keepTransformWorld) {
            object.parent = newParent;
        } else {
            ObjectUtils.getPositionWorld(object, position);
            ObjectUtils.getRotationWorldQuat(object, rotation);
            ObjectUtils.getScaleWorld(object, scale);
            object.parent = newParent;
            ObjectUtils.setScaleWorld(object, scale);
            ObjectUtils.setRotationWorldQuat(object, rotation);
            ObjectUtils.setPositionWorld(object, position);
        }

        return object;
    };
}();

export function getParent(object: Object3D) {
    return object.parent;
}

// Convert Vector Object World

export let convertPositionObjectToWorld = function () {
    let matrix = Mat4Utils.create();
    return function convertPositionObjectToWorld(object: Object3D, position: Vector3, resultPosition: Vector3 = Vec3Utils.create()) {
        ObjectUtils.getTransformWorldMatrix(object, matrix);
        Vec3Utils.transformMat4(position, matrix, resultPosition);
        return resultPosition;
    };
}();

export let convertDirectionObjectToWorld = function () {
    let rotation = QuatUtils.create();
    return function convertDirectionObjectToWorld(object: Object3D, direction: Vector3, resultDirection: Vector3 = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        Vec3Utils.transformQuat(direction, rotation, resultDirection);
        return resultDirection;
    };
}();

export let convertPositionWorldToObject = function () {
    let matrix = Mat4Utils.create();
    return function convertPositionWorldToObject(object: Object3D, position: Vector3, resultPosition: Vector3 = Vec3Utils.create()) {
        ObjectUtils.getTransformWorldMatrix(object, matrix);
        Mat4Utils.invert(matrix, matrix);
        Vec3Utils.transformMat4(position, matrix, resultPosition);
        return resultPosition;
    };
}();

export let convertDirectionWorldToObject = function () {
    let rotation = QuatUtils.create();
    return function convertDirectionWorldToObject(object: Object3D, direction: Vector3, resultDirection: Vector3 = Vec3Utils.create()) {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        QuatUtils.conjugate(rotation, rotation);
        Vec3Utils.transformQuat(direction, rotation, resultDirection);
        return resultDirection;
    };
}();

// Convert Vector Local World

export function convertPositionLocalToWorld(object: Object3D, position: Vector3, resultPosition: Vector3 = Vec3Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertPositionObjectToWorld(ObjectUtils.getParent(object), position, resultPosition);
    } else {
        Vec3Utils.copy(position, resultPosition);
    }
    return resultPosition;
}

export function convertDirectionLocalToWorld(object: Object3D, direction: Vector3, resultDirection: Vector3 = Vec3Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertDirectionObjectToWorld(ObjectUtils.getParent(object), direction, resultDirection);
    } else {
        Vec3Utils.copy(direction, resultDirection);
    }
    return resultDirection;
}

export function convertPositionWorldToLocal(object: Object3D, position: Vector3, resultPosition: Vector3 = Vec3Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertPositionWorldToObject(ObjectUtils.getParent(object), position, resultPosition);
    } else {
        Vec3Utils.copy(position, resultPosition);
    }
    return resultPosition;
}

export function convertDirectionWorldToLocal(object: Object3D, direction: Vector3, resultDirection: Vector3 = Vec3Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertDirectionWorldToObject(ObjectUtils.getParent(object), direction, resultDirection);
    } else {
        Vec3Utils.copy(direction, resultDirection);
    }
    return resultDirection;
}

// Convert Vector Local Object

// I need to use the converson to world and then local also use the parent scale that changes the position in local space

export function convertPositionObjectToLocal(object: Object3D, position: Vector3, resultPosition: Vector3 = Vec3Utils.create()) {
    ObjectUtils.convertPositionObjectToWorld(object, position, resultPosition);
    ObjectUtils.convertPositionWorldToLocal(object, resultPosition, resultPosition);
    return resultPosition;
}

export function convertDirectionObjectToLocal(object: Object3D, direction: Vector3, resultDirection: Vector3 = Vec3Utils.create()) {
    ObjectUtils.convertDirectionObjectToWorld(object, direction, resultDirection);
    ObjectUtils.convertDirectionWorldToLocal(object, resultDirection, resultDirection);
    return resultDirection;
}

export function convertPositionLocalToObject(object: Object3D, position: Vector3, resultPosition: Vector3 = Vec3Utils.create()) {
    ObjectUtils.convertPositionLocalToWorld(object, position, resultPosition);
    ObjectUtils.convertPositionWorldToObject(object, resultPosition, resultPosition);
    return resultPosition;
}

export function convertDirectionLocalToObject(object: Object3D, direction: Vector3, resultDirection: Vector3 = Vec3Utils.create()) {
    ObjectUtils.convertDirectionLocalToWorld(object, direction, resultDirection);
    ObjectUtils.convertDirectionWorldToObject(object, resultDirection, resultDirection);
    return resultDirection;
}

// Convert Transform Object World

export function convertTransformObjectToWorld(object: Object3D, transform, resultTransform) {
    return ObjectUtils.convertTransformObjectToWorldMatrix(object, transform, resultTransform);
}

export let convertTransformObjectToWorldMatrix = function () {
    let convertTransform = Mat4Utils.create();
    let position = Vec3Utils.create();
    let scale = Vec3Utils.create();
    let inverseScale = Vec3Utils.create();
    let one = Vec3Utils.create(1);
    return function convertTransformObjectToWorldMatrix(object: Object3D, transform, resultTransform = Mat4Utils.create()) {
        ObjectUtils.getTransformWorldMatrix(object, convertTransform);
        if (ObjectUtils.hasUniformScaleWorld(object)) {
            Mat4Utils.mul(convertTransform, transform, resultTransform);
        } else {
            Vec3Utils.set(position, transform[12], transform[13], transform[14]);
            ObjectUtils.convertPositionObjectToWorld(object, position, position);

            Mat4Utils.getScale(convertTransform, scale);
            Vec3Utils.div(one, scale, inverseScale);
            Mat4Utils.scale(convertTransform, inverseScale, convertTransform);

            Mat4Utils.mul(convertTransform, transform, resultTransform);
            Mat4Utils.scale(resultTransform, scale, resultTransform);

            resultTransform[12] = position[0];
            resultTransform[13] = position[1];
            resultTransform[14] = position[2];
            resultTransform[15] = 1;
        }
        return resultTransform;
    };
}();

export let convertTransformObjectToWorldQuat = function () {
    let position = Vec3Utils.create();
    let rotation = QuatUtils.create();
    return function convertTransformObjectToWorldQuat(object: Object3D, transform, resultTransform = Quat2Utils.create()) {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        QuatUtils.mul(rotation, transform, rotation);
        Quat2Utils.getPosition(transform, position);
        ObjectUtils.convertPositionObjectToWorld(object, position, position);
        Quat2Utils.setPositionRotationQuat(resultTransform, position, rotation);
        return resultTransform;
    };
}();

export function convertTransformWorldToObject(object: Object3D, transform, resultTransform) {
    return ObjectUtils.convertTransformWorldToObjectMatrix(object, transform, resultTransform);
}

export let convertTransformWorldToObjectMatrix = function () {
    let convertTransform = Mat4Utils.create();
    let position = Vec3Utils.create();
    let scale = Vec3Utils.create();
    let inverseScale = Vec3Utils.create();
    let one = Vec3Utils.create(1);
    return function convertTransformWorldToObjectMatrix(object: Object3D, transform, resultTransform = Mat4Utils.create()) {
        ObjectUtils.getTransformWorldMatrix(object, convertTransform);
        if (ObjectUtils.hasUniformScaleWorld(object)) {
            Mat4Utils.invert(convertTransform, convertTransform);
            Mat4Utils.mul(convertTransform, transform, resultTransform);
        } else {
            Vec3Utils.set(position, transform[12], transform[13], transform[14]);
            ObjectUtils.convertPositionWorldToObject(object, position, position);

            Mat4Utils.getScale(convertTransform, scale);
            Vec3Utils.div(one, scale, inverseScale);
            Mat4Utils.scale(convertTransform, inverseScale, convertTransform);

            Mat4Utils.invert(convertTransform, convertTransform);
            Mat4Utils.mul(convertTransform, transform, resultTransform);
            Mat4Utils.scale(resultTransform, inverseScale, resultTransform);

            resultTransform[12] = position[0];
            resultTransform[13] = position[1];
            resultTransform[14] = position[2];
            resultTransform[15] = 1;
        }
        return resultTransform;
    };
}();

export let convertTransformWorldToObjectQuat = function () {
    let position = Vec3Utils.create();
    let rotation = QuatUtils.create();
    return function convertTransformWorldToObjectQuat(object: Object3D, transform, resultTransform = Quat2Utils.create()) {
        ObjectUtils.getRotationWorldQuat(object, rotation);
        QuatUtils.conjugate(rotation, rotation);
        QuatUtils.mul(rotation, transform, rotation);
        Quat2Utils.getPosition(transform, position);
        ObjectUtils.convertPositionWorldToObject(object, position, position);
        Quat2Utils.setPositionRotationQuat(resultTransform, position, rotation);
        return resultTransform;
    };
}();

// Convert Transform Local World

export function convertTransformLocalToWorld(object: Object3D, transform, resultTransform) {
    return ObjectUtils.convertTransformLocalToWorldMatrix(object, transform, resultTransform);
}

export function convertTransformLocalToWorldMatrix(object: Object3D, transform, resultTransform = Mat4Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertTransformObjectToWorldMatrix(ObjectUtils.getParent(object), transform, resultTransform);
    } else {
        Mat4Utils.copy(transform, resultTransform);
    }
    return resultTransform;
}

export function convertTransformLocalToWorldQuat(object: Object3D, transform, resultTransform = Quat2Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertTransformObjectToWorldQuat(ObjectUtils.getParent(object), transform, resultTransform);
    } else {
        Quat2Utils.copy(transform, resultTransform);
    }
    return resultTransform;
}

export function convertTransformWorldToLocal(object: Object3D, transform, resultTransform) {
    return ObjectUtils.convertTransformWorldToLocalMatrix(object, transform, resultTransform);
}

export function convertTransformWorldToLocalMatrix(object: Object3D, transform, resultTransform = Mat4Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertTransformWorldToObjectMatrix(ObjectUtils.getParent(object), transform, resultTransform);
    } else {
        Mat4Utils.copy(transform, resultTransform);
    }
    return resultTransform;
}

export function convertTransformWorldToLocalQuat(object: Object3D, transform, resultTransform = Quat2Utils.create()) {
    if (ObjectUtils.getParent(object)) {
        ObjectUtils.convertTransformWorldToObjectQuat(ObjectUtils.getParent(object), transform, resultTransform);
    } else {
        Quat2Utils.copy(transform, resultTransform);
    }
    return resultTransform;
}

// Convert Transform Object Local

// I need to use the converson to world and then local also use the parent scale that changes the position in local space

export function convertTransformObjectToLocal(object: Object3D, transform, resultTransform) {
    return ObjectUtils.convertTransformObjectToLocalMatrix(object, transform, resultTransform);
}

export function convertTransformObjectToLocalMatrix(object: Object3D, transform, resultTransform = Mat4Utils.create()) {
    ObjectUtils.convertTransformObjectToWorldMatrix(object, transform, resultTransform);
    ObjectUtils.convertTransformWorldToLocalMatrix(object, resultTransform, resultTransform);
    return resultTransform;
}

export function convertTransformObjectToLocalQuat(object: Object3D, transform, resultTransform = Quat2Utils.create()) {
    ObjectUtils.convertTransformObjectToWorldQuat(object, transform, resultTransform);
    ObjectUtils.convertTransformWorldToLocalQuat(object, resultTransform, resultTransform);
    return resultTransform;
}

export function convertTransformLocalToObject(object: Object3D, transform, resultTransform) {
    return ObjectUtils.convertTransformLocalToObjectMatrix(object, transform, resultTransform);
}

export function convertTransformLocalToObjectMatrix(object: Object3D, transform, resultTransform = Mat4Utils.create()) {
    ObjectUtils.convertTransformLocalToWorldMatrix(object, transform, resultTransform);
    ObjectUtils.convertTransformWorldToObjectMatrix(object, resultTransform, resultTransform);
    return resultTransform;
}

export function convertTransformLocalToObjectQuat(object: Object3D, transform, resultTransform = Quat2Utils.create()) {
    ObjectUtils.convertTransformLocalToWorldQuat(object, transform, resultTransform);
    ObjectUtils.convertTransformWorldToObjectQuat(object, resultTransform, resultTransform);
    return resultTransform;
}

// Component

export function addComponent<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, paramsOrActive: Record<string, any> | boolean | null = null, active: boolean | null = null): T | null {
    let params = undefined;

    if (typeof paramsOrActive == "boolean") {
        params = {};
        params["active"] = paramsOrActive;
    } else {
        if (paramsOrActive != null) {
            params = paramsOrActive;
        }

        if (active != null) {
            if (params == null) {
                params = {};
            }

            params["active"] = active;
        }
    }

    return object.addComponent(typeOrClass, params);
}

export function getComponent<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    return ObjectUtils.getComponentHierarchy(object, typeOrClass, index);
}

export function getComponentSelf<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    return object.getComponent(typeOrClass, index);
}

export function getComponentHierarchy<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    return ObjectUtils.getComponentHierarchyBreadth(object, typeOrClass, index);
}

export function getComponentHierarchyBreadth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    let objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getComponentObjects(objects, typeOrClass, index);
}

export function getComponentHierarchyDepth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    let objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getComponentObjects(objects, typeOrClass, index);
}

export function getComponentDescendants<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    return ObjectUtils.getComponentDescendantsBreadth(object, typeOrClass, index);
}

export function getComponentDescendantsBreadth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    let objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getComponentObjects(objects, typeOrClass, index);
}

export function getComponentDescendantsDepth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    let objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getComponentObjects(objects, typeOrClass, index);
}

export function getComponentChildren<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    let objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getComponentObjects(objects, typeOrClass, index);
}

export function getComponents<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    return ObjectUtils.getComponentsHierarchy(object, typeOrClass);
}

export function getComponentsSelf<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    return object.getComponents(typeOrClass);
}

export function getComponentsHierarchy<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    return ObjectUtils.getComponentsHierarchyBreadth(object, typeOrClass);
}

export function getComponentsHierarchyBreadth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    let objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getComponentsObjects(objects, typeOrClass);
}

export function getComponentsHierarchyDepth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    let objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getComponentsObjects(objects, typeOrClass);
}

export function getComponentsDescendants<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    return ObjectUtils.getComponentsDescendantsBreadth(object, typeOrClass);
}

export function getComponentsDescendantsBreadth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    let objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getComponentsObjects(objects, typeOrClass);
}

export function getComponentsDescendantsDepth<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    let objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getComponentsObjects(objects, typeOrClass);
}

export function getComponentsChildren<T extends Component>(object: Object3D, typeOrClass: string | ComponentConstructor<T>): T[] {
    let objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getComponentsObjects(objects, typeOrClass);
}

// Active

export function setActive(object: Object3D, active: boolean) {
    ObjectUtils.setActiveHierarchy(object, active);
}

export function setActiveSelf(object: Object3D, active: boolean) {
    object.active = active;
}

export function setActiveHierarchy(object: Object3D, active: boolean) {
    ObjectUtils.setActiveHierarchyBreadth(object, active);
}

export function setActiveHierarchyBreadth(object: Object3D, active: boolean) {
    let objects = ObjectUtils.getHierarchyBreadth(object);
    ObjectUtils.setActiveObjects(objects, active);
}

export function setActiveHierarchyDepth(object: Object3D, active: boolean) {
    let objects = ObjectUtils.getHierarchyDepth(object);
    ObjectUtils.setActiveObjects(objects, active);
}

export function setActiveDescendants(object: Object3D, active: boolean) {
    ObjectUtils.setActiveDescendantsBreadth(object, active);
}

export function setActiveDescendantsBreadth(object: Object3D, active: boolean) {
    let objects = ObjectUtils.getDescendantsBreadth(object);
    ObjectUtils.setActiveObjects(objects, active);
}

export function setActiveDescendantsDepth(object: Object3D, active: boolean) {
    let objects = ObjectUtils.getDescendantsDepth(object);
    ObjectUtils.setActiveObjects(objects, active);
}

export function setActiveChildren(object: Object3D, active: boolean) {
    let objects = ObjectUtils.getChildren(object);
    ObjectUtils.setActiveObjects(objects, active);
}

// Uniform Scale

export function hasUniformScale(object: Object3D) {
    return ObjectUtils.hasUniformScaleWorld(object);
}

export let hasUniformScaleWorld = function () {
    let scale = Vec3Utils.create();
    return function hasUniformScaleWorld(object: Object3D) {
        ObjectUtils.getScaleWorld(object, scale);
        return Math.abs(scale[0] - scale[1]) < MathUtils.EPSILON && Math.abs(scale[1] - scale[2]) < MathUtils.EPSILON && Math.abs(scale[0] - scale[2]) < MathUtils.EPSILON;
    };
}();

export let hasUniformScaleLocal = function () {
    let scale = Vec3Utils.create();
    return function hasUniformScaleLocal(object: Object3D) {
        ObjectUtils.getScaleLocal(object, scale);
        return Math.abs(scale[0] - scale[1]) < MathUtils.EPSILON && Math.abs(scale[1] - scale[2]) < MathUtils.EPSILON && Math.abs(scale[0] - scale[2]) < MathUtils.EPSILON;
    };
}();

// Clone

export let clone = function () {
    let scale = Vec3Utils.create();
    let transformQuat = Quat2Utils.create();
    return function clone(object: Object3D, cloneParams = new CloneParams()) {
        let clonedObject = null;

        let cloneParent = cloneParams.myCloneParent === undefined ? ObjectUtils.getParent(object) : cloneParams.myCloneParent;

        if (cloneParams.myUseDefaultObjectClone) {
            clonedObject = object.clone(cloneParent);

            if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive) {
                let clonedComponents = ObjectUtils.getComponents(clonedObject);
                for (let clonedComponent of clonedComponents) {

                    // Trigger start, which otherwise would be called later, on first activation
                    if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive && !clonedComponent.active) {
                        clonedComponent.active = true;
                        clonedComponent.active = false;
                    }
                }
            }
        } else if (ObjectUtils.isCloneable(object, cloneParams)) {
            let objectsToCloneData = [];
            objectsToCloneData.push([cloneParent, object]);

            // Create the object hierarchy
            let objectsToCloneComponentsData = [];
            while (objectsToCloneData.length > 0) {
                let cloneData = objectsToCloneData.shift();
                let parent = cloneData[0];
                let objectToClone = cloneData[1];

                let currentClonedObject = (parent != null) ? ObjectUtils.addObject(parent) : SceneUtils.addObject(Globals.getScene(ObjectUtils.getEngine(object)));
                ObjectUtils.setName(currentClonedObject, ObjectUtils.getName(objectToClone));

                ObjectUtils.setScaleLocal(currentClonedObject, ObjectUtils.getScaleLocal(objectToClone, scale));
                ObjectUtils.setTransformLocalQuat(currentClonedObject, ObjectUtils.getTransformLocalQuat(objectToClone, transformQuat));

                if (!cloneParams.myIgnoreComponents) {
                    objectsToCloneComponentsData.push([objectToClone, currentClonedObject]);
                }

                if (!cloneParams.myIgnoreDescendants) {
                    for (let child of ObjectUtils.getChildren(objectToClone)) {
                        let cloneDescendant = false;
                        if (cloneParams.myDescendantsToInclude.length > 0) {
                            cloneDescendant = cloneParams.myDescendantsToInclude.find(descendantToInclude => ObjectUtils.equals(descendantToInclude, child)) != null;
                        } else {
                            cloneDescendant = cloneParams.myDescendantsToIgnore.find(descendantToIgnore => ObjectUtils.equals(descendantToIgnore, child)) == null;
                        }

                        if (cloneDescendant && cloneParams.myIgnoreDescendantCallback != null) {
                            cloneDescendant = !cloneParams.myIgnoreDescendantCallback(child);
                        }

                        if (cloneDescendant) {
                            objectsToCloneData.push([currentClonedObject, child]);
                        }
                    }
                }

                if (clonedObject == null) {
                    clonedObject = currentClonedObject;
                }
            }

            // Get the components to clone
            let componentsToCloneData = [];
            while (objectsToCloneComponentsData.length > 0) {
                let cloneData = objectsToCloneComponentsData.shift();
                let objectToClone = cloneData[0];
                let currentClonedObject = cloneData[1];

                let components = ObjectUtils.getComponentsSelf(objectToClone);
                for (let component of components) {
                    if (ComponentUtils.isCloneable(component.type, cloneParams.myUseDefaultComponentClone || cloneParams.myUseDefaultComponentCloneAsFallback, ObjectUtils.getEngine(object))) {
                        let cloneComponent = false;
                        if (cloneParams.myComponentsToInclude.length > 0) {
                            cloneComponent = cloneParams.myComponentsToInclude.indexOf(component.type) != -1;
                        } else {
                            cloneComponent = cloneParams.myComponentsToIgnore.indexOf(component.type) == -1;
                        }

                        if (cloneComponent && cloneParams.myIgnoreComponentCallback != null) {
                            cloneComponent = !cloneParams.myIgnoreComponentCallback(component);
                        }

                        if (cloneComponent) {
                            componentsToCloneData.push([component, currentClonedObject]);
                        }
                    }
                }
            }

            // Clone the components
            let componentsToPostProcessData = [];
            while (componentsToCloneData.length > 0) {
                let cloneData = componentsToCloneData.shift();
                let componentToClone = cloneData[0];
                let currentClonedObject = cloneData[1];
                let clonedComponent = null;


                if (!cloneParams.myUseDefaultComponentClone) {
                    clonedComponent = ComponentUtils.clone(componentToClone, currentClonedObject, cloneParams.myComponentDeepCloneParams, cloneParams.myComponentCustomCloneParams, cloneParams.myUseDefaultComponentCloneAsFallback, cloneParams.myDefaultComponentCloneAutoStartIfNotActive);
                } else {
                    clonedComponent = ComponentUtils.cloneDefault(componentToClone, currentClonedObject, cloneParams.myDefaultComponentCloneAutoStartIfNotActive);
                }

                if (clonedComponent != null) {
                    if (ComponentUtils.hasClonePostProcess(componentToClone.type, ObjectUtils.getEngine(object))) {
                        componentsToPostProcessData.push([componentToClone, clonedComponent]);
                    }
                }
            }

            // Clone post process
            // Can be useful if you have to get some data from other components in the hierarchy which have now been created
            while (componentsToPostProcessData.length > 0) {
                let cloneData = componentsToPostProcessData.shift();
                let componentToClone = cloneData[0];
                let currentClonedComponent = cloneData[1];

                ComponentUtils.clonePostProcess(componentToClone, currentClonedComponent, cloneParams.myComponentDeepCloneParams, cloneParams.myComponentCustomCloneParams);
            }
        } else if (cloneParams.myUseDefaultObjectCloneAsFallback) {
            clonedObject = object.clone(cloneParent);

            if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive) {
                let clonedComponents = clonedObject.pp_getComponents();
                for (let clonedComponent of clonedComponents) {

                    // Trigger start, which otherwise would be called later, on first activation
                    if (cloneParams.myDefaultComponentCloneAutoStartIfNotActive && !clonedComponent.active) {
                        clonedComponent.active = true;
                        clonedComponent.active = false;
                    }
                }
            }
        }

        return clonedObject;
    };
}();

export function isCloneable(object: Object3D, cloneParams = new CloneParams()) {
    if (cloneParams.myIgnoreNonCloneable || cloneParams.myIgnoreComponents || cloneParams.myUseDefaultComponentClone || cloneParams.myUseDefaultComponentCloneAsFallback) {
        return true;
    }

    let cloneable = true;

    let objectsToClone = [];
    objectsToClone.push(object);

    while (cloneable && objectsToClone.length > 0) {
        let objectToClone = objectsToClone.shift();

        let components = ObjectUtils.getComponentsSelf(objectToClone);
        for (let component of components) {
            let cloneComponent = false;
            if (cloneParams.myComponentsToInclude.length > 0) {
                cloneComponent = cloneParams.myComponentsToInclude.indexOf(component.type) != -1;
            } else {
                cloneComponent = cloneParams.myComponentsToIgnore.indexOf(component.type) == -1;
            }

            if (cloneComponent && cloneParams.myIgnoreComponentCallback != null) {
                cloneComponent = !cloneParams.myIgnoreComponentCallback(component);
            }

            if (cloneComponent && !ComponentUtils.isCloneable(component.type, false, ObjectUtils.getEngine(object))) {
                cloneable = false;
                break;
            }
        }

        if (cloneable && !cloneParams.myIgnoreDescendants) {
            for (let child of ObjectUtils.getChildren(objectToClone)) {
                let cloneDescendant = false;
                if (cloneParams.myDescendantsToInclude.length > 0) {
                    cloneDescendant = cloneParams.myDescendantsToInclude.find(descendantToInclude => ObjectUtils.equals(descendantToInclude, child)) != null;
                } else {
                    cloneDescendant = cloneParams.myDescendantsToIgnore.find(descendantToInclude => ObjectUtils.equals(descendantToInclude, child)) == null;
                }

                if (cloneDescendant && cloneParams.myIgnoreDescendantCallback != null) {
                    cloneDescendant = !cloneParams.myIgnoreDescendantCallback(child);
                }

                if (cloneDescendant) {
                    objectsToClone.push(child);
                }
            }
        }
    }

    return cloneable;
}

// To String

export function toString(object: Object3D) {
    return ObjectUtils.toStringCompact(object);
}

export let toStringExtended = function () {
    let tab = "    ";
    let newLine = "\n";
    let startObject = "{";
    let endObject = "}";
    let nameLabel = "name: ";
    let idLabel = "id: ";
    let componentsLabel = "components: ";
    let typeLabel = "type: ";
    let childrenLabel = "children: ";
    let startComponents = "[";
    let endComponents = "]";
    let startChildren = startComponents;
    let endChildren = endComponents;
    let separator = ",";
    let newLineTab = newLine.concat(tab, tab);
    return function toStringExtended(object: Object3D) {
        let objectString = "";
        objectString = objectString.concat(startObject, newLine);

        let components = ObjectUtils.getComponentsSelf(object);
        let children = ObjectUtils.getChildren(object);
        let name = ObjectUtils.getName(object);

        if (components.length > 0 || children.length > 0 || name.length > 0) {
            objectString = objectString.concat(tab, idLabel, ObjectUtils.getID(object), separator, newLine);
        } else {
            objectString = objectString.concat(tab, idLabel, ObjectUtils.getID(object), newLine);
        }

        if (name.length > 0) {
            if (components.length > 0 || children.length > 0) {
                objectString = objectString.concat(tab, nameLabel, ObjectUtils.getName(object), separator, newLine);
            } else {
                objectString = objectString.concat(tab, nameLabel, ObjectUtils.getName(object), newLine);
            }
        }

        if (components.length > 0) {
            objectString = objectString.concat(tab, componentsLabel, newLine, tab, startComponents, newLine);
            for (let i = 0; i < components.length; i++) {
                let component = components[i];

                objectString = objectString.concat(tab, tab, startObject, newLine);
                objectString = objectString.concat(tab, tab, tab, typeLabel, component.type, separator, newLine);
                objectString = objectString.concat(tab, tab, tab, idLabel, component._id, separator, newLine);
                objectString = objectString.concat(tab, tab, endObject);

                if (i != components.length - 1) {
                    objectString = objectString.concat(separator, newLine);
                } else {
                    objectString = objectString.concat(newLine);
                }
            }

            if (children.length > 0) {
                objectString = objectString.concat(tab, endComponents, separator, newLine);
            } else {
                objectString = objectString.concat(tab, endComponents, newLine);
            }
        }

        if (children.length > 0) {
            objectString = objectString.concat(tab, childrenLabel, newLine, tab, startChildren, newLine);
            for (let i = 0; i < children.length; i++) {
                let child = children[i];

                let childString = ObjectUtils.toStringExtended(child);
                childString = childString.replaceAll(newLine, newLineTab);
                childString = tab.concat(tab, childString);
                objectString = objectString.concat(childString);

                if (i != children.length - 1) {
                    objectString = objectString.concat(separator, newLine);
                } else {
                    objectString = objectString.concat(newLine);
                }
            }
            objectString = objectString.concat(tab, endChildren, newLine);
        }

        objectString = objectString.concat(endObject);

        return objectString;
    };
}();

export let toStringCompact = function () {
    let tab = "    ";
    let newLine = "\n";
    let emptyName = "<none>";
    let nameLabel = "name: ";
    let componentsLabel = "components: ";
    let separator = ", ";
    let newLineTab = newLine.concat(tab);
    return function toStringCompact(object: Object3D) {
        let objectString = "";

        let name = ObjectUtils.getName(object);
        if (name.length > 0) {
            objectString = objectString.concat(nameLabel, name);
        } else {
            objectString = objectString.concat(nameLabel, emptyName);
        }

        let components = ObjectUtils.getComponentsSelf(object);
        if (components.length > 0) {
            objectString = objectString.concat(separator, componentsLabel);
            for (let i = 0; i < components.length; i++) {
                let component = components[i];

                objectString = objectString.concat(component.type);

                if (i != components.length - 1) {
                    objectString = objectString.concat(separator);
                }
            }
        }

        let children = ObjectUtils.getChildren(object);
        if (children.length > 0) {
            objectString = objectString.concat(newLine);
            for (let i = 0; i < children.length; i++) {
                let child = children[i];

                let childString = ObjectUtils.toStringCompact(child);
                childString = childString.replaceAll(newLine, newLineTab);
                childString = tab.concat(childString);
                objectString = objectString.concat(childString);

                if (i != children.length - 1) {
                    objectString = objectString.concat(newLine);
                }
            }
        }

        return objectString;
    };
}();

// Get Object By Name

export function getObjectByName(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    return ObjectUtils.getObjectByNameHierarchy(object, name, isRegex, index);
}

export function getObjectByNameHierarchy(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    return ObjectUtils.getObjectByNameHierarchyBreadth(object, name, isRegex, index);
}

export function getObjectByNameHierarchyBreadth(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    let objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameHierarchyDepth(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    let objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameDescendants(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    return ObjectUtils.getObjectByNameDescendantsBreadth(object, name, isRegex, index);
}

export function getObjectByNameDescendantsBreadth(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    let objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameDescendantsDepth(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    let objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectByNameChildren(object: Object3D, name: string, isRegex: boolean = false, index: number = 0) {
    let objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getObjectByNameObjects(objects, name, isRegex, index);
}

export function getObjectsByName(object: Object3D, name: string, isRegex: boolean = false) {
    return ObjectUtils.getObjectsByNameHierarchy(object, name, isRegex);
}

export function getObjectsByNameHierarchy(object: Object3D, name: string, isRegex: boolean = false) {
    return ObjectUtils.getObjectsByNameHierarchyBreadth(object, name, isRegex);
}

export function getObjectsByNameHierarchyBreadth(object: Object3D, name: string, isRegex: boolean = false) {
    let objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameHierarchyDepth(object: Object3D, name: string, isRegex: boolean = false) {
    let objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameDescendants(object: Object3D, name: string, isRegex: boolean = false) {
    return ObjectUtils.getObjectsByNameDescendantsBreadth(object, name, isRegex);
}

export function getObjectsByNameDescendantsBreadth(object: Object3D, name: string, isRegex: boolean = false) {
    let objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameDescendantsDepth(object: Object3D, name: string, isRegex: boolean = false) {
    let objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

export function getObjectsByNameChildren(object: Object3D, name: string, isRegex: boolean = false) {
    let objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getObjectsByNameObjects(objects, name, isRegex);
}

// Get Object By ID

export function getObjectByID(object: Object3D, id: number) {
    return ObjectUtils.getObjectByIDHierarchy(object, id);
}

export function getObjectByIDHierarchy(object: Object3D, id: number) {
    return ObjectUtils.getObjectByIDHierarchyBreadth(object, id);
}

export function getObjectByIDHierarchyBreadth(object: Object3D, id: number) {
    let objects = ObjectUtils.getHierarchyBreadth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDHierarchyDepth(object: Object3D, id: number) {
    let objects = ObjectUtils.getHierarchyDepth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDDescendants(object: Object3D, id: number) {
    return ObjectUtils.getObjectByIDDescendantsBreadth(object, id);
}

export function getObjectByIDDescendantsBreadth(object: Object3D, id: number) {
    let objects = ObjectUtils.getDescendantsBreadth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDDescendantsDepth(object: Object3D, id: number) {
    let objects = ObjectUtils.getDescendantsDepth(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

export function getObjectByIDChildren(object: Object3D, id: number) {
    let objects = ObjectUtils.getChildren(object);
    return ObjectUtils.getObjectByIDObjects(objects, id);
}

// Get Hierarchy

export function getHierarchy(object: Object3D) {
    return ObjectUtils.getHierarchyBreadth(object);
}

export function getHierarchyBreadth(object: Object3D) {
    let hierarchy = ObjectUtils.getDescendantsBreadth(object);

    hierarchy.unshift(object);

    return hierarchy;
}

export function getHierarchyDepth(object: Object3D) {
    let hierarchy = ObjectUtils.getDescendantsDepth(object);

    hierarchy.unshift(object);

    return hierarchy;
}

export function getDescendants(object: Object3D) {
    return ObjectUtils.getDescendantsBreadth(object);
}

export function getDescendantsBreadth(object: Object3D) {
    let descendants = [];

    let descendantsQueue = ObjectUtils.getChildren(object);

    while (descendantsQueue.length > 0) {
        let descendant = descendantsQueue.shift();
        descendants.push(descendant);
        for (let child of ObjectUtils.getChildren(descendant)) {
            descendantsQueue.push(child);
        }
    }

    return descendants;
}

export function getDescendantsDepth(object: Object3D) {
    let descendants = [];

    let children = ObjectUtils.getChildren(object);

    for (let child of children) {
        descendants.push(child);

        let childDescendants = ObjectUtils.getDescendantsDepth(child);
        for (let i = 0; i < childDescendants.length; i++) {
            descendants.push(childDescendants[i]);
        }
    }

    return descendants;
}

export function getChildren(object: Object3D) {
    return object.children;
}

export function getSelf(object: Object3D) {
    return object;
}

// Cauldron

export function addObject(object: Object3D) {
    return Globals.getScene(ObjectUtils.getEngine(object)).addObject(object);
}

export function getName(object: Object3D) {
    return object.name;
}

export function setName(object: Object3D, name: string) {
    object.name = name;
}

export function getEngine(object: Object3D) {
    return object.engine;
}

export function getID(object: Object3D) {
    return object.objectId;
}

export function markDirty(object: Object3D) {
    return object.setDirty();
}

export function isTransformChanged(object: Object3D) {
    return object.changed;
}

export function equals(first: Object3D, second: Object3D) {
    return first.equals(second);
}

export function destroy(object: Object3D) {
    let destroyReturnValue = undefined;

    try {
        destroyReturnValue = object.destroy();
    } catch (error) {
        // Do nothing
    }

    return destroyReturnValue;
}

export function reserveObjects(object: Object3D, count: number) {
    ObjectUtils.reserveObjectsHierarchy(object, count);
}

export function reserveObjectsSelf(object: Object3D, count: number) {
    let componentsAmountMap = ObjectUtils.getComponentsAmountMapSelf(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));
}

export function reserveObjectsHierarchy(object: Object3D, count: number) {
    let componentsAmountMap = ObjectUtils.getComponentsAmountMapHierarchy(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));
}

export function reserveObjectsDescendants(object: Object3D, count: number) {
    let componentsAmountMap = ObjectUtils.getComponentsAmountMapDescendants(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));
}

export function reserveObjectsChildren(object: Object3D, count: number) {
    let componentsAmountMap = ObjectUtils.getComponentsAmountMapChildren(object);
    _reserveObjects(count, componentsAmountMap, Globals.getScene(ObjectUtils.getEngine(object)));
}

export function getComponentsAmountMap(object: Object3D, amountMap = new Map()) {
    return ObjectUtils.getComponentsAmountMapHierarchy(object, amountMap);
}

export function getComponentsAmountMapSelf(object: Object3D, amountMap = new Map()) {
    let objectsAmount = amountMap.get("object");
    if (objectsAmount == null) {
        objectsAmount = 0;
    }
    objectsAmount += 1;
    amountMap.set("object", objectsAmount);

    let components = ObjectUtils.getComponentsSelf(object);
    for (let component of components) {
        let type = component.type;
        let typeAmount = amountMap.get(type);
        if (typeAmount == null) {
            typeAmount = 0;
        }
        typeAmount += 1;
        amountMap.set(type, typeAmount);
    }

    return amountMap;
}

export function getComponentsAmountMapHierarchy(object: Object3D, amountMap = new Map()) {
    let hierarchy = ObjectUtils.getHierarchy(object);

    for (let hierarchyObject of hierarchy) {
        ObjectUtils.getComponentsAmountMapSelf(hierarchyObject, amountMap);
    }

    return amountMap;
}

export function getComponentsAmountMapDescendants(object: Object3D, amountMap = new Map()) {
    let descendants = ObjectUtils.getDescendants(object);

    for (let descendant of descendants) {
        ObjectUtils.getComponentsAmountMapSelf(descendant, amountMap);
    }

    return amountMap;
}

export function getComponentsAmountMapChildren(object: Object3D, amountMap = new Map()) {
    let children = ObjectUtils.getChildren(object);

    for (let child of children) {
        ObjectUtils.getComponentsAmountMapSelf(child, amountMap);
    }

    return amountMap;
}

// GLOBALS

export function getComponentObjects<T extends Component>(objects: Object3D[], typeOrClass: string | ComponentConstructor<T>, index: number = 0): T | null {
    let component = null;

    for (let object of objects) {
        component = object.getComponent(typeOrClass, index);
        if (component != null) {
            break;
        }
    }

    return component;
}

export function getComponentsObjects<T extends Component>(objects: Object3D[], typeOrClass: string | ComponentConstructor<T>): T[] {
    let components = [];

    for (let currentObject of objects) {
        let currentObjectComponents = currentObject.getComponents(typeOrClass);
        for (let i = 0; i < currentObjectComponents.length; i++) {
            components.push(currentObjectComponents[i]);
        }
    }

    return components;
}

export function setActiveObjects(objects: Object3D[], active: boolean) {
    for (let currentObject of objects) {
        currentObject.active = active;
    }
}

export function getObjectByNameObjects(objects: Object3D[], name: string, isRegex: boolean = false, index: number = 0) {
    let objectFound = null;

    let currentIndex = index;
    for (let currentObject of objects) {
        let objectName = ObjectUtils.getName(currentObject);
        if ((!isRegex && objectName == name) || (isRegex && objectName.match(name) != null)) {
            if (currentIndex == 0) {
                objectFound = currentObject;
                break;
            }

            currentIndex--;
        }
    }

    return objectFound;
}

export function getObjectsByNameObjects(objects: Object3D[], name: string, isRegex: boolean = false) {
    let objectsFound = [];

    for (let currentObject of objects) {
        let objectName = ObjectUtils.getName(currentObject);
        if ((!isRegex && objectName == name) || (isRegex && objectName.match(name) != null)) {
            objectsFound.push(currentObject);
        }
    }

    return objectsFound;
}

export function getObjectByIDObjects(objects: Object3D[], id: number, index: number = 0) {
    let objectFound = null;

    let currentIndex = index;
    for (let currentObject of objects) {
        if (ObjectUtils.getID(currentObject) == id) {
            if (currentIndex == 0) {
                objectFound = currentObject;
                break;
            }

            currentIndex--;
        }
    }

    return objectFound;
}

export function getObjectsByIDObjects(objects: Object3D[], id: number) {
    let objectsFound = [];

    for (let currentObject of objects) {
        if (ObjectUtils.getID(currentObject) == id) {
            objectsFound.push(currentObject);
        }
    }

    return objectsFound;
}

export function wrapObject(id: number, engine = Globals.getMainEngine()) {
    return engine.wrapObject(id);
}

export const ObjectUtils = {
    getPosition,
    getPositionWorld,
    getPositionLocal,
    getRotation,
    getRotationDegrees,
    getRotationRadians,
    getRotationMatrix,
    getRotationQuat,
    getRotationWorld,
    getRotationWorldDegrees,
    getRotationWorldRadians,
    getRotationWorldMatrix,
    getRotationWorldQuat,
    getRotationLocal,
    getRotationLocalDegrees,
    getRotationLocalRadians,
    getRotationLocalMatrix,
    getRotationLocalQuat,
    getScale,
    getScaleWorld,
    getScaleLocal,
    getTransform,
    getTransformMatrix,
    getTransformQuat,
    getTransformWorld,
    getTransformWorldMatrix,
    getTransformWorldQuat,
    getTransformLocal,
    getTransformLocalMatrix,
    getTransformLocalQuat,
    getAxes,
    getAxesWorld,
    getAxesLocal,
    getForward,
    getForwardWorld,
    getForwardLocal,
    getBackward,
    getBackwardWorld,
    getBackwardLocal,
    getUp,
    getUpWorld,
    getUpLocal,
    getDown,
    getDownWorld,
    getDownLocal,
    getLeft,
    getLeftWorld,
    getLeftLocal,
    getRight,
    getRightWorld,
    getRightLocal,
    setPosition,
    setPositionWorld,
    setPositionLocal,
    setRotation,
    setRotationDegrees,
    setRotationRadians,
    setRotationMatrix,
    setRotationQuat,
    setRotationWorld,
    setRotationWorldDegrees,
    setRotationWorldRadians,
    setRotationWorldMatrix,
    setRotationWorldQuat,
    setRotationLocal,
    setRotationLocalDegrees,
    setRotationLocalRadians,
    setRotationLocalMatrix,
    setRotationLocalQuat,
    setScale,
    setScaleWorld,
    setScaleLocal,
    setAxes,
    setAxesWorld,
    setAxesLocal,
    setForward,
    setForwardWorld,
    setForwardLocal,
    setBackward,
    setBackwardWorld,
    setBackwardLocal,
    setUp,
    setUpWorld,
    setUpLocal,
    setDown,
    setDownWorld,
    setDownLocal,
    setLeft,
    setLeftWorld,
    setLeftLocal,
    setRight,
    setRightWorld,
    setRightLocal,
    setTransform,
    setTransformMatrix,
    setTransformQuat,
    setTransformWorld,
    setTransformWorldMatrix,
    setTransformWorldQuat,
    setTransformLocal,
    setTransformLocalMatrix,
    setTransformLocalQuat,
    resetPosition,
    resetPositionWorld,
    resetPositionLocal,
    resetRotation,
    resetRotationWorld,
    resetRotationLocal,
    resetScale,
    resetScaleWorld,
    resetScaleLocal,
    resetTransform,
    resetTransformWorld,
    resetTransformLocal,
    translate,
    translateWorld,
    translateLocal,
    translateObject,
    translateAxis,
    translateAxisWorld,
    translateAxisLocal,
    translateAxisObject,
    rotate,
    rotateDegrees,
    rotateRadians,
    rotateMatrix,
    rotateQuat,
    rotateWorld,
    rotateWorldDegrees,
    rotateWorldRadians,
    rotateWorldMatrix,
    rotateWorldQuat,
    rotateLocal,
    rotateLocalDegrees,
    rotateLocalRadians,
    rotateLocalMatrix,
    rotateLocalQuat,
    rotateObject,
    rotateObjectDegrees,
    rotateObjectRadians,
    rotateObjectMatrix,
    rotateObjectQuat,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    rotateAxisWorld,
    rotateAxisWorldDegrees,
    rotateAxisWorldRadians,
    rotateAxisLocal,
    rotateAxisLocalDegrees,
    rotateAxisLocalRadians,
    rotateAxisObject,
    rotateAxisObjectDegrees,
    rotateAxisObjectRadians,
    rotateAround,
    rotateAroundDegrees,
    rotateAroundRadians,
    rotateAroundMatrix,
    rotateAroundQuat,
    rotateAroundWorld,
    rotateAroundWorldDegrees,
    rotateAroundWorldRadians,
    rotateAroundWorldMatrix,
    rotateAroundWorldQuat,
    rotateAroundLocal,
    rotateAroundLocalDegrees,
    rotateAroundLocalRadians,
    rotateAroundLocalMatrix,
    rotateAroundLocalQuat,
    rotateAroundObject,
    rotateAroundObjectDegrees,
    rotateAroundObjectRadians,
    rotateAroundObjectMatrix,
    rotateAroundObjectQuat,
    rotateAroundAxis,
    rotateAroundAxisDegrees,
    rotateAroundAxisRadians,
    rotateAroundAxisWorld,
    rotateAroundAxisWorldDegrees,
    rotateAroundAxisWorldRadians,
    rotateAroundAxisLocal,
    rotateAroundAxisLocalDegrees,
    rotateAroundAxisLocalRadians,
    rotateAroundAxisObject,
    rotateAroundAxisObjectDegrees,
    rotateAroundAxisObjectRadians,
    scaleObject,
    lookAt,
    lookAtWorld,
    lookAtLocal,
    lookTo,
    lookToWorld,
    lookToLocal,
    setParent,
    getParent,
    convertPositionObjectToWorld,
    convertDirectionObjectToWorld,
    convertPositionWorldToObject,
    convertDirectionWorldToObject,
    convertPositionLocalToWorld,
    convertDirectionLocalToWorld,
    convertPositionWorldToLocal,
    convertDirectionWorldToLocal,
    convertPositionObjectToLocal,
    convertDirectionObjectToLocal,
    convertPositionLocalToObject,
    convertDirectionLocalToObject,
    convertTransformObjectToWorld,
    convertTransformObjectToWorldMatrix,
    convertTransformObjectToWorldQuat,
    convertTransformWorldToObject,
    convertTransformWorldToObjectMatrix,
    convertTransformWorldToObjectQuat,
    convertTransformLocalToWorld,
    convertTransformLocalToWorldMatrix,
    convertTransformLocalToWorldQuat,
    convertTransformWorldToLocal,
    convertTransformWorldToLocalMatrix,
    convertTransformWorldToLocalQuat,
    convertTransformObjectToLocal,
    convertTransformObjectToLocalMatrix,
    convertTransformObjectToLocalQuat,
    convertTransformLocalToObject,
    convertTransformLocalToObjectMatrix,
    convertTransformLocalToObjectQuat,
    addComponent,
    getComponent,
    getComponentSelf,
    getComponentHierarchy,
    getComponentHierarchyBreadth,
    getComponentHierarchyDepth,
    getComponentDescendants,
    getComponentDescendantsBreadth,
    getComponentDescendantsDepth,
    getComponentChildren,
    getComponents,
    getComponentsSelf,
    getComponentsHierarchy,
    getComponentsHierarchyBreadth,
    getComponentsHierarchyDepth,
    getComponentsDescendants,
    getComponentsDescendantsBreadth,
    getComponentsDescendantsDepth,
    getComponentsChildren,
    setActive,
    setActiveSelf,
    setActiveHierarchy,
    setActiveHierarchyBreadth,
    setActiveHierarchyDepth,
    setActiveDescendants,
    setActiveDescendantsBreadth,
    setActiveDescendantsDepth,
    setActiveChildren,
    hasUniformScale,
    hasUniformScaleWorld,
    hasUniformScaleLocal,
    clone,
    isCloneable,
    toString,
    toStringExtended,
    toStringCompact,
    getObjectByName,
    getObjectByNameHierarchy,
    getObjectByNameHierarchyBreadth,
    getObjectByNameHierarchyDepth,
    getObjectByNameDescendants,
    getObjectByNameDescendantsBreadth,
    getObjectByNameDescendantsDepth,
    getObjectByNameChildren,
    getObjectsByName,
    getObjectsByNameHierarchy,
    getObjectsByNameHierarchyBreadth,
    getObjectsByNameHierarchyDepth,
    getObjectsByNameDescendants,
    getObjectsByNameDescendantsBreadth,
    getObjectsByNameDescendantsDepth,
    getObjectsByNameChildren,
    getObjectByID,
    getObjectByIDHierarchy,
    getObjectByIDHierarchyBreadth,
    getObjectByIDHierarchyDepth,
    getObjectByIDDescendants,
    getObjectByIDDescendantsBreadth,
    getObjectByIDDescendantsDepth,
    getObjectByIDChildren,
    getHierarchy,
    getHierarchyBreadth,
    getHierarchyDepth,
    getDescendants,
    getDescendantsBreadth,
    getDescendantsDepth,
    getChildren,
    getSelf,
    addObject,
    getName,
    setName,
    getEngine,
    getID,
    markDirty,
    isTransformChanged,
    equals,
    destroy,
    reserveObjects,
    reserveObjectsSelf,
    reserveObjectsHierarchy,
    reserveObjectsDescendants,
    reserveObjectsChildren,
    getComponentsAmountMap,
    getComponentsAmountMapSelf,
    getComponentsAmountMapHierarchy,
    getComponentsAmountMapDescendants,
    getComponentsAmountMapChildren,
    getComponentObjects,
    getComponentsObjects,
    setActiveObjects,
    getObjectByNameObjects,
    getObjectsByNameObjects,
    getObjectByIDObjects,
    getObjectsByIDObjects,
    wrapObject
} as const;



function _reserveObjects(count: number, componentsAmountMap: Readonly<Map<string, number>>, scene: Scene): void {
    if (componentsAmountMap.has("object")) {
        const objectsToReserve = componentsAmountMap.get("object")! * count;

        const componentsToReserve: Record<string, number> = {};
        for (const [componentName, componentCount] of componentsAmountMap.entries()) {
            if (componentName != "object") {
                componentsToReserve[componentName] = componentCount * count;
            }
        }

        scene.reserveObjects(objectsToReserve, componentsToReserve);
    }
}