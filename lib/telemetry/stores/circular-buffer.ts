/**
 * CircularBuffer - Memory-safe data structure for telemetry storage
 * 
 * This implementation prevents the #1 cause of field device crashes: memory exhaustion.
 * It maintains a fixed-size buffer that automatically overwrites the oldest data
 * when new data arrives, ensuring constant memory usage during 12+ hour shifts.
 * 
 * Performance characteristics:
 * - push(): O(1) constant time
 * - getAll(): O(n) where n is capacity
 * - getLast(): O(k) where k is items requested
 * - Memory: Fixed at capacity * sizeof(T)
 */

import { ICircularBuffer } from '../types';

export class CircularBuffer<T> implements ICircularBuffer<T> {
  private buffer: (T | undefined)[];
  private writeIndex = 0;
  private itemCount = 0;
  private readonly _capacity: number;

  /**
   * Create a new CircularBuffer with fixed capacity
   * @param capacity Maximum number of items to store (must be positive)
   * @throws Error if capacity is not positive
   */
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('Capacity must be positive');
    }
    this._capacity = capacity;
    this.buffer = new Array(capacity);
  }

  /**
   * Add an item to the buffer
   * If buffer is full, overwrites the oldest item
   * @param item Item to add
   */
  push(item: T): void {
    this.buffer[this.writeIndex] = item;
    this.writeIndex = (this.writeIndex + 1) % this._capacity;
    if (this.itemCount < this._capacity) {
      this.itemCount++;
    }
  }

  /**
   * Get all items in chronological order (oldest to newest)
   * @returns Array of items in order
   */
  getAll(): T[] {
    if (this.itemCount < this._capacity) {
      // Buffer not full yet, return only valid items
      return this.buffer.slice(0, this.itemCount) as T[];
    }
    
    // Buffer is full, need to reorder from oldest to newest
    const result: T[] = [];
    for (let i = 0; i < this._capacity; i++) {
      const index = (this.writeIndex + i) % this._capacity;
      result.push(this.buffer[index] as T);
    }
    return result;
  }

  /**
   * Get the last n items in chronological order
   * @param n Number of items to retrieve
   * @returns Array of up to n most recent items
   */
  getLast(n: number): T[] {
    const count = Math.min(n, this.itemCount);
    const result: T[] = [];
    
    for (let i = count - 1; i >= 0; i--) {
      const index = (this.writeIndex - 1 - i + this._capacity) % this._capacity;
      result.push(this.buffer[index] as T);
    }
    
    return result;
  }

  /**
   * Remove all items from the buffer
   */
  clear(): void {
    this.buffer = new Array(this._capacity);
    this.writeIndex = 0;
    this.itemCount = 0;
  }

  /**
   * Get the current number of items in the buffer
   */
  get size(): number {
    return this.itemCount;
  }

  /**
   * Get the maximum capacity of the buffer
   */
  get capacity(): number {
    return this._capacity;
  }

  /**
   * Check if the buffer is at maximum capacity
   */
  get isFull(): boolean {
    return this.itemCount === this._capacity;
  }
}

/**
 * Factory function to create type-specific buffers with validation
 */
export function createTelemetryBuffer(capacity: number): CircularBuffer<import('../types').TelemetryReading> {
  return new CircularBuffer(capacity);
}

/**
 * Factory function to create aggregate buffers with validation
 */
export function createAggregateBuffer(capacity: number): CircularBuffer<import('../types').TelemetryAggregate> {
  return new CircularBuffer(capacity);
}