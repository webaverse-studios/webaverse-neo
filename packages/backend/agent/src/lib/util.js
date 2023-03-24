export class Deque {
  constructor(maxSize) {
    this.maxSize = maxSize
    this.items = []
  }

  push(item) {
    if (this.items.length === this.maxSize) {
      this.items.shift()
    }
    this.items.push(item)
  }

  toArray() {
    return this.items
  }
}
