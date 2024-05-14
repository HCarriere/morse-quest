export class Pool<T> {
    private items: T[] = [];
    constructor(public name: string) {}
    public add(newItems: T[]): void {
        this.items.push(...newItems);
        console.log(this.name, this.items);
    }
    public drawRandomItem(): T {
        if (this.items.length == 0) {
            return null;
        }
        let itemIndex = Math.floor(Math.random() * this.items.length);
        let spell = this.items.splice(itemIndex, 1)[0];
        console.log(this.name, this.items);
        return spell;
    }
    public static fromArray<T>(items: T[], name: string): Pool<T> {
        let pool = new Pool<T>(name);
        pool.add(items);
        return pool;
    }
}