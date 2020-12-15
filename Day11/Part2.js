fs = require("fs")

function makeSeatIterator(seats, rw, adjStratFn) {
   /* return the current seat + adjaceny matrix:
      1 2 3
      3 S 4
      5 6 7 */
   let rowWidth = rw
   let data = [...seats]
   let nextIdx = 0
   let nextSeat = data[nextIdx]
   let nextRow = parseInt(nextIdx / rowWidth)
   let nextCol = nextIdx % rowWidth
   let adjMatStrat = adjStratFn

   const seatIterator = {
      next: function() {
         let row = nextRow
         let col = nextCol
         let validSeat = nextSeat

         let result = {
            done: (nextSeat === undefined) ? true : false,
            seat: nextSeat,
            row:  row,
            col:  col,
            idx: nextIdx,
            adjMat: () => {
               return (validSeat === undefined) ? [] : adjMatStrat(row, col)
            }
         }

         nextIdx++
         nextSeat = data[nextIdx]
         nextRow = parseInt(nextIdx / rowWidth)
         nextCol = nextIdx % rowWidth

         return result
      },
      
      peakAt: function(idx) {
         let row = parseInt(idx / rowWidth)
         let col = idx % rowWidth
         let validSeat = data[idx]

         let result = {
            done: (nextSeat === undefined) ? true : false,
            seat: data[idx],
            row:  row,
            col:  col,
            idx: idx,
            adjMat: () => {
               return (validSeat === undefined) ? [] : adjMatStrat(row, col)
            }
         }         

         return result
      }
   }

   return seatIterator
}

function prettyPrint(seats, width) {
   let str=""

   seats.forEach((entry, idx) => {
      str += entry
      if ((idx % width) === (width - 1)) {
         str += "\n"
      }
   })

   console.log(str)
}

function performRound(seats, rowWidth) {
   let numRows = parseInt(seats.length / rowWidth)

   /* rowWidth-1, -rowWidth, -rowWidth+1, 
    *               -1, 0, 1, 
    *   rowWidth-1, rowWidth, rowWidth+1 
    *
    *   Unlike Part1, in part2 we need to walk up each of the 8 directions
    *   Until we either hit an "#" or an "L" or fall out of bounds.
    */
   let adjacencyMatrixFn = function (row, col) {   
      let currIdx = row * rowWidth + col

      let adjMatrix = 
      ['A','B','C',
       'D','E','F',
       'G','H','I']

      let numRows = parseInt(seats.length / rowWidth)

      function walkPath(from, nextPosFn) {
         let seatIter = makeSeatIterator(seats, rowWidth) 
         let {nextRow, nextCol} = nextPosFn(from)

         let nextSeat, lookAt, nextPos

         do {
            if ((nextRow < 0) || (nextRow >= numRows) ||
                (nextCol < 0) || (nextCol >= rowWidth)) {
               return "x" 
            }

            lookAt = nextRow * rowWidth + nextCol
            nextSeat = seatIter.peakAt(lookAt).seat         

            switch (nextSeat) {
               case "#": 
               case "L": {
                  return nextSeat
               }

               case undefined: {
                  return "x"
               }

               case '.': {
                  break
               }

               default: {
                  console.error("ERROR")
               }
            }

            nextPos = nextPosFn({row: nextRow, col: nextCol})
            nextRow = nextPos.nextRow
            nextCol = nextPos.nextCol
         } while (true)
      }

      let startPos = {
         row: row,
         col: col
      }

      adjMatrix[0] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row - 1, 
            nextCol: from.col - 1
         }
      })

      adjMatrix[1] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row - 1,
            nextCol: from.col
         }
      })

      adjMatrix[2] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row - 1,
            nextCol: from.col + 1
         }
      })      

      adjMatrix[3] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row,
            nextCol: from.col - 1
         }
      })      

      adjMatrix[4] = "[" + seats[currIdx] + "]"

      adjMatrix[5] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row,
            nextCol: from.col + 1
         }
      }) 

      adjMatrix[6] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row + 1,
            nextCol: from.col - 1
         }
      })       

      adjMatrix[7] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row + 1,
            nextCol: from.col
         }
      })  

      adjMatrix[8] = walkPath(startPos, (from) => {
         return {
            nextRow: from.row + 1,
            nextCol: from.col + 1
         }
      })  

      return adjMatrix
   }

   iter = makeSeatIterator(seats, rowWidth, adjacencyMatrixFn)
   let seatInfo = iter.next()
   let nextState = []
   let updateSeat = false
   let isUpdated = false
   let adjMatrix 
   let cache = []

   while (!seatInfo.done) {
      updateSeat = false

      adjMatrix = cache[seatInfo.idx] 
      if (adjMatrix === undefined) {
         adjMatrix = seatInfo.adjMat()
         cache[seatInfo.idx] = adjMatrix
      }
      
      switch(seatInfo.seat) {
         case "L":            
            updateSeat = adjMatrix.filter((val) => {
               return val === "#"
            }).length === 0

            nextState[seatInfo.idx] = updateSeat ? "#" : "L"
            if (updateSeat) {
               isUpdated = true
            }
            break

         case "#":

            updateSeat = adjMatrix.filter((val) => {
               return val === "#"
            }).length >= 5

            nextState[seatInfo.idx] = updateSeat? "L" : "#"
            if (updateSeat) {            
               isUpdated = true   
            }
            break

         case ".":
            nextState[seatInfo.idx] = seatInfo.seat
            break
            
         case "x":
            break
      }

      seatInfo = iter.next()
   }      

   return [isUpdated, nextState]
}


let seats = fs.readFileSync(process.env.INPUT_PATH, "utf8").split("")
let rowWidth = 93

prettyPrint(seats,rowWidth)

let nextState = performRound(seats, rowWidth)

let run = 0

while(nextState[0]) {
   console.log("Round " + ++run)

   nextState = performRound(nextState[1], rowWidth)   
}

prettyPrint(nextState[1],rowWidth)

let occupiedSeats = nextState[1].reduce((acc, val) => {
   if (val === "#") {
      acc++
   }
   return acc

}, 0)
console.log(occupiedSeats) 