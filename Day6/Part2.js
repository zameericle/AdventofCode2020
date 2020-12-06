fs = require('fs');

var samples = []

let rawData = fs.readFileSync(process.env.INPUT_DATA, "utf8")
let groupResponses = rawData.split(/\n\n/).map((groupData) => {
   return groupData.split(/\n/).map((responseData) => {
      return responseData
   })
})

let resultSum = groupResponses.map((groupResponse) => {
   let responses = groupResponse.reduce((acc, response) => {      
      response.split("").map((answer) => {
        return acc[answer] === undefined ? acc[answer] = 1 : acc[answer] += 1
      })
      return acc
   }, {})

   return [groupResponse.length,responses]
})
.map((val) => {
   /* I hate this -- there must be a better way to do this */
   var filteredResponse = []
   Object.keys(val[1]).forEach((key) => {
      if (val[1][key] === val[0]) {
         filteredResponse[key] = val[1][key]
      }
   })

   return Object.keys(filteredResponse).length
}) 
.reduce((acc, val) => {
   return acc + val
}, 0)

resultSum //=