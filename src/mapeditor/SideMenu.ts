export abstract class SideMenu {
    constructor(public startX: number) {}
    /** Display the menu and return its height */
    public abstract display(startY: number): number;
}