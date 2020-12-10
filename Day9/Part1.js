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

let rawData = fs.readFileSync(process.env.INPUT_PATH, "utf8")
let samples = rawData.split(/\n/)
preamble = 25

let iter = makeWindowedIterator(samples, preamble)
let result = iter.next()

while (!result.done) {
   let windowMap = result.window.reduce((map, entry) => {
      map[entry.toString()] = 1
      return map
   }, {})
   
   
   let info = Object.keys(windowMap).sort().reduce((val, entry) => {
      let diff = Math.abs(result.value - parseInt(entry))

      val.value = result.value
      if (!val.found && windowMap[diff] !== undefined) {
         val.found = true         
      }

      return val
   }, {value: undefined, found: false})

   if (!info.found) {
      console.log(info)
   }
   
   result = iter.next()
}