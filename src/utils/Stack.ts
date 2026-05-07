export class Stack<T> implements Iterable<T> {
    private readonly _maxSize: number;
    private items: T[] = [];

    public constructor(maxSize: number) {
        this._maxSize = Math.max(1, maxSize);
    }

    public get maxSize(): number {
        return this._maxSize;
    }

    public push(item: T): void {
        this.items.push(item);
        if (this.items.length > this._maxSize) {
            this.items.shift();
        }
    }

    public pop(): T | null {
        return this.items.pop() || null;
    }

    public peek(): T | null {
        if (this.items.length === 0) {
            return null;
        }
        return this.items[this.items.length - 1] || null;
    }

    public isEmpty(): boolean {
        return this.items.length === 0;
    }

    public clear(): void {
        this.items = [];
    }

    public size(): number {
        return this.items.length;
    }

    public [Symbol.iterator](): Iterator<T> {
        let index = 0;
        const items = this.items;
        return {
            next(): IteratorResult<T> {
                if (index >= items.length) {
                    return { value: undefined as unknown as T, done: true };
                }
                return { value: items[index++], done: false };
            },
        };
    }
}
