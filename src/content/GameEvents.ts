import { MapObject } from "./Maps";

export class GameEvents {

    /**
     * Process anything that happens when the player cross this tile
     * @param event map tile number
     */
    public static processGameEvent(object: MapObject) {
        if (!object) return;

        if (object.onWalk) {
            object.onWalk();
        }
    }

}