import {Aseprite, Animator, Atlas, Parser} from '../../dist/lib/index.js'
import {AtlasID} from './atlas-id.js'

type Game = {
  readonly window: Window
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D
  animator: Animator
  readonly atlas: Atlas
  readonly atlasImage: HTMLImageElement
}

function main(window: Window): void {
  console.log(
    `
aseprite-atlas ┌>°┐
            by │  │idoid
               └──┘
    `.trim()
  )

  const [canvas] = window.document.getElementsByTagName('canvas')
  if (!canvas) throw Error('Missing canvas.')

  const context = canvas.getContext('2d')
  if (!context) throw Error('Missing context.')

  // Use nearest neighbor scaling.
  context.imageSmoothingEnabled = false

  Promise.all([
    loadJSON('atlas.json').then(Parser.parse),
    loadImage('atlas.png')
  ]).then(([atlas, atlasImage]) => {
    const game = {
      window,
      canvas,
      context,
      animator: Animator(),
      atlas,
      atlasImage
    }
    window.requestAnimationFrame(now => loop(game, now, now))
  })
}

/**
 * @arg then Fractional milliseconds.
 * @arg now Fractional milliseconds.
 */
function loop(game: Game, then: number, now: number): void {
  const milliseconds = now - then

  const animation = game.atlas.animations[AtlasID.BackpackerWalkRight]!
  game.animator = Animator.animate(
    game.animator.period,
    game.animator.exposure + milliseconds,
    animation
  )
  const cel = Animator.cel(game.animator.period, animation)
  const scale = 16
  const scaledSize = {w: animation.size.w * scale, h: animation.size.h * scale}

  game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)
  const src = <const>[
    cel.position.x,
    cel.position.y,
    animation.size.w,
    animation.size.h
  ]
  const dst = <const>[0, 0, scaledSize.w, scaledSize.h]
  game.context.drawImage(game.atlasImage, ...src, ...dst)

  game.window.requestAnimationFrame(then => loop(game, now, then))
}

function loadImage(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(image)
    image.src = uri
  })
}

function loadJSON(uri: string): Promise<Aseprite.File> {
  return fetch(uri).then(response => response.json())
}

main(window)
