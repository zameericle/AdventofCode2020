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
      let offsets = [
      -rowWidth-1, -rowWidth, -rowWidth+1, 
      -1, 0, 1, 
      rowWidth-1, rowWidth, rowWidth+1]

      let adjMatrix = 
      ['x','x','x',
      'x','x','x',
      'x','x','x']

      let numRows = parseInt(seats.length / rowWidth)

      function walkPath(from, offset, constrainToRow) {
         let seatIter = makeSeatIterator(seats, rowWidth) 
         let lookAt = from + offset    
         let nextSeat, nextRow

         do {
            nextSeat = seatIter.peakAt(lookAt).seat         
            nextRow = parseInt(lookAt / rowWidth)

            switch (nextSeat) {
               case "#": 
               case "L": {
                  return (constrainToRow && nextRow !== row) ? "x" : nextSeat
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

            lookAt += offset
         } while (true)
      }

      adjMatrix[0] = walkPath(currIdx, offsets[0])
      adjMatrix[1] = walkPath(currIdx, offsets[1])
      adjMatrix[2] = walkPath(currIdx, offsets[2])
      adjMatrix[3] = walkPath(currIdx, offsets[3], true)
      adjMatrix[4] = "E"
      adjMatrix[5] = walkPath(currIdx, offsets[5], true)
      adjMatrix[6] = walkPath(currIdx, offsets[6])
      adjMatrix[7] = walkPath(currIdx, offsets[7])
      adjMatrix[8] = walkPath(currIdx, offsets[8])

      /* first row set the top row of the adjMatrix to 'x'*/
      if (row <= 0) {
         adjMatrix[0] = 'x'
         adjMatrix[1] = 'x'
         adjMatrix[2] = 'x'
      }

      /* bottom row set the bottom row of the adjMatrix to 'x'*/
      if (row >= (numRows-1)) {
         adjMatrix[6] = 'x'
         adjMatrix[7] = 'x'
         adjMatrix[8] = 'x'
      }

      /* first col set the left column of the adjMatrix to 'x'*/
      if (col <= 0) {
         adjMatrix[0] = 'x'
         adjMatrix[3] = 'x'
         adjMatrix[6] = 'x'
      }

      /* first col set the right column of the adjMatrix to -1*/
      if (col >= (rowWidth-1)) {
         adjMatrix[2] = 'x'
         adjMatrix[5] = 'x'
         adjMatrix[8] = 'x'
      }     

      return adjMatrix
   }

   iter = makeSeatIterator(seats, rowWidth, adjacencyMatrixFn)
   let seatInfo = iter.next()
   let nextState = []
   let updateSeat = false
   let isUpdated = false
   let adjMatrix 

   while (!seatInfo.done) {
      updateSeat = false

      adjMatrix = seatInfo.adjMat()

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


// let seats = ".......#....#......#..................#L....#....#.............#...........#.....".split("")
// let seats = "L.LL.LL.LLLLLLLLL.LLL.L.L..L..LLLL.LL.LLL.LL.LL.LLL.LLLLL.LL..L.L.....LLLLLLLLLLL.LLLLLL.LL.LLLLL.LL".split("")
let seats = "###############".split("")
let rowWidth = 5

// let seats = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day11/input.txt", "utf8").split("")
// let rowWidth = 93

prettyPrint(seats,rowWidth)

let nextState = performRound(seats, rowWidth)

let run = 0

while(nextState[0]) {
   console.log("Round " + ++run)
   prettyPrint(nextState[1],rowWidth)

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

