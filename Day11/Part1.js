rowWidth = 10
let rawSeats = "L.LL.LL.LLLLLLLLL.LLL.L.L..L..LLLL.LL.LLL.LL.LL.LLL.LLLLL.LL..L.L.....LLLLLLLLLLL.LLLLLL.LL.LLLLL.LL"

Floor = "."
Empty = "L"
Occupied = "#"

function makeSeatIterator(seats, rw) {
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
            console.log(row + "," + col + "=" + data[row*rowWidth + col])
            let currIdx = row * rowWidth + col
            let offsets = [-11, -10, -9, -1, 0, 1, 9, 10, 11]             
            let adjMatrix = 
               [-1,-1,-1, 
                -1,-1,-1,
                -1,-1,-1]

            offsets.forEach((offset, idx) => {
               adjMatRowIdx = parseInt(idx / 3)
               adjMatColIdx = idx % 3
               let entry = data[currIdx + offset] 
              
               /* first row set the top row of the adjMatrix to -1*/
               if (row === 0 && adjMatRowIdx === 0) {
                  entry = -1
               }

               /* bottom row set the bottom row of the adjMatrix to -1*/
               if (row === (rowWidth-1) && adjMatRowIdx === 2) {
                  entry = -1
               }

               /* first col set the left column of the adjMatrix to -1*/
               if (col === 0 && adjMatColIdx === 0) {
                  entry = -1
               }

               /* first col set the right column of the adjMatrix to -1*/
               if (col === (rowWidth-1) && adjMatColIdx === 2) {
                  entry = -1
               }

               adjMatrix[idx] = entry  
            })            

            return adjMatrix
         }

   //    adjacencyMatrix: function(row, col, width) {
   //       let currIdx = row * rowWidth + col
   //       let offsets = [-11, -10, -9, -1, 0, 1, 9, 10, 11]         
   //       let adjMatrix = []
         
   //       let r = row
   //       offsets.forEach((offset, idx) => {
   //          r = parseInt((row + idx) % width)
   //          let entry = data[currIdx + offset] 
   //          adjMatrix[idx] = entry !== undefined ? entry : 'x' 
   //       })
         
   //       /* exceptions */
   //       if (row === 0) {
   //          for (i = 0; i < width; i++) {
   //             adjMatrix[i] = 'x'
   //          }
   //       }

   //       if (col === 0) {
   //          for (i = 0; i < width; i++) {
   //             adjMatrix[i*width] = 'x'
   //          }
   //       }

   //       if ((col === rowWidth - 1) && (row !== rowWidth - 1)) {
   //          for (i = 0; i < width; i++) {
   //             adjMatrix[i*width + width] = 'x'
   //             adjMatrix[i*width + width-1] = 'x'
   //          }
   //       }

   //       if (row === rowWidth - 1) {
   //          adjMatrix[width - 1] = 'x'
   //       }
   //       return adjMatrix
   //    }
   }

   return seatIterator
}

function prettyPrint(seats, width) {
   let str=""

   seats.forEach((entry, idx) => {
      if (entry.length == 1) {
         str += " "
      }

      str += entry + " "
      if ((idx % width) === 2) {
         str += "\n"
      }      
   })

   console.log(str)
}

function performRound(seats) {
   
   iter = makeSeatIterator(seats, rowWidth)
   let seatInfo = iter.next()
   let nextState = []
   let updateSeat = false
   let isUpdated = false

   while (!seatInfo.done) {
      updateSeat = false
      prettyPrint(seatInfo.adjMat, 3)
      seatInfo = iter.next()
   }

   //    switch(seatInfo.seat) {
   //       case "L":
   //          updateSeat = seatInfo.adjMat.reduce((mod, val) => {
   //             if ((val === "x") || (val === ".")) {
   //                return mod
   //             }
      
   //             if (val === "L") {
   //                return true
   //             }
   //          },false)
   
   
   //          nextState[seatInfo.idx] = updateSeat ? "#" : "L"
   //          if (updateSeat) {
   //             isUpdated = true
   //          }
   //          break
   
   //       case "#":
   //          let count = seatInfo.adjMat.reduce((cnt, val,idx) => {
   //             if ((val === "#") && (idx != 4)) {
   //                cnt++
   //             }

   //             return cnt
   //          },0)

   //          nextState[seatInfo.idx] = (count >= 4) ? "L" : "#"
   //          if (count >= 4) {
   //             isUpdated = true   
   //          }
   //          break

   //       case ".":
   //          nextState[seatInfo.idx] = "."
   //          break
   //       case "x":
   //          break
   //    }
      
   //    seatInfo = iter.next()
   // }      

   // return [isUpdated, nextState]
}

let nextState = performRound(rawSeats)
let cnt = 0
// while (nextState[0]) {
// nextState = performRound(nextState[1])
//    cnt++
// }

console.log(cnt)