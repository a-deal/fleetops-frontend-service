import fc from 'fast-check';

import { CircularBuffer } from '../../circular-buffer';

describe('CircularBuffer properties', () => {
  test('never exceeds capacity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 1, max: 1000 }),
        (items, capacity) => {
          const buffer = new CircularBuffer(capacity);
          items.forEach(item => buffer.push(item));
          expect(buffer.size).toBeLessThanOrEqual(capacity);
        }
      )
    );
  });

  test('maintains insertion order within capacity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1, maxLength: 100 }),
        (items) => {
          const buffer = new CircularBuffer(items.length);
          items.forEach(item => buffer.push(item));
          expect(buffer.getAll()).toEqual(items);
        }
      )
    );
  });

  test('oldest items are discarded when over capacity', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 10, maxLength: 100 }),
        fc.integer({ min: 1, max: 50 }),
        (items, capacity) => {
          if (capacity >= items.length) return; // Skip when not overflowing
          
          const buffer = new CircularBuffer(capacity);
          items.forEach(item => buffer.push(item));
          
          const expected = items.slice(-capacity);
          expect(buffer.getAll()).toEqual(expected);
        }
      )
    );
  });

  test('getLast returns correct subset', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1, maxLength: 100 }),
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (items, capacity, n) => {
          const buffer = new CircularBuffer(capacity);
          items.forEach(item => buffer.push(item));
          
          const allItems = buffer.getAll();
          const lastN = buffer.getLast(n);
          
          // Handle edge case: slice(-0) returns full array, but getLast(0) should return empty array
          const expected = n === 0 ? [] : allItems.slice(-n);
          expect(lastN).toEqual(expected);
        }
      )
    );
  });

  test('size property is always accurate', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 1, max: 100 }),
        (items, capacity) => {
          const buffer = new CircularBuffer(capacity);
          
          items.forEach((item, index) => {
            buffer.push(item);
            const expectedSize = Math.min(index + 1, capacity);
            expect(buffer.size).toBe(expectedSize);
          });
        }
      )
    );
  });

  test('isFull property is accurate', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 1, max: 100 }),
        (items, capacity) => {
          const buffer = new CircularBuffer(capacity);
          
          items.forEach((item, index) => {
            buffer.push(item);
            const shouldBeFull = index >= capacity - 1;
            expect(buffer.isFull).toBe(shouldBeFull);
          });
        }
      )
    );
  });

  test('clear always results in empty buffer', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: 1, max: 100 }),
        (items, capacity) => {
          const buffer = new CircularBuffer(capacity);
          
          // Add some items
          items.slice(0, Math.min(items.length, 10)).forEach(item => buffer.push(item));
          
          // Clear and verify
          buffer.clear();
          expect(buffer.size).toBe(0);
          expect(buffer.getAll()).toEqual([]);
          expect(buffer.isFull).toBe(false);
          expect(buffer.getLast(5)).toEqual([]);
        }
      )
    );
  });

  test('buffer preserves item identity (no mutations)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.object()),
        fc.integer({ min: 1, max: 50 }),
        (objects, capacity) => {
          const buffer = new CircularBuffer(capacity);
          const original = objects.map(obj => ({ ...obj }));
          
          objects.forEach(obj => buffer.push(obj));
          
          const retrieved = buffer.getAll();
          retrieved.forEach((item) => {
            const originalIndex = objects.indexOf(item);
            expect(item).toBe(objects[originalIndex]); // Same reference
            expect(item).toEqual(original[originalIndex]); // Same content
          });
        }
      )
    );
  });

  test('concurrent-like rapid pushes maintain consistency', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }),
        fc.integer({ min: 10, max: 100 }),
        (numOperations, capacity) => {
          const buffer = new CircularBuffer(capacity);
          const pushed: number[] = [];
          
          // Simulate rapid pushes
          for (let i = 0; i < numOperations; i++) {
            buffer.push(i);
            pushed.push(i);
          }
          
          // Verify final state
          const expected = pushed.slice(-Math.min(capacity, pushed.length));
          expect(buffer.getAll()).toEqual(expected);
          expect(buffer.size).toBe(Math.min(capacity, pushed.length));
        }
      )
    );
  });

  test('mathematical properties of capacity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }),
        (capacity) => {
          const buffer = new CircularBuffer(capacity);
          
          // Empty buffer
          expect(buffer.size + (buffer.capacity - buffer.size)).toBe(capacity);
          
          // Fill partially
          const halfFill = Math.floor(capacity / 2);
          for (let i = 0; i < halfFill; i++) {
            buffer.push(i);
          }
          expect(buffer.size + (buffer.capacity - buffer.size)).toBe(capacity);
          
          // Fill completely
          for (let i = halfFill; i < capacity * 2; i++) {
            buffer.push(i);
          }
          expect(buffer.size).toBe(buffer.capacity);
          expect(buffer.isFull).toBe(true);
        }
      )
    );
  });
});