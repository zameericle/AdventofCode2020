fs = require('fs');

var samples = []

data = fs.readFileSync(process.env.INPUT_PATH, "utf8")
data.split(/\n/).forEach((data) => {
   samples.push(data)
})

//I saw later that one could convert FB and LR to binary using the following mappings:
// F = 0
// B = 1
// L = 0
// R = 1

function calculateRow(rowSpecifier) {
   let row = rowSpecifier.split("").reduce((acc, next) => {
      switch (next) {
         case "F":
            return [acc[0], acc[0] + acc[1] >> 1] 
            break
         case "B":            
            return [(acc[0] + acc[1] >> 1) + 1, acc[1]]
            break
      }

   }, [0,127])

   return row[0]
}

function calculateCol(colSpecifier) {
   let col = colSpecifier.split("").reduce((acc, next) => {
      switch (next) {
         case "L":
            return [acc[0], acc[0] + acc[1] >> 1] 
            break
         case "R":            
            return [(acc[0] + acc[1] >> 1) + 1, acc[1]]
            break
      }

   }, [0,7])

   return col[0]  
}

samples.map((sample) => {
   let re  = /^([F|B]{7})([L|R]{3})/
   let match = sample.match(re)
   return [calculateRow(match[1]), calculateCol(match[2])]
})
.map((seat) => {
   return seat[0] * 8 + seat[1] 
})
.reduce((acc, val) => {
   return (acc > val) ? acc : val
}, 0) //=