import { initCauldronExtensions } from "./cauldron_extensions.js";
import { initObjectExtension } from "./object_extension.js";
import { initSceneExtension } from "./scene_extension.js";

/**
 *  TS import preserver
 * 
 *  This is only needed to make it so the import is not removed, since it makes the type extensions available to the Typescript 
 */
export { initCauldronExtensions } from "./cauldron_extensions.js";
export { initObjectExtension } from "./object_extension.js";
export { initSceneExtension } from "./scene_extension.js";

export function initWLExtensions() {
    initObjectExtension();
    initSceneExtension();
    initCauldronExtensions();
}