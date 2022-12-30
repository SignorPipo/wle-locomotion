CollisionCheck.prototype._horizontalCheck = function () {
    let fixedFeetPosition = PP.vec3_create();
    let newFixedFeetPosition = PP.vec3_create();
    let newFeetPosition = PP.vec3_create();
    return function _horizontalCheck(movement, feetPosition, height, up, forward, collisionCheckParams, collisionRuntimeParams, avoidSlidingExtraCheck, outFixedMovement) {
        collisionRuntimeParams.myIsCollidingHorizontally = false;
        collisionRuntimeParams.myHorizontalCollisionHit.reset();

        fixedFeetPosition = feetPosition.vec3_add(up.vec3_scale(collisionCheckParams.myDistanceFromFeetToIgnore + 0.0001, fixedFeetPosition), fixedFeetPosition);
        let fixedHeight = Math.max(0, height - collisionCheckParams.myDistanceFromFeetToIgnore - collisionCheckParams.myDistanceFromHeadToIgnore - 0.0001 * 2);

        let canMove = true;
        if (collisionCheckParams.myHorizontalMovementCheckEnabled && !movement.vec3_isZero(0.000001)) {
            canMove = this._horizontalMovementCheck(movement, feetPosition, height, fixedFeetPosition, fixedHeight, up, collisionCheckParams, collisionRuntimeParams);
        }

        outFixedMovement.vec3_zero();

        if (canMove) {
            if (collisionCheckParams.myHorizontalPositionCheckEnabled) {
                newFixedFeetPosition = fixedFeetPosition.vec3_add(movement, newFixedFeetPosition);
                newFeetPosition = feetPosition.vec3_add(movement, newFeetPosition);
                let canStay = this._horizontalPositionCheck(newFeetPosition, height, newFixedFeetPosition, fixedHeight, up, forward, collisionCheckParams, collisionRuntimeParams);
                if (canStay) {
                    outFixedMovement.vec3_copy(movement);
                }

                if (outFixedMovement.vec3_isZero(0.000001)) {
                    outFixedMovement.vec3_zero();
                }
            } else {
                outFixedMovement.vec3_copy(movement);
            }
        } else if (!avoidSlidingExtraCheck && collisionCheckParams.mySlidingEnabled && collisionCheckParams.mySlidingHorizontalMovementCheckBetterNormal) {
            this._horizontalCheckBetterSlideNormal(movement, feetPosition, height, fixedFeetPosition, fixedHeight, up, forward, collisionCheckParams, collisionRuntimeParams);
        }

        return outFixedMovement;
    };
}();

CollisionCheck.prototype._horizontalCheckRaycast = function () {
    let direction = PP.vec3_create();
    let fixedFeetPosition = PP.vec3_create();
    let fixedHitPosition = PP.vec3_create();
    return function _horizontalCheckRaycast(startPosition, endPosition, movementDirection, up,
        ignoreHitsInsideCollision, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
        feetPosition, fixHitOnCollision,
        collisionCheckParams, collisionRuntimeParams, checkAllHits = false, ignoreHitsInsideCollisionIfObjectToIgnore = false) {

        let origin = startPosition;
        direction = endPosition.vec3_sub(origin, direction);

        if (movementDirection != null && !direction.vec3_isConcordant(movementDirection)) {
            direction.vec3_negate(direction);
            origin = endPosition;
        }

        let distance = direction.vec3_length();
        direction.vec3_normalize(direction);
        let raycastResult = this._raycastAndDebug(origin, direction, distance, ignoreHitsInsideCollision, collisionCheckParams, collisionRuntimeParams);

        let isOk = true;

        if (raycastResult.isColliding()) {
            let hitsToControl = checkAllHits ? raycastResult.myHits.length : 1;
            let validHitIndex = 0;
            for (let i = 0; i < hitsToControl; i++) {
                let hit = raycastResult.myHits[i];
                if ((ignoreGroundAngleCallback == null || !ignoreGroundAngleCallback(hit, ignoreHitsInsideCollisionIfObjectToIgnore)) &&
                    (ignoreCeilingAngleCallback == null || !ignoreCeilingAngleCallback(hit, ignoreHitsInsideCollisionIfObjectToIgnore))) {
                    isOk = false;
                    validHitIndex = i;
                    break;
                }
            }

            if (!isOk && validHitIndex > 0) {
                for (let i = 0; i < validHitIndex; i++) {
                    raycastResult.removeHit(0);
                }
            }
        }

        if (!isOk && fixHitOnCollision) {
            let hitPosition = raycastResult.myHits[0].myPosition;

            fixedFeetPosition = feetPosition.vec3_copyComponentAlongAxis(hitPosition, up, fixedFeetPosition);
            fixedHitPosition.vec3_copy(hitPosition);

            let directionOffsetEpsilonValue = 0.0001;
            direction = direction.vec3_componentAlongAxis(up, direction);
            if (!direction.vec3_isZero(0.000001)) {
                // if the check has an up part move the hit a bit on the that direction
                direction.vec3_normalize(direction);
                direction.vec3_scale(directionOffsetEpsilonValue, direction);

                // this offset is a workaround for objects that in the editor are aligned but due to clamp get a bit tilted when in the game
                // and therefore trying an horizontal cast on the vertical hit position could result in hitting the bottom which in theory should be parallel and therefore not possible
                fixedFeetPosition.vec3_add(direction, fixedFeetPosition);
                fixedHitPosition.vec3_add(direction, fixedHitPosition);
            }

            // move the hit a bit further to prevent miss
            direction = fixedHitPosition.vec3_sub(fixedFeetPosition, direction);
            direction.vec3_normalize(direction);
            direction.vec3_scale(directionOffsetEpsilonValue, direction);
            fixedHitPosition = fixedHitPosition.vec3_add(direction, fixedHitPosition);

            let swapRaycastResult = this._myRaycastResult;
            this._myRaycastResult = this._myFixRaycastResult;

            isOk = this._horizontalCheckRaycast(fixedFeetPosition, fixedHitPosition, null, up,
                false, ignoreGroundAngleCallback, ignoreCeilingAngleCallback,
                feetPosition, false,
                collisionCheckParams, collisionRuntimeParams);

            if (this._myRaycastResult.isColliding()) {
                this._myFixRaycastResult = swapRaycastResult;
            } else {
                isOk = false;
                this._myRaycastResult = swapRaycastResult;
            }
        }

        return isOk;
    };
}();

