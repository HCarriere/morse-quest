import { MapManager } from "../MapManager";
import { InputModale } from "./InputModale";

export class MapCreationModale extends InputModale {
    constructor() {
        super(
            'Id de la nouvelle map',
            (value: string) => {
                if (!value || MapManager.mapExists(value)) return;
                MapManager.addNewMap(value);
                MapManager.loadMap(value);
            },
            (char: string) => char != ' ',
            (value: string) => {
                if (!value) return 'id must be non-empty';
                if (MapManager.mapExists(value)) return 'a map with this id already exists';
                return '';
            }
        );
    }
}