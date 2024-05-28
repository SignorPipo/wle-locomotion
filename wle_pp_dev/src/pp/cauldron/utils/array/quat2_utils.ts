import { mat4 as gl_mat4, quat2 as gl_quat2, type mat4 as gl_mat4_type, type quat2 as gl_quat2_type, type quat as gl_quat_type, type vec3 as gl_vec3_type, type vec4 as gl_vec4_type } from "gl-matrix";
import { Matrix4, Quaternion, Quaternion2, Vector3 } from "wle-pp/cauldron/type_definitions/array_type_definitions.js";
import { EasingFunction, MathUtils } from "../math_utils.js";
import { create as mat3_utils_create } from "./mat3_utils.js";
import { Mat4Utils } from "./mat4_utils.js";
import { QuatUtils, create as quat_utils_create } from "./quat_utils.js";
import { Vec3Utils, create as vec3_utils_create } from "./vec3_utils.js";

export function create(): Quaternion2;
export function create(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quaternion2;
export function create(x1?: number, y1?: number, z1?: number, w1?: number, x2?: number, y2?: number, z2?: number, w2?: number): Quaternion2 {
    const out = gl_quat2.create() as unknown as Quaternion2;

    if (x1 != null) {
        Quat2Utils.set(out, x1, y1!, z1!, w1!, x2!, y2!, z2!, w2!);
    }

    return out;
}

export function set<T extends Quaternion2>(quat: T, x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): T;
export function set<T extends Quaternion2>(quat: T, uniformValue: number): T;
export function set<T extends Quaternion2>(quat: T, x1: number, y1?: number, z1?: number, w1?: number, x2?: number, y2?: number, z2?: number, w2?: number): T {
    if (y1 == null) {
        gl_quat2.set(quat as unknown as gl_quat2_type, x1, x1, x1, x1, x1, x1, x1, x1);
    } else {
        gl_quat2.set(quat as unknown as gl_quat2_type, x1, y1, z1!, w1!, x2!, y2!, z2!, w2!);
    }

    return quat;
}

export function copy<T extends Quaternion2>(from: Readonly<Quaternion2>, to: T): T {
    gl_quat2.copy(to as unknown as gl_quat2_type, from as unknown as gl_quat2_type);
    return to;
}

/** The overload where `T extends Quaternion2` does also get `array` as `Readonly<T>`, but is not marked as such due to 
    Typescript having issues with inferring the proper type of `T` when `Readonly` is used */
export function clone<T extends Quaternion2>(quat: Readonly<T>): T;
export function clone(quat: Readonly<number[]>): number[];
export function clone<T extends Quaternion2>(quat: T): T;
export function clone<T extends Quaternion2>(quat: Readonly<T>): T {
    return quat.slice(0) as T;
}

export function identity<T extends Quaternion2>(quat: T): T {
    gl_quat2.identity(quat as unknown as gl_quat2_type);
    return quat;
}

export function normalize<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, out: T | U = Quat2Utils.clone(quat)): T | U {
    gl_quat2.normalize(out as unknown as gl_quat2_type, quat as unknown as gl_quat2_type);
    return out;
}

export function invert<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, out: T | U = Quat2Utils.clone(quat)): T | U {
    gl_quat2.invert(out as unknown as gl_quat2_type, quat as unknown as gl_quat2_type);
    return out;
}

export function conjugate<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, out: T | U = Quat2Utils.clone(quat)): T | U {
    gl_quat2.conjugate(out as unknown as gl_quat2_type, quat as unknown as gl_quat2_type);
    return out;
}

export function getPosition<T extends Vector3>(quat: Readonly<Quaternion2>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
    gl_quat2.getTranslation(out as unknown as gl_vec3_type, quat as unknown as gl_quat2_type);
    return out;
}

export function getRotation<T extends Vector3>(quat: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
    return Quat2Utils.getRotationDegrees(quat, out);
}

export const getRotationDegrees = function () {
    const rotationQuat = quat_utils_create();
    return function getRotationDegrees<T extends Vector3>(quat: Readonly<Quaternion2>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toDegrees(Quat2Utils.getRotationQuat(quat, rotationQuat), out);
        return out;
    };
}();

