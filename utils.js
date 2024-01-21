import { PIECES, BOARD_WIDTH } from './constants'

// get random piece
export function randomPiece() {
  return PIECES[Math.floor(Math.random() * PIECES.length)]
}

// create initial board
export function createBoard(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(0))
}

// validate collisions
export function checkCollision(piece, board) {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

// remove complete lines
export function removeRows(board, score) {
  const rowsToRemove = []
  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach((y) => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
  return score
}

// solidify pieces
export function solidifyPiece(piece, board) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  // get random pieces
  piece.shape = randomPiece()
  // reset position
  piece.position.x = 5
  piece.position.y = 0
  // gameover
  if (checkCollision(piece, board)) {
    window.alert('Game over!!!')
    board.forEach((row) => row.fill(0))
  }
}
