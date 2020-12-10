function makeWindowedIterator(inputData = [], windowSize = -1, step = 1) {
   let data = [...inputData]
   let nextIndex = windowSize
   let nextWindow = data.splice(0, windowSize)
   let nextValue =  data[0]

   const windowedIterator = {
      next: function() {
         let result
      
         result = {
            window: [...nextWindow],
            value: nextValue,
            done: (data.length === 0) ? true : false
         }

         nextWindow.shift()
         nextWindow.push(data.shift())
         nextValue =  data[0]

         return result
      }
   }

   return windowedIterator
}

fs = require('fs');

let testData = [35, 20, 15, 25, 47, 40, 62, 55, 65, 95, 102, 117, 150, 182, 127, 219, 299, 277, 309, 576]
let preamble = 5

let rawData = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day9/input.txt", "utf8")
let samples = rawData.split(/\n/)
samples = samples.map((e) => {
   return parseInt(e)
})

preamble = 25

let iter = makeWindowedIterator(samples, preamble)
let result = iter.next()
var info = {value: undefined, found: false}

while (!result.done) {
   let windowMap = result.window.reduce((map, entry) => {
      map[entry.toString()] = 1
      return map
   }, {})
   
   
   info = Object.keys(windowMap).sort().reduce((val, entry) => {
      let diff = Math.abs(result.value - parseInt(entry))

      val.value = result.value
      if (!val.found && windowMap[diff] !== undefined) {
         val.found = true         
      }

      return val
   }, {value: undefined, found: false})

   if (!info.found) {
      break
   }

   result = iter.next()
}

if (!info.found) {   

   let result = samples.reduce((ctx, val) => {
      if (ctx.found === true) { return ctx }
      ctx.seq.push(val)

      let sum = 0
      do {
         sum = ctx.seq.reduce((sum, val) => {
            sum += val
            return sum
         }, 0)
         if (sum > info.value) {
            ctx.seq.splice(0,1)
         }
      } while (sum > info.value)

      if (sum === info.value) {
         ctx.found = true
      }

      return ctx
   },{seq: [], found: false})

   let resultSum = result.seq.reduce((acc, val) => {
      acc += val
      return acc
   }, 0)
 
   if (resultSum !== info.value) {
      console.log("ERROR")
   }

   let sortedResult = result.seq.sort()
   console.log(sortedResult[0] + sortedResult[sortedResult.length-1])
}

   
