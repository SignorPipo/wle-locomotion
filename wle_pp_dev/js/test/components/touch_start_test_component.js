import { Component } from "@wonderlandengine/api";
import { Globals } from "../../pp/pp/globals";

export class TouchStartTestComponent extends Component {
    static TypeName = "touch-start-test";
    static Properties = {};

    start() {
        Globals.getCanvas(this.engine).addEventListener('touchstart', function (e) {
            console.error("index:", e);
        }.bind(this));

        Globals.getCanvas(this.engine).addEventListener('touchend', function (e) {
            console.error("index:", e);
        }.bind(this));
    }
}