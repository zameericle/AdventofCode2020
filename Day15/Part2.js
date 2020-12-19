/** this is a horrible brute force attempt, unoptimized as well
 * if I had more time I would have:
 *   - kept my array sizes fixed (2 elements are needed per entry) [previous to last turn, last turn]...
 */

const { Console } = require("console")
const { start } = require("repl")

let input = "0,13,1,16,6,17"

let turns = input.split(/,/)
   .map((val) => parseInt(val))
   .reduce((map, val, idx) => {
      map[val] = [idx+1]
      map.lastSpoken = val
      return map
   }, {})


for (turn = Object.keys(turns).length; turn <= 30000000; turn++) {   
   /* first time */
   if (turns[turns.lastSpoken].length === 1) {      
      if (turns[0] === undefined) {
            turns[0] = [turn]
      } else {
         turns[0].push(turn)
      }
      turns.lastSpoken = 0
   } else {
      let turnEntries = turns[turns.lastSpoken]
      let b = turnEntries[turnEntries.length - 1]
      let a = turnEntries[turnEntries.length - 2]
      let nextTurn = b-a
      if (turns[nextTurn] === undefined) {
         turns[nextTurn] = [turn]
      } else {
         turns[nextTurn].push(turn)
      }
      turns.lastSpoken = nextTurn
   }
}

console.log(turns.lastSpoken)   