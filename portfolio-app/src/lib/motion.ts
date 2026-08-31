export const SPRING_DEFAULT = { type: "spring", bounce: 0, duration: 0.4 } as const;
export const SPRING_MOMENTUM = { type: "spring", bounce: 0.2, duration: 0.35 } as const;

/** Apple momentum projection: where a flick would land. */
export function project(initialVelocity: number, decelerationRate = 0.998): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}
