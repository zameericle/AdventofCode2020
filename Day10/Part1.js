
fs = require('fs');

function incOrder(a,b) {
   return a - b
}

let rawData = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day10/input.txt", "utf8")
let adapters = rawData.split(/\n/)
   .map((el) => {
      return parseInt(el)
   })
   .sort(incOrder)

//push the charger 
adapters.push(adapters[adapters.length-1] + 3)

let effectiveRating = 0

let differences = adapters.reduce((acc, adapter) => {
   let diff = adapter - effectiveRating
   effectiveRating = adapter
   acc[diff-1]++
   
   return acc
},[0,0,0])

console.log(differences)
console.log(differences[0] * differences[2])