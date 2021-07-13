export type Vector2 = {
  x: number
  y: number
}

// Makes sure the two vectors are equal with a error boundary of 0.001
export const Equals = (a: Vector2, b: Vector2): boolean => {
  return Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001
}
