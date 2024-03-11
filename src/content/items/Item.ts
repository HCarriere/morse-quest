
export enum InventorySlot {
    Head = 1,
    Armor = 2,
    Boots = 3,
    Weapon = 4,
}

export abstract class Item {

    public abstract name: string;

    public abstract effect: string;

    public abstract inventorySlot: InventorySlot;

    public description: string;

}