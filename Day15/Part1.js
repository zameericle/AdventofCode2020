const { start } = require("repl")

let input = "0,13,1,16,6,17"

let turns = input.split(/,/)
   .map((val) => parseInt(val))
   .reduce((map, val, idx) => {
      let result = {}
      map[val] = [idx+1]
      map.lastSpoken = val
      return map
   }, {})


for (turn = Object.keys(turns).length; turn <= 2020; turn++) {
   
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