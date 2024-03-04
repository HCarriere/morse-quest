import { MapInfo } from "@game/system/GameMap";

export interface GameEncounter {
    
}

export class GameEvents {

    /**
     * Deal random encounter, according to map settings (biome, difficulty ...) 
     * (null is a chance)
     * @param map 
     * @returns 
     */
    public static generateMapEncounters(map: MapInfo, ): GameEncounter {
        return null;
    }
}