CollisionCheck.prototype._ignoreSurfaceAngle = function () {
    let objectsEqualCallback = (first, second) => first.pp_equals(second);
    return function _ignoreSurfaceAngle(feetPosition, height, objectsToIgnore, outIgnoredObjects, isGround, isMovementCheck, up, collisionCheckParams, hit, ignoreHitsInsideCollisionIfObjectToIgnore) {
        let isIgnorable = false;

        let surfaceIgnoreDistance = null;
        let groundIgnoreDistance = isMovementCheck ? collisionCheckParams.myHorizontalMovementGroundAngleIgnoreDistance : collisionCheckParams.myHorizontalPositionGroundAngleIgnoreDistance;
        let ceilingIgnoreDistance = isMovementCheck ? collisionCheckParams.myHorizontalMovementCeilingAngleIgnoreDistance : collisionCheckParams.myHorizontalPositionCeilingAngleIgnoreDistance;
        if (isGround && groundIgnoreDistance != null) {
            surfaceIgnoreDistance = Math.pp_clamp(groundIgnoreDistance + 0.0002, 0, height);
        } else if (!isGround && ceilingIgnoreDistance != null) {
            surfaceIgnoreDistance = Math.pp_clamp(height - ceilingIgnoreDistance - 0.0002, 0, height);
        }

        if (!hit.myIsInsideCollision) {
            let surfaceAngle = hit.myNormal.vec3_angle(up);

            if ((isGround && (collisionCheckParams.myGroundAngleToIgnore > 0 && surfaceAngle <= collisionCheckParams.myGroundAngleToIgnore + 0.0001)) ||
                (!isGround && (collisionCheckParams.myCeilingAngleToIgnore > 0 && (180 - surfaceAngle) <= collisionCheckParams.myCeilingAngleToIgnore + 0.0001))) {
                if (objectsToIgnore == null || objectsToIgnore.pp_hasEqual(hit.myObject, objectsEqualCallback)) {
                    if (surfaceIgnoreDistance != null) {
                        let feetPositionUp = feetPosition.vec3_valueAlongAxis(up);
                        let hitUp = hit.myPosition.vec3_valueAlongAxis(up);
                        let hitHeight = hitUp - feetPositionUp;
                        if ((isGround && hitHeight <= surfaceIgnoreDistance) || (!isGround && hitHeight >= surfaceIgnoreDistance)) {
                            isIgnorable = true;
                        } else {
                            //console.error(hitHeight.toFixed(6));
                        }
                    } else {
                        isIgnorable = true;
                    }
                }
            }
        } else if (ignoreHitsInsideCollisionIfObjectToIgnore) {
            // #TODO when raycast pierce will work, if it gives the normal even when inside check if the angle is ok and only ignore if that's the case
            if (objectsToIgnore == null || objectsToIgnore.pp_hasEqual(hit.myObject, objectsEqualCallback)) {
                isIgnorable = true;
            }
        }

        if (isIgnorable) {
            if (outIgnoredObjects != null) {
                outIgnoredObjects.pp_pushUnique(hit.myObject, objectsEqualCallback);
            }
        }


        return isIgnorable;
    };
}();



Object.defineProperty(CollisionCheck.prototype, "_horizontalCheck", { enumerable: false });
Object.defineProperty(CollisionCheck.prototype, "_horizontalCheckRaycast", { enumerable: false });
Object.defineProperty(CollisionCheck.prototype, "_ignoreSurfaceAngle", { enumerable: false });

