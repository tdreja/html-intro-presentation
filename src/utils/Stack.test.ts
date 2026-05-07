import { beforeEach, describe, expect, it } from '@jest/globals';
import { Stack } from './Stack.ts';

describe('Stack<string>', () => {
    let stack: Stack<string>;

    beforeEach(() => {
        stack = new Stack<string>(10);
    });

    describe('isEmpty', () => {
        it('new stack is empty', () => {
            expect(stack.isEmpty()).toBe(true);
        });

        it('not empty after push', () => {
            stack.push('a');
            expect(stack.isEmpty()).toBe(false);
        });

        it('empty again after all items popped', () => {
            stack.push('a');
            stack.pop();
            expect(stack.isEmpty()).toBe(true);
        });
    });

    describe('size', () => {
        it('size 0 on new stack', () => {
            expect(stack.size()).toBe(0);
        });

        it('size increments on push', () => {
            stack.push('a');
            stack.push('b');
            expect(stack.size()).toBe(2);
        });

        it('size decrements on pop', () => {
            stack.push('a');
            stack.push('b');
            stack.pop();
            expect(stack.size()).toBe(1);
        });
    });

    describe('push / pop', () => {
        it('pop returns null on empty stack', () => {
            expect(stack.pop()).toBeNull();
        });

        it('pop returns last pushed item (LIFO)', () => {
            stack.push('first');
            stack.push('second');
            expect(stack.pop()).toBe('second');
        });

        it('pop removes item', () => {
            stack.push('a');
            stack.pop();
            expect(stack.size()).toBe(0);
        });

        it('multiple pops return items in LIFO order', () => {
            stack.push('x');
            stack.push('y');
            stack.push('z');
            expect(stack.pop()).toBe('z');
            expect(stack.pop()).toBe('y');
            expect(stack.pop()).toBe('x');
            expect(stack.pop()).toBeNull();
        });
    });

    describe('peek', () => {
        it('peek returns null on empty stack', () => {
            expect(stack.peek()).toBeNull();
        });

        it('peek returns top item without removing it', () => {
            stack.push('top');
            expect(stack.peek()).toBe('top');
            expect(stack.size()).toBe(1);
        });

        it('peek reflects most recent push', () => {
            stack.push('first');
            stack.push('second');
            expect(stack.peek()).toBe('second');
        });

        it('peek updates after pop', () => {
            stack.push('a');
            stack.push('b');
            stack.pop();
            expect(stack.peek()).toBe('a');
        });
    });

    describe('maxSize', () => {
        it('maxSize getter returns configured value', () => {
            expect(stack.maxSize).toBe(10);
        });

        it('size never exceeds maxSize', () => {
            for (let i = 0; i < 15; i++) {
                stack.push(`item-${i}`);
            }
            expect(stack.size()).toBe(10);
        });

        it('oldest item dropped when capacity exceeded', () => {
            const small = new Stack<string>(3);
            small.push('a');
            small.push('b');
            small.push('c');
            small.push('d'); // 'a' dropped
            expect(small.size()).toBe(3);
            expect(small.pop()).toBe('d');
            expect(small.pop()).toBe('c');
            expect(small.pop()).toBe('b');
            expect(small.pop()).toBeNull();
        });

        it('peek returns most recent after overflow', () => {
            const small = new Stack<string>(2);
            small.push('first');
            small.push('second');
            small.push('third'); // 'first' dropped
            expect(small.peek()).toBe('third');
        });

        it('maxSize minimum clamped to 1', () => {
            const tiny = new Stack<string>(0);
            expect(tiny.maxSize).toBe(1);
            tiny.push('only');
            tiny.push('replacement');
            expect(tiny.size()).toBe(1);
            expect(tiny.peek()).toBe('replacement');
        });
    });

    describe('clear', () => {
        it('clear empties the stack', () => {
            stack.push('a');
            stack.push('b');
            stack.clear();
            expect(stack.isEmpty()).toBe(true);
            expect(stack.size()).toBe(0);
        });

        it('clear on empty stack stays empty', () => {
            stack.clear();
            expect(stack.isEmpty()).toBe(true);
        });

        it('stack usable after clear', () => {
            stack.push('before');
            stack.clear();
            stack.push('after');
            expect(stack.peek()).toBe('after');
            expect(stack.size()).toBe(1);
        });
    });

    describe('iterable', () => {
        it('empty stack yields no items', () => {
            expect([...stack]).toEqual([]);
        });

        it('iterates top to bottom (FIFO order)', () => {
            stack.push('a');
            stack.push('b');
            stack.push('c');
            expect([...stack]).toEqual(['a', 'b', 'c']);
        });

        it('for-of loop works', () => {
            stack.push('x');
            stack.push('y');
            const result: string[] = [];
            for (const item of stack) {
                result.push(item);
            }
            expect(result).toEqual(['x', 'y']);
        });

        it('iteration does not mutate stack', () => {
            stack.push('a');
            stack.push('b');
            expect(stack.size()).toBe(2);
            expect(stack.peek()).toBe('b');
        });

        it('multiple iterations are independent', () => {
            stack.push('1');
            stack.push('2');
            expect([...stack]).toEqual(['1', '2']);
            expect([...stack]).toEqual(['1', '2']);
        });
    });
});
