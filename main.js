import './style.css'
import {
  BLOCK_SIZE,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  EVENT_MOVEMENTS
} from './constants.js'
import {
  randomPiece,
  createBoard,
  checkCollision,
  removeRows,
  solidifyPiece
} from './utils.js'

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// create board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

// initial piece
const piece = {
  position: { x: 5, y: 0 },
  shape: randomPiece()
}

let dropCounter = 0
let lastTime = 0

// update function
function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  console.log(dropCounter)
  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0
    if (checkCollision(piece, board)) {
      piece.position.y--
      solidifyPiece(piece, board)
      score = removeRows(board, score)
    }
  }
  draw()
  window.requestAnimationFrame(update)
}

// draw blocks
function draw() {
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.lineWidth = 0.1
        context.strokeStyle = 'royalblue'
        context.strokeRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'orange'
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })

  $score.innerText = score
}

document.addEventListener('keydown', (event) => {
  if (event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if (checkCollision(piece, board)) {
      piece.position.x++
    }
  }
  if (event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++
    if (checkCollision(piece, board)) {
      piece.position.x--
    }
  }
  if (event.key === EVENT_MOVEMENTS.DOWN) {
    piece.position.y++
    if (checkCollision(piece, board)) {
      piece.position.y--
      solidifyPiece(piece, board)
      score = removeRows(board, score)
    }
  }

  if (event.key === EVENT_MOVEMENTS.UP) {
    console.log('ArrowUp')
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }

    const previousShape = piece.shape
    piece.shape = rotated
    if (checkCollision(piece, board)) piece.shape = previousShape
  }
})

update()
