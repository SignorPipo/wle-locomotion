CollisionCheck.prototype._verticalCheck = function () {
    let newFeetPosition = PP.vec3_create();
    let additionalFixedMovement = PP.vec3_create();
    let zero = PP.vec3_create();
    zero.vec3_zero();
    return function _verticalCheck(verticalMovement, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        collisionRuntimeParams.myIsCollidingVertically = false;
        collisionRuntimeParams.myVerticalCollisionHit.reset();

        let movementSign = Math.pp_sign(verticalMovement.vec3_lengthSigned(up), -1);
        let isMovementDownward = movementSign < 0;
        outFixedMovement = this._verticalMovementFix(verticalMovement, isMovementDownward, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement);

        if (outFixedMovement.vec_equals(verticalMovement, 0.00001) || originalMovementSign == 0 || (movementSign != originalMovementSign)) {
            newFeetPosition = feetPosition.vec3_add(outFixedMovement, newFeetPosition);
            let isOppositeMovementDownward = !isMovementDownward;
            additionalFixedMovement = this._verticalMovementFix(zero, isOppositeMovementDownward, originalMovementSign, newFeetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, additionalFixedMovement);

            outFixedMovement.vec3_add(additionalFixedMovement, outFixedMovement);
            isMovementDownward = !isMovementDownward;
        }

        newFeetPosition = feetPosition.vec3_add(outFixedMovement, newFeetPosition);
        let canStay = this._verticalPositionCheck(newFeetPosition, isMovementDownward, height, up, forward, collisionCheckParams, collisionRuntimeParams);
        if (!canStay) {
            outFixedMovement.vec3_zero();

            collisionRuntimeParams.myHasSnappedOnGround = false;
            collisionRuntimeParams.myHasSnappedOnCeiling = false;
            collisionRuntimeParams.myHasFixedPositionGround = false;
            collisionRuntimeParams.myHasFixedPositionCeiling = false;
        }

        return outFixedMovement;
    };
}();
Object.defineProperty(CollisionCheck.prototype, "_verticalCheck", { enumerable: false });

