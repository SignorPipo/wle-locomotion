PlayerLocomotionParams = class PlayerLocomotionParams {
    constructor() {
        this.myMaxSpeed = 0;
        this.myMaxRotationSpeed = 0;

        this.myIsSnapTurn = false;
        this.mySnapTurnAngle = 0;

        this.myFlyEnabled = false;
        this.myMinAngleToFlyUpHead = 0;
        this.myMinAngleToFlyDownHead = 0;
        this.myMinAngleToFlyUpHand = 0;
        this.myMinAngleToFlyDownHand = 0;
        this.myMinAngleToFlyRight = 0;

        this.myDirectionReferenceType = PlayerLocomotionDirectionReferenceType.HEAD;
    }
};

// #TODO add lerped snap on vertical over like half a second to avoid the "snap effect"
// this could be done by detatching the actual vertical position of the player from the collision real one when a snap is detected above a certain threshold
// with a timer, after which the vertical position is just copied, while during the detatching is lerped toward the collision vertical one
PlayerLocomotion = class PlayerLocomotion {
    constructor(params) {
        this._myParams = params;

        this._myCollisionCheckParamsSmooth = new CollisionCheckParams();

        this._myCollisionRuntimeParams = new CollisionRuntimeParams();

        this._setupCollisionCheckParamsSmooth();

        this._myPlayerHeadManager = new PlayerHeadManager();

        {
            let params = new PlayerLocomotionRotateParams();

            params.myPlayerHeadManager = this._myPlayerHeadManager;

            params.myMaxRotationSpeed = this._myParams.myMaxRotationSpeed;
            params.myIsSnapTurn = this._myParams.myIsSnapTurn;
            params.mySnapTurnAngle = this._myParams.mySnapTurnAngle;

            params.myRotationMinStickIntensityThreshold = 0.1;
            params.mySnapTurnActivateThreshold = 0.5;
            params.mySnapTurnResetThreshold = 0.4;

            params.myClampVerticalAngle = true;
            params.myMaxVerticalAngle = 90;

            this._myPlayerLocomotionRotate = new PlayerLocomotionRotate(params);
        }

        {
            let params = new PlayerLocomotionSmoothParams();

            params.myPlayerHeadManager = this._myPlayerHeadManager;

            params.myCollisionCheckParams = this._myCollisionCheckParamsSmooth;
            params.myCollisionRuntimeParams = this._myCollisionRuntimeParams;

            params.myMaxSpeed = this._myParams.myMaxSpeed;

            params.myMovementMinStickIntensityThreshold = 0.1;

            params.myFlyEnabled = this._myParams.myFlyEnabled;
            params.myMinAngleToFlyUpHead = this._myParams.myMinAngleToFlyUpHead;
            params.myMinAngleToFlyDownHead = this._myParams.myMinAngleToFlyDownHead;
            params.myMinAngleToFlyUpHand = this._myParams.myMinAngleToFlyUpHand;
            params.myMinAngleToFlyDownHand = this._myParams.myMinAngleToFlyDownHand;
            params.myMinAngleToFlyRight = this._myParams.myMinAngleToFlyRight;

            params.myDirectionReferenceType = this._myParams.myDirectionReferenceType;

            this._myPlayerLocomotionSmooth = new PlayerLocomotionSmooth(params);
        }
    }

    start() {
        this._fixAlmostUp();

        this._myPlayerHeadManager.start();
        this._myPlayerLocomotionRotate.start();
        this._myPlayerLocomotionSmooth.start();
    }

    update(dt) {
        this._myPlayerHeadManager.update(dt);
        if (this._myPlayerHeadManager.isSynced()) {

            this._updateCollisionHeight();

            this._myPlayerLocomotionRotate.update(dt);
            this._myPlayerLocomotionSmooth.update(dt);
        }
    }

    _updateCollisionHeight() {
        this._myCollisionCheckParamsSmooth.myHeight = this._myPlayerHeadManager.getHeadHeight();
        if (this._myCollisionCheckParamsSmooth.myHeight <= 0.000001) {
            this._myCollisionCheckParamsSmooth.myHeight = 0;
        } else {
            this._myCollisionCheckParamsSmooth.myHeight += 0.15; //forehead + extra 
        }
    }

    _setupCollisionCheckParamsSmooth() {
        this._myCollisionCheckParamsSmooth.mySplitMovementEnabled = false;
        this._myCollisionCheckParamsSmooth.mySplitMovementMaxLength = 0;

        this._myCollisionCheckParamsSmooth.myRadius = 0.3;
        this._myCollisionCheckParamsSmooth.myDistanceFromFeetToIgnore = 0.1;
        this._myCollisionCheckParamsSmooth.myDistanceFromHeadToIgnore = 0.1;

        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckEnabled = true;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementStepEnabled = false;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementStepMaxLength = 0;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementRadialStepAmount = 1;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckDiagonal = true;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckStraight = false;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckHorizontalBorder = false;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckVerticalStraight = false;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckVerticalDiagonal = true;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckVerticalStraightDiagonal = false;
        this._myCollisionCheckParamsSmooth.myHorizontalMovementCheckVerticalHorizontalBorderDiagonal = false;

        this._myCollisionCheckParamsSmooth.myHalfConeAngle = 60;
        this._myCollisionCheckParamsSmooth.myHalfConeSliceAmount = 2;
        this._myCollisionCheckParamsSmooth.myCheckConeBorder = true;
        this._myCollisionCheckParamsSmooth.myCheckConeRay = true;
        this._myCollisionCheckParamsSmooth.myHorizontalPositionCheckVerticalIgnoreHitsInsideCollision = false;
        this._myCollisionCheckParamsSmooth.myHorizontalPositionCheckVerticalDirectionType = 2; // somewhat expensive, 2 times the check for the vertical check of the horizontal movement!

        this._myCollisionCheckParamsSmooth.myFeetRadius = 0.1;
        this._myCollisionCheckParamsSmooth.myAdjustVerticalMovementWithSurfaceAngle = true;

        this._myCollisionCheckParamsSmooth.mySnapOnGroundEnabled = true;
        this._myCollisionCheckParamsSmooth.mySnapOnGroundExtraDistance = 0.1;
        this._myCollisionCheckParamsSmooth.mySnapOnCeilingEnabled = false;
        this._myCollisionCheckParamsSmooth.mySnapOnCeilingExtraDistance = 0.1;

        this._myCollisionCheckParamsSmooth.myGroundCircumferenceSliceAmount = 8;
        this._myCollisionCheckParamsSmooth.myGroundCircumferenceStepAmount = 2;
        this._myCollisionCheckParamsSmooth.myGroundCircumferenceRotationPerStep = 22.5;
        this._myCollisionCheckParamsSmooth.myGroundFixDistanceFromFeet = 0.1;
        this._myCollisionCheckParamsSmooth.myGroundFixDistanceFromHead = 0.1;

        this._myCollisionCheckParamsSmooth.myCheckHeight = true;
        this._myCollisionCheckParamsSmooth.myCheckHeightTop = true;
        this._myCollisionCheckParamsSmooth.myCheckHeightConeOnCollision = true;
        this._myCollisionCheckParamsSmooth.myCheckHeightConeOnCollisionKeepHit = false;
        this._myCollisionCheckParamsSmooth.myHeightCheckStepAmount = 1;
        this._myCollisionCheckParamsSmooth.myCheckVerticalFixedForwardEnabled = true;
        this._myCollisionCheckParamsSmooth.myCheckVerticalStraight = true;
        this._myCollisionCheckParamsSmooth.myCheckVerticalDiagonalRay = false;
        this._myCollisionCheckParamsSmooth.myCheckVerticalDiagonalBorder = false;
        this._myCollisionCheckParamsSmooth.myCheckVerticalDiagonalBorderRay = false;
        this._myCollisionCheckParamsSmooth.myCheckVerticalSearchFurtherVerticalHit = false;

        this._myCollisionCheckParamsSmooth.myGroundAngleToIgnore = 30;
        this._myCollisionCheckParamsSmooth.myCeilingAngleToIgnore = 30;

        this._myCollisionCheckParamsSmooth.myHeight = 1;

        this._myCollisionCheckParamsSmooth.myDistanceToBeOnGround = 0.001;
        this._myCollisionCheckParamsSmooth.myDistanceToComputeGroundInfo = 0.1;
        this._myCollisionCheckParamsSmooth.myDistanceToBeOnCeiling = 0.001;
        this._myCollisionCheckParamsSmooth.myDistanceToComputeCeilingInfo = 0.1;
        this._myCollisionCheckParamsSmooth.myVerticalFixToBeOnGround = 0;
        this._myCollisionCheckParamsSmooth.myVerticalFixToComputeGroundInfo = 0;
        this._myCollisionCheckParamsSmooth.myVerticalFixToBeOnCeiling = 0;
        this._myCollisionCheckParamsSmooth.myVerticalFixToComputeCeilingInfo = 0;

        this._myCollisionCheckParamsSmooth.mySlidingEnabled = true;
        this._myCollisionCheckParamsSmooth.mySlidingHorizontalMovementCheckBetterNormal = true;
        this._myCollisionCheckParamsSmooth.mySlidingMaxAttempts = 4;
        this._myCollisionCheckParamsSmooth.mySlidingCheckBothDirections = true;        // expensive, 2 times the check for the whole horizontal movement!
        this._myCollisionCheckParamsSmooth.mySlidingFlickeringPreventionType = 1;      // expensive, 2 times the check for the whole horizontal movement!
        this._myCollisionCheckParamsSmooth.mySlidingFlickeringPreventionCheckOnlyIfAlreadySliding = true;
        this._myCollisionCheckParamsSmooth.mySlidingFlickerPreventionCheckAnywayCounter = 4;
        this._myCollisionCheckParamsSmooth.mySlidingAdjustSign90Degrees = true;

        this._myCollisionCheckParamsSmooth.myBlockLayerFlags = new PP.PhysicsLayerFlags();
        this._myCollisionCheckParamsSmooth.myBlockLayerFlags.setAllFlagsActive(true);
        let physXComponents = PP.myPlayerObjects.myPlayer.pp_getComponentsHierarchy("physx");
        for (let physXComponent of physXComponents) {
            this._myCollisionCheckParamsSmooth.myObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
        }

        this._myCollisionCheckParamsSmooth.myDebugActive = false;

        this._myCollisionCheckParamsSmooth.myDebugHorizontalMovementActive = false;
        this._myCollisionCheckParamsSmooth.myDebugHorizontalPositionActive = true;
        this._myCollisionCheckParamsSmooth.myDebugVerticalMovementActive = false;
        this._myCollisionCheckParamsSmooth.myDebugVerticalPositionActive = false;
        this._myCollisionCheckParamsSmooth.myDebugSlidingActive = false;
        this._myCollisionCheckParamsSmooth.myDebugSurfaceInfoActive = false;
        this._myCollisionCheckParamsSmooth.myDebugRuntimeParamsActive = true;
        this._myCollisionCheckParamsSmooth.myDebugMovementActive = false;
    }

    _fixAlmostUp() {
        // get rotation on y and adjust if it's slightly tilted when it's almsot 0,1,0

        let defaultUp = [0, 1, 0];
        let angleWithDefaultUp = PP.myPlayerObjects.myPlayer.pp_getUp().vec3_angle(defaultUp);
        if (angleWithDefaultUp < 1) {
            let forward = PP.myPlayerObjects.myPlayer.pp_getForward();
            let flatForward = forward.vec3_clone();
            flatForward[1] = 0;

            let defaultForward = [0, 0, 1];
            let angleWithDefaultForward = defaultForward.vec3_angleSigned(flatForward, defaultUp);

            PP.myPlayerObjects.myPlayer.pp_resetRotation();
            PP.myPlayerObjects.myPlayer.pp_rotateAxis(angleWithDefaultForward, defaultUp);
        }
    }
};