const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
export function result(board) {
  for (const line of lines) if (board[line[0]] && line.every(i => board[i] === board[line[0]])) return {winner: board[line[0]], line};
  return board.every(Boolean) ? {winner: 'draw', line: []} : null;
}
function score(board, turn, depth) {
  const end = result(board);
  if (end) return end.winner === 'O' ? 10-depth : end.winner === 'X' ? depth-10 : 0;
  const scores = [];
  for (let i=0;i<9;i++) if (!board[i]) {
    board[i] = turn;
    scores.push(score(board, turn === 'O' ? 'X' : 'O', depth+1));
    board[i] = '';
  }
  return turn === 'O' ? Math.max(...scores) : Math.min(...scores);
}
export function computerMove(board) {
  if (result(board)) return null;
  const draft = [...board];
  let best = -Infinity, move = null;
  // Stable preference for center/corners keeps repeated games deterministic.
  for (const i of [4,0,2,6,8,1,3,5,7]) if (!draft[i]) {
    draft[i]='O'; const value=score(draft,'X',0); draft[i]='';
    if (value>best) { best=value; move=i; }
  }
  return move;
}
