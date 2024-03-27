export interface ArrayLikeExtension<ArrayType, ArrayElementType> {
export interface ArrayLikeExtension<ArrayType extends ArrayLike<ArrayElementType>, ArrayElementType> {
    pp_first<T extends ArrayType>(this: Readonly<T>): ArrayElementType | undefined;
    pp_last<T extends ArrayType>(this: Readonly<T>): ArrayElementType | undefined;

    pp_has<T extends ArrayType>(this: Readonly<T>, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): boolean;
    pp_hasEqual<T extends ArrayType>(this: Readonly<T>, elementToFind: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToFind: ArrayElementType) => boolean): boolean;

    pp_find<T extends ArrayType>(this: Readonly<T>, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): ArrayElementType | undefined;
    pp_findIndex<T extends ArrayType>(this: Readonly<T>, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): number;
    pp_findAll<T extends ArrayType>(this: Readonly<T>, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): ArrayElementType[];
    pp_findAllIndexes<T extends ArrayType>(this: Readonly<T>, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): number[];

    pp_findEqual<T extends ArrayType>(this: Readonly<T>, elementToFind: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToFind: ArrayElementType) => boolean): ArrayElementType | undefined;
    pp_findAllEqual<T extends ArrayType>(this: Readonly<T>, elementToFind: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToFind: ArrayElementType) => boolean): ArrayElementType[];
    pp_findIndexEqual<T extends ArrayType>(this: Readonly<T>, elementToFind: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToFind: ArrayElementType) => boolean): number;
    pp_findAllIndexesEqual<T extends ArrayType>(this: Readonly<T>, elementToFind: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToFind: ArrayElementType) => boolean): number[];

    pp_copy<T extends ArrayType>(this: T, array: Readonly<ArrayLike<ArrayElementType>>, copyCallback?: (arrayElement: ArrayElementType, thisElement: ArrayElementType) => ArrayElementType): this;

    pp_clone<T extends ArrayType>(this: Readonly<T>, cloneCallback?: (elementToClone: ArrayElementType) => ArrayElementType): T;

    pp_equals<T extends ArrayType>(this: Readonly<T>, array: Readonly<ArrayLike<ArrayElementType>>, elementsEqualCallback?: (thisElement: ArrayElementType, arrayElement: ArrayElementType) => boolean): boolean;
}

export interface ArrayExtension<ArrayType extends ArrayLike<ArrayElementType>, ArrayElementType> extends ArrayLikeExtension<ArrayType, ArrayElementType> {
    pp_remove<T extends ArrayType>(this: T, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): ArrayElementType | undefined;
    pp_removeIndex<T extends ArrayType>(this: T, index: number): ArrayElementType | undefined;
    pp_removeAll<T extends ArrayType>(this: T, callback: (elementToCheck: ArrayElementType, elementIndex: number) => boolean): ArrayElementType[];
    pp_removeAllIndexes<T extends ArrayType>(this: T, indexes: number[]): ArrayElementType[];

    pp_removeEqual<T extends ArrayType>(this: T, elementToRemove: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToRemove: ArrayElementType) => boolean): ArrayElementType | undefined;
    pp_removeAllEqual<T extends ArrayType>(this: T, elementToRemove: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToRemove: ArrayElementType) => boolean): ArrayElementType[];

    pp_clear<T extends ArrayType>(this: T): this;

    pp_pushUnique<T extends ArrayType>(this: T, elementToAdd: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToAdd: ArrayElementType) => boolean): number;
    pp_unshiftUnique<T extends ArrayType>(this: T, elementToAdd: ArrayElementType, elementsEqualCallback?: (elementToCheck: ArrayElementType, elementToAdd: ArrayElementType) => boolean): number;
}

declare global {
    export interface Array<T> extends ArrayExtension<Array<T>, T> { }
}

declare global {
    export interface Uint8ClampedArray extends ArrayLikeExtension<Uint8ClampedArray, number> { }
}

declare global {
    export interface Uint8Array extends ArrayLikeExtension<Uint8Array, number> { }
}

declare global {
    export interface Uint16Array extends ArrayLikeExtension<Uint16Array, number> { }
}

declare global {
    export interface Uint32Array extends ArrayLikeExtension<Uint32Array, number> { }
}

declare global {
    export interface Int8Array extends ArrayLikeExtension<Int8Array, number> { }
}

declare global {
    export interface Int16Array extends ArrayLikeExtension<Int16Array, number> { }
}

declare global {
    export interface Int32Array extends ArrayLikeExtension<Int32Array, number> { }
}

declare global {
    export interface Float32Array extends ArrayLikeExtension<Float32Array, number> { }
}

declare global {
    export interface Float64Array extends ArrayLikeExtension<Float64Array, number> { }
}

declare module "../../../../cauldron/type_definitions/array_type_definitions.js" {
    export interface ArrayLike<T> extends ArrayLikeExtension<ArrayLike<T>, T> { }

    export interface Vector extends ArrayLikeExtension<Vector, number> { }

    export interface Vector2 extends ArrayLikeExtension<Vector2, number> { }

    export interface Vector3 extends ArrayLikeExtension<Vector3, number> { }

    export interface Vector4 extends ArrayLikeExtension<Vector4, number> { }

    export interface Quaternion extends ArrayLikeExtension<Quaternion, number> { }

    export interface Quaternion2 extends ArrayLikeExtension<Quaternion2, number> { }

    export interface Matrix2 extends ArrayLikeExtension<Matrix2, number> { }

    export interface Matrix3 extends ArrayLikeExtension<Matrix3, number> { }

    export interface Matrix4 extends ArrayLikeExtension<Matrix4, number> { }
}