export const getRotationRadians = function () {
    const rotationQuat = quat_utils_create();
    return function getRotationRadians<T extends Vector3>(quat: Readonly<Quaternion2>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toRadians(Quat2Utils.getRotationQuat(quat, rotationQuat), out);
        return out;
    };
}();

export function getRotationQuat<T extends Quaternion>(quat: Readonly<Quaternion2>, out: Quaternion | T = QuatUtils.create()): Quaternion | T {
    QuatUtils.copy(quat, out);
    return out;
}

export const setPosition = function () {
    const rotationQuat = quat_utils_create();
    return function setPosition<T extends Quaternion2>(quat: T, position: Readonly<Vector3>): T {
        Quat2Utils.getRotationQuat(quat, rotationQuat);
        Quat2Utils.setPositionRotationQuat(quat, position, rotationQuat);
        return quat;
    };
}();

export function setRotation<T extends Quaternion2>(quat: T, rotation: Readonly<Vector3>): T {
    return Quat2Utils.setRotationDegrees(quat, rotation);
}

export const setRotationDegrees = function () {
    const position = vec3_utils_create();
    return function setRotationDegrees<T extends Quaternion2>(quat: T, rotation: Readonly<Vector3>): T {
        Quat2Utils.getPosition(quat, position);
        Quat2Utils.setPositionRotationDegrees(quat, position, rotation);
        return quat;
    };
}();

export const setRotationRadians = function () {
    const position = vec3_utils_create();
    return function setRotationRadians<T extends Quaternion2>(quat: T, rotation: Readonly<Vector3>): T {
        Quat2Utils.getPosition(quat, position);
        Quat2Utils.setPositionRotationRadians(quat, position, rotation);
        return quat;
    };
}();

export const setRotationQuat = function () {
    const position = vec3_utils_create();
    return function setRotationQuat<T extends Quaternion2>(quat: T, rotation: Readonly<Quaternion>): T {
        Quat2Utils.getPosition(quat, position);
        Quat2Utils.setPositionRotationQuat(quat, position, rotation);
        return quat;
    };
}();


export function setPositionRotation<T extends Quaternion2>(quat: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
    return Quat2Utils.setPositionRotationDegrees(quat, position, rotation);
}

export const setPositionRotationDegrees = function () {
    const rotationQuat = quat_utils_create();
    return function setPositionRotationDegrees<T extends Quaternion2>(quat: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
        Vec3Utils.degreesToQuat(rotation, rotationQuat);
        Quat2Utils.setPositionRotationQuat(quat, position, rotationQuat);

        return quat;
    };
}();

export const setPositionRotationRadians = function () {
    const rotationQuat = quat_utils_create();
    return function setPositionRotationRadians<T extends Quaternion2>(quat: T, position: Readonly<Vector3>, rotation: Readonly<Vector3>): T {
        Vec3Utils.radiansToQuat(rotation, rotationQuat);
        Quat2Utils.setPositionRotationQuat(quat, position, rotationQuat);
        return quat;
    };
}();

export function setPositionRotationQuat<T extends Quaternion2>(quat: T, position: Readonly<Vector3>, rotation: Readonly<Quaternion>): T {
    gl_quat2.fromRotationTranslation(quat, rotation as unknown as gl_quat_type, position as unknown as gl_vec3_type);
    return quat;
}

export function isNormalized(quat: Readonly<Quaternion2>, epsilon: number = MathUtils.EPSILON): boolean {
    return Math.abs(Quat2Utils.lengthSquared(quat) - 1) < epsilon;
}

export function length(quat: Readonly<Quaternion2>): number {
    return gl_quat2.length(quat as unknown as gl_vec4_type);
}

export function lengthSquared(quat: Readonly<Quaternion2>): number {
    return gl_quat2.squaredLength(quat as unknown as gl_vec4_type);
}

export function mul<T extends Quaternion2>(first: Readonly<T>, second: Readonly<Quaternion2>): T;
export function mul<T extends Quaternion2>(first: Readonly<Quaternion2>, second: Readonly<Quaternion2>, out: T): T;
export function mul<T extends Quaternion2, U extends Quaternion2>(first: Readonly<T>, second: Readonly<Quaternion2>, out: T | U = Quat2Utils.clone(first)): T | U {
    gl_quat2.mul(out as unknown as gl_quat2_type, first as unknown as gl_quat2_type, second as unknown as gl_quat2_type);
    return out;
}

