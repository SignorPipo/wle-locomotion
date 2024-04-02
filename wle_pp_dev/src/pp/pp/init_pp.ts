import { WonderlandEngine } from "@wonderlandengine/api";
import { registerWLComponents } from "../cauldron/wl/register_wl_components.js";
import { ComponentUtils } from "../cauldron/wl/utils/component_utils.js";
import { initPlugins } from "../plugin/init_plugins.js";
import { Globals } from "./globals.js";
import { registerPPComponents } from "./register_pp_components.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import for the function is not removed, 
 *  since that import makes the type extensions added by the function available to the Typescript 
 */
export { initPlugins } from "../plugin/init_plugins.js";

export function initPP(engine: WonderlandEngine): void {
    Globals.setMainEngine(engine);

    ComponentUtils.setDefaultWLComponentCloneCallbacks(engine);

    registerWLComponents(engine);
    registerPPComponents(engine);

    initPlugins();
}