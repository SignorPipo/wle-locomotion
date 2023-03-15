WL.registerComponent('pp-debug-manager', {
}, {
    init: function () {
        PP.myDebugManager = new PP.DebugManager();
        PP.myDebugVisualManager = PP.myDebugManager.getDebugVisualManager();
    },
    start() {
        PP.myDebugManager.start();
    },
    update(dt) {
        PP.myDebugManager.update(dt);
    }
});

PP.myDebugManager = null;
PP.myDebugVisualManager = null;