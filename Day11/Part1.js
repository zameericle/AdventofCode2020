fs = require("fs")

function makeSeatIterator(seats, rw) {
   /* return the current seat + adjaceny matrix:
      1 2 3
      3 S 4
      5 6 7 */
   let rowWidth = rw
   let numRows = parseInt(seats.length / rowWidth)
   let data = [...seats]
   let nextIdx = 0
   let nextSeat = data[nextIdx]
   let nextRow = parseInt(nextIdx / rowWidth)
   let nextCol = nextIdx % rowWidth

   const seatIterator = {
      next: function() {
         let result = {
            done: (nextSeat === undefined) ? true : false,
            seat: nextSeat,
            row:  nextRow,
            col:  nextCol,
            idx: nextIdx,
            adjMat: (nextSeat === undefined) ? [] : this.adjacencyMatrix(nextRow, nextCol)
         }

         nextIdx++
         nextSeat = data[nextIdx]
         nextRow = parseInt(nextIdx / rowWidth)
         nextCol = nextIdx % rowWidth

         return result
      },

  /*    [-11 -10 -9]
          [-1 0 1]
        [ 9 10 11] */
         adjacencyMatrix: function(row, col) {
            let currIdx = row * rowWidth + col
            let offsets = [
               -rowWidth-1, -rowWidth, -rowWidth+1, 
               -1, 0, 1, 
               rowWidth-1, rowWidth, rowWidth+1]

            let adjMatrix = 
               ['x','x','x',
                'x','x','x',
                'x','x','x']

            offsets.forEach((offset, idx) => {
               adjMatRowIdx = parseInt(idx / 3)
               adjMatColIdx = idx % 3
               let entry = data[currIdx + offset] 
              
               /* first row set the top row of the adjMatrix to 'x'*/
               if (row === 0 && adjMatRowIdx === 0) {
                  entry = 'x'
               }

               /* bottom row set the bottom row of the adjMatrix to 'x'*/
               if (row === (numRows-1) && adjMatRowIdx === 2) {
                  entry = 'x'
               }

               /* first col set the left column of the adjMatrix to 'x'*/
               if (col === 0 && adjMatColIdx === 0) {
                  entry = 'x'
               }

               /* first col set the right column of the adjMatrix to -1*/
               if (col === (rowWidth-1) && adjMatColIdx === 2) {
                  entry = 'x'
               }

               adjMatrix[idx] = entry  
            })            

            return adjMatrix
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
   
   iter = makeSeatIterator(seats, rowWidth)
   let seatInfo = iter.next()
   let nextState = []
   let updateSeat = false
   let isUpdated = false

   while (!seatInfo.done) {
      updateSeat = false

      switch(seatInfo.seat) {
         case "L":
            
            let updateSeat = seatInfo.adjMat.filter((val) => {
               return val === "#"
            }).length === 0

            nextState[seatInfo.idx] = updateSeat ? "#" : "L"
            if (updateSeat) {
               isUpdated = true
            }
            break

         case "#":
            let count = seatInfo.adjMat.reduce((cnt, val,idx) => {
               if ((val === "#") && (idx != 4)) {
                  cnt++
               }

               return cnt
            },0)

            nextState[seatInfo.idx] = (count >= 4) ? "L" : "#"
            if (count >= 4) {
               isUpdated = true   
            }
            break

         case ".":
            nextState[seatInfo.idx] = "."
            break
         case "x":
            break
      }
      
      seatInfo = iter.next()
   }      

   return [isUpdated, nextState]
}


// let seats = "L.LL.LL.LLLLLLLLL.LLL.L.L..L..LLLL.LL.LLL.LL.LL.LLL.LLLLL.LL..L.L.....LLLLLLLLLLL.LLLLLL.LL.LLLLL.LL"
//    .split("")
let seats = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day11/input.txt", "utf8").split("")
let rowWidth = 93 

let nextState = performRound(seats, rowWidth)

let run = 0

while(nextState[0]) {
   console.log("Round " + ++run)
   nextState = performRound(nextState[1], rowWidth) 
}

let occupiedSeats = nextState[1].reduce((acc, val) => {
   if (val === "#") {
      acc++
   }
   return acc

}, 0)

prettyPrint(nextState[1],rowWidth)
console.log(occupiedSeats)