CollisionCheck.prototype._verticalMovementFix = function () {
    let startOffset = PP.vec3_create();
    let endOffset = PP.vec3_create();
    let tempVector = PP.vec3_create();
    let furtherDirection = PP.vec3_create();
    let furtherDirectionPosition = PP.vec3_create();
    let upNegate = PP.vec3_create();
    let origin = PP.vec3_create();
    let direction = PP.vec3_create();
    return function _verticalMovementFix(verticalMovement, isMovementDownward, originalMovementSign, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, outFixedMovement) {
        this._myDebugActive = collisionCheckParams.myDebugActive && collisionCheckParams.myDebugVerticalMovementActive;

        startOffset.vec3_zero();
        endOffset.vec3_zero();

        let fixPositionEnabled = false;
        let snapEnabled = false;

        if (isMovementDownward) {
            startOffset.vec3_zero();
            endOffset.vec3_copy(verticalMovement);

            if (collisionCheckParams.myGroundFixDistanceFromFeet > 0) {
                startOffset.vec3_add(up.vec3_scale(collisionCheckParams.myGroundFixDistanceFromFeet + 0.00001, tempVector), startOffset);
                fixPositionEnabled = true;
            }
        } else {
            startOffset = up.vec3_scale(height, startOffset);
            endOffset = up.vec3_scale(height, endOffset).vec3_add(verticalMovement, endOffset);

            if (collisionCheckParams.myGroundFixDistanceFromHead > 0) {
                startOffset.vec3_add(up.vec3_scale(-collisionCheckParams.myGroundFixDistanceFromHead - 0.00001, tempVector), startOffset);
                fixPositionEnabled = true;
            }
        }

        if (isMovementDownward && originalMovementSign <= 0 && this._myPrevCollisionRuntimeParams.myIsOnGround && collisionCheckParams.mySnapOnGroundEnabled && collisionCheckParams.mySnapOnGroundExtraDistance > 0) {
            endOffset.vec3_add(up.vec3_scale(-collisionCheckParams.mySnapOnGroundExtraDistance - 0.00001, tempVector), endOffset);
            snapEnabled = true;
        } else if (!isMovementDownward && this._myPrevCollisionRuntimeParams.myIsOnCeiling && collisionCheckParams.mySnapOnCeilingEnabled && collisionCheckParams.mySnapOnCeilingExtraDistance > 0 &&
            (originalMovementSign > 0 || (originalMovementSign == 0 && (!this._myPrevCollisionRuntimeParams.myIsOnGround || !collisionCheckParams.mySnapOnGroundEnabled)))) {
            endOffset.vec3_add(up.vec3_scale(collisionCheckParams.mySnapOnCeilingExtraDistance + 0.00001, tempVector), endOffset);
            snapEnabled = true;
        }

        outFixedMovement.vec3_zero();
        if (startOffset.vec3_distance(endOffset) > 0.00001) {
            let checkPositions = this._getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams);

            furtherDirection.vec3_copy(up);
            if (!isMovementDownward) {
                furtherDirection.vec3_negate(furtherDirection);
            }

            let furtherDirectionPositionSet = false;

            for (let i = 0; i < checkPositions.length; i++) {
                let currentPosition = checkPositions[i];

                origin = currentPosition.vec3_add(startOffset, origin);
                direction = currentPosition.vec3_add(endOffset, direction).vec3_sub(origin, direction);
                let distance = direction.vec3_length();
                direction.vec3_normalize(direction);

                let raycastResult = this._raycastAndDebug(origin, direction, distance, true, collisionCheckParams, collisionRuntimeParams);

                if (raycastResult.myHits.length > 0) {
                    if (furtherDirectionPositionSet) {
                        if (raycastResult.myHits[0].myPosition.vec3_isFurtherAlongDirection(furtherDirectionPosition, furtherDirection)) {
                            furtherDirectionPosition.vec3_copy(raycastResult.myHits[0].myPosition);
                        }
                    } else {
                        furtherDirectionPositionSet = true;
                        furtherDirectionPosition.vec3_copy(raycastResult.myHits[0].myPosition);
                    }
                }
            }

            if (furtherDirectionPositionSet) {
                upNegate = up.vec3_negate(upNegate);
                if (isMovementDownward) {
                    outFixedMovement = furtherDirectionPosition.vec3_sub(feetPosition, outFixedMovement).vec3_componentAlongAxis(up, outFixedMovement);

                    if (snapEnabled && outFixedMovement.vec3_isFurtherAlongDirection(verticalMovement, upNegate)) {
                        collisionRuntimeParams.myHasSnappedOnGround = true;
                    } else if (fixPositionEnabled && outFixedMovement.vec3_isFurtherAlongDirection(verticalMovement, up)) {
                        collisionRuntimeParams.myHasFixedPositionGround = true;
                    }
                } else {
                    outFixedMovement = furtherDirectionPosition.vec3_sub(feetPosition.vec3_add(up.vec3_scale(height, outFixedMovement), outFixedMovement), outFixedMovement).
                        vec3_componentAlongAxis(up, outFixedMovement);

                    if (snapEnabled && outFixedMovement.vec3_isFurtherAlongDirection(verticalMovement, up)) {
                        collisionRuntimeParams.myHasSnappedOnCeiling = true;
                    } else if (fixPositionEnabled && outFixedMovement.vec3_isFurtherAlongDirection(verticalMovement, upNegate)) {
                        collisionRuntimeParams.myHasFixedPositionCeiling = true;
                    }
                }
            } else {
                outFixedMovement.vec3_copy(verticalMovement);
            }
        } else {
            outFixedMovement.vec3_copy(verticalMovement);
        }

        if (outFixedMovement.vec3_length() < 0.00001) {
            outFixedMovement.vec3_zero();
        }

        return outFixedMovement;
    };
}();
Object.defineProperty(CollisionCheck.prototype, "_verticalMovementFix", { enumerable: false });