export function getAxes<T extends Vector3, U extends Vector3, V extends Vector3>(quat: Readonly<Quaternion2>, out: [Vector3, Vector3, Vector3] | [T, U, V] = [Vec3Utils.create(), Vec3Utils.create(), Vec3Utils.create()]): [Vector3, Vector3, Vector3] | [T, U, V] {
    Quat2Utils.getLeft(quat, out[0]);
    Quat2Utils.getUp(quat, out[1]);
    Quat2Utils.getForward(quat, out[2]);
    return out;
}

export const getForward = function () {
    const rotationMatrix = mat3_utils_create();
    return function getForward<T extends Vector3>(quat: Readonly<Quaternion2>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);

        return out;
    };
}();

export function getBackward<T extends Vector3>(quat: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
    out = Quat2Utils.getForward(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export const getLeft = function () {
    const rotationMatrix = mat3_utils_create();
    return function getLeft<T extends Vector3>(quat: Readonly<Quaternion2>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);

        return out;
    };
}();

export function getRight<T extends Vector3>(quat: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
    out = Quat2Utils.getLeft(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export const getUp = function () {
    const rotationMatrix = mat3_utils_create();
    return function getUp<T extends Vector3>(quat: Readonly<Quaternion2>, out: Vector3 | T = Vec3Utils.create()): Vector3 | T {
        QuatUtils.toMatrix(quat, rotationMatrix);

        Vec3Utils.set(out, rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);

        return out;
    };
}();

export function getDown<T extends Vector3>(quat: Readonly<Quaternion2>, out?: Vector3 | T): Vector3 | T {
    out = Quat2Utils.getUp(quat, out);
    Vec3Utils.negate(out, out);
    return out;
}

export function toWorld<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out: T | U = Quat2Utils.clone(quat)): T | U {
    Quat2Utils.mul(parentTransformQuat, quat, out);
    return out;
}

export const toLocal: <T extends Quaternion2, U extends Quaternion2 > (quat: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out?: T | U) => T | U = function () {
    const invertQuat = create();
    return function toLocal<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, parentTransformQuat: Readonly<Quaternion2>, out: T | U = Quat2Utils.clone(quat)): T | U {
        Quat2Utils.conjugate(parentTransformQuat, invertQuat);
        Quat2Utils.mul(invertQuat, quat, out);
        return out;
    };
}();

export function rotateAxis<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: T | U = Quat2Utils.clone(quat)): T | U {
    return Quat2Utils.rotateAxisDegrees(quat, angle, axis, out);
}

export function rotateAxisDegrees<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: T | U = Quat2Utils.clone(quat)): T | U {
    return Quat2Utils.rotateAxisRadians(quat, MathUtils.toRadians(angle), axis, out);
}

export const rotateAxisRadians: <T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out?: T | U) => T | U = function () {
    const rotationQuat = quat_utils_create();
    return function rotateAxisRadians<T extends Quaternion2, U extends Quaternion2>(quat: Readonly<T>, angle: number, axis: Readonly<Vector3>, out: T | U = Quat2Utils.clone(quat)): T | U {
        Quat2Utils.getRotationQuat(quat, rotationQuat);
        QuatUtils.rotateAxisRadians(rotationQuat, angle, axis, rotationQuat);
        Quat2Utils.copy(quat, out);
        Quat2Utils.setRotationQuat(out, rotationQuat);
        return out;
    };
}();


export function toMatrix<T extends Matrix4>(quat: Readonly<Quaternion2>, out: Matrix4 | T = Mat4Utils.create()): Matrix4 | T {
    _customGLMatrixFromQuat2(out, quat);
    return out;
}

export function fromMatrix<T extends Quaternion2>(matrix: Readonly<Matrix4>, out: Quaternion2 | T = Quat2Utils.create()): Quaternion2 | T {
    Mat4Utils.toQuat(matrix, out);
    return out;
}

export function lerp<T extends Quaternion2, U extends Quaternion2>(from: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out: T | U = Quat2Utils.clone(from)): T | U {
    if (interpolationFactor <= 0) {
        Quat2Utils.copy(from, out);
        return out;
    } else if (interpolationFactor >= 1) {
        Quat2Utils.copy(to, out);
        return out;
    }

    gl_quat2.lerp(out as unknown as gl_quat2_type, from as unknown as gl_quat2_type, to as unknown as gl_quat2_type, interpolationFactor);
    return out;
}


