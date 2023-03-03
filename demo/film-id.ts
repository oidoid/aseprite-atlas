import { Immutable } from '@/ooz'

/**
 * The film identifier for all Animations in the Atlas. IDs are used to
 * reference immutable image source properties, such as dimensions and animation
 * duration, from the Atlas.
 */
export type FilmID = Parameters<typeof FilmID.values['has']>[0]

export namespace FilmID {
  export const values = Immutable(
    new Set(
      [
        'frog-Eat',
        'frog-EatLoop',
        'frog-Idle',
        'backpacker-WalkRight',
        'backpacker-WalkDown',
        'backpacker-WalkUp',
      ] as const,
    ),
  )
}