CollisionCheck.prototype._verticalPositionCheck = function () {
    let smallHeightFixOffset = PP.vec3_create();
    let heightOffset = PP.vec3_create();
    let startPosition = PP.vec3_create();
    let endPosition = PP.vec3_create();
    let direction = PP.vec3_create();
    return function _verticalPositionCheck(feetPosition, checkUpward, height, up, forward, collisionCheckParams, collisionRuntimeParams) {
        this._myDebugActive = collisionCheckParams.myDebugActive && collisionCheckParams.myDebugVerticalPositionActive;

        if (height < 0.00001) {
            return true;
        }

        let checkPositions = this._getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams);

        let isVerticalPositionOk = true;
        let atLeastOneIsOk = false;

        let adjustmentEpsilon = 0.00001;
        smallHeightFixOffset = up.vec3_scale(adjustmentEpsilon, smallHeightFixOffset);
        heightOffset = up.vec3_scale(height - adjustmentEpsilon, heightOffset);
        if (height - adjustmentEpsilon < adjustmentEpsilon) {
            heightOffset = up.vec3_scale(adjustmentEpsilon * 2, heightOffset);
        }

        let insideHitSet = false;
        for (let i = 0; i < checkPositions.length; i++) {
            let currentPosition = checkPositions[i];

            if (checkUpward) {
                startPosition = currentPosition.vec3_add(smallHeightFixOffset, startPosition);
                endPosition = currentPosition.vec3_add(heightOffset, endPosition);
            } else {
                startPosition = currentPosition.vec3_add(heightOffset, startPosition);
                endPosition = currentPosition.vec3_add(smallHeightFixOffset, endPosition);
            }

            let origin = startPosition;
            direction = endPosition.vec3_sub(origin, direction);
            let distance = direction.vec3_length();
            direction.vec3_normalize(direction);

            let raycastResult = this._raycastAndDebug(origin, direction, distance, false, collisionCheckParams, collisionRuntimeParams);

            if (raycastResult.isColliding()) {
                let firstHitOutsideCollision = raycastResult.getFirstHitOutsideCollision();
                if (firstHitOutsideCollision != null) {
                    isVerticalPositionOk = false;
                    collisionRuntimeParams.myVerticalCollisionHit.copy(firstHitOutsideCollision);
                    break;
                } else if (!insideHitSet) {
                    insideHitSet = true;
                    collisionRuntimeParams.myVerticalCollisionHit.copy(raycastResult.myHits[0]);
                }
            } else {
                atLeastOneIsOk = true;
            }

            let hitsOutsideCollision = raycastResult.getHitsOutsideCollision();
            if (hitsOutsideCollision.length > 0) {
                isVerticalPositionOk = false;
                collisionRuntimeParams.myVerticalCollisionHit.copy(hitsOutsideCollision[0]);
                break;
            } else if (raycastResult.myHits.length == 0) {
                atLeastOneIsOk = true;
            } else if (!collisionRuntimeParams.myVerticalCollisionHit.isValid()) {
                collisionRuntimeParams.myVerticalCollisionHit.copy(raycastResult.myHits[0]);
            }
        }

        collisionRuntimeParams.myIsCollidingVertically = !isVerticalPositionOk || !atLeastOneIsOk;

        return !collisionRuntimeParams.myIsCollidingVertically;
    };
}();
Object.defineProperty(CollisionCheck.prototype, "_verticalPositionCheck", { enumerable: false });

CollisionCheck.prototype._getVerticalCheckPositions = function () {
    let checkPositions = [];
    let cachedCheckPositions = [];
    let currentCachedCheckPositionIndex = 0;
    let _localGetCachedCheckPosition = function () {
        let item = null;
        while (cachedCheckPositions.length <= currentCachedCheckPositionIndex) {
            cachedCheckPositions.push(PP.vec3_create());
        }

        item = cachedCheckPositions[currentCachedCheckPositionIndex];
        currentCachedCheckPositionIndex++;
        return item;
    };

    let currentDirection = PP.vec3_create();
    return function _getVerticalCheckPositions(feetPosition, up, forward, collisionCheckParams, collisionRuntimeParams) {
        checkPositions.length = 0;
        currentCachedCheckPositionIndex = 0;

        checkPositions.push(feetPosition);

        let radiusStep = collisionCheckParams.myFeetRadius / collisionCheckParams.myGroundCircumferenceStepAmount;
        let sliceAngle = 360 / collisionCheckParams.myGroundCircumferenceSliceAmount;
        let currentStepRotation = 0;
        for (let i = 0; i < collisionCheckParams.myGroundCircumferenceStepAmount; i++) {
            let currentRadius = radiusStep * (i + 1);

            currentDirection = forward.vec3_rotateAxis(currentStepRotation, up, currentDirection);
            for (let j = 0; j < collisionCheckParams.myGroundCircumferenceSliceAmount; j++) {
                let tempCheckPosition = _localGetCachedCheckPosition();
                let sliceDirection = currentDirection.vec3_rotateAxis(sliceAngle * j, up, tempCheckPosition);
                checkPositions.push(feetPosition.vec3_add(sliceDirection.vec3_scale(currentRadius, sliceDirection), sliceDirection));
            }

            currentStepRotation += collisionCheckParams.myGroundCircumferenceRotationPerStep;
        }

        return checkPositions;
    };
}();
Object.defineProperty(CollisionCheck.prototype, "_getVerticalCheckPositions", { enumerable: false });