export function interpolate<T extends Quaternion2, U extends Quaternion2>(from: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = Quat2Utils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return Quat2Utils.lerp(from, to, lerpFactor, out);
}

export const slerp: <T extends Quaternion2, U extends Quaternion2>(from: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out?: T | U) => T | U = function () {
    const fromPosition = vec3_utils_create();
    const toPosition = vec3_utils_create();
    const interpolatedPosition = vec3_utils_create();
    const fromRotationQuat = quat_utils_create();
    const toRotationQuat = quat_utils_create();
    const interpolatedRotationQuat = quat_utils_create();
    return function slerp<T extends Quaternion2, U extends Quaternion2>(from: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, out: T | U = Quat2Utils.clone(from)): T | U {
        if (interpolationFactor <= 0) {
            Quat2Utils.copy(from, out);
            return out;
        } else if (interpolationFactor >= 1) {
            Quat2Utils.copy(to, out);
            return out;
        }

        Quat2Utils.getPosition(from, fromPosition);
        Quat2Utils.getPosition(to, toPosition);

        Quat2Utils.getRotationQuat(from, fromRotationQuat);
        Quat2Utils.getRotationQuat(to, toRotationQuat);

        Vec3Utils.lerp(fromPosition, toPosition, interpolationFactor, interpolatedPosition);
        QuatUtils.slerp(fromRotationQuat, toRotationQuat, interpolationFactor, interpolatedRotationQuat);

        Quat2Utils.setPositionRotationQuat(out, interpolatedPosition, interpolatedRotationQuat);
        return out;
    };
}();

export function sinterpolate<T extends Quaternion2, U extends Quaternion2>(from: Readonly<T>, to: Readonly<Quaternion2>, interpolationFactor: number, easingFunction: EasingFunction = EasingFunction.linear, out: T | U = Quat2Utils.clone(from)): T | U {
    const lerpFactor = easingFunction(interpolationFactor);
    return Quat2Utils.slerp(from, to, lerpFactor, out);
}

export const Quat2Utils = {
    create,
    set,
    copy,
    clone,
    identity,
    normalize,
    invert,
    conjugate,
    getPosition,
    getRotation,
    getRotationDegrees,
    getRotationRadians,
    getRotationQuat,
    setPosition,
    setRotation,
    setRotationDegrees,
    setRotationRadians,
    setRotationQuat,
    setPositionRotation,
    setPositionRotationDegrees,
    setPositionRotationRadians,
    setPositionRotationQuat,
    isNormalized,
    length,
    lengthSquared,
    mul,
    getAxes,
    getForward,
    getBackward,
    getLeft,
    getRight,
    getUp,
    getDown,
    toWorld,
    toLocal,
    rotateAxis,
    rotateAxisDegrees,
    rotateAxisRadians,
    toMatrix,
    fromMatrix,
    lerp,
    interpolate,
    slerp,
    sinterpolate
};



/** This is used in place of the glMatrix one to avoid the array allocation */
const _customGLMatrixFromQuat2 = function () {
    const translation = vec3_utils_create();
    return function _customGLMatrixFromQuat2(out: Matrix4, quat: Readonly<Quaternion2>): Matrix4 {
        const bx = -quat[0],
            by = -quat[1],
            bz = -quat[2],
            bw = quat[3],
            ax = quat[4],
            ay = quat[5],
            az = quat[6],
            aw = quat[7];

        const magnitude = bx * bx + by * by + bz * bz + bw * bw;

        //Only scale if it makes sense
        if (magnitude > 0) {
            translation[0] = ((ax * bw + aw * bx + ay * bz - az * by) * 2) / magnitude;
            translation[1] = ((ay * bw + aw * by + az * bx - ax * bz) * 2) / magnitude;
            translation[2] = ((az * bw + aw * bz + ax * by - ay * bx) * 2) / magnitude;
        } else {
            translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
            translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
            translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        }

        gl_mat4.fromRotationTranslation(out as unknown as gl_mat4_type, quat, translation);

        return out;
    };
}();