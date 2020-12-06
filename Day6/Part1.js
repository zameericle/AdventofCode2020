fs = require('fs');

var samples = []

let rawData = fs.readFileSync(process.env.INPUT_PATH, "utf8")
let groupResponses = rawData.split(/\n\n/).map((groupData) => {
   return groupData.split(/\n/).map((responseData) => {
      return responseData
   })
})

let resultSum = groupResponses.map((groupResponse) => {
   return groupResponse.reduce((acc, response) => {      
      response.split("").map((answer) => {
        return acc[answer] === undefined ? acc[answer] = 1 : acc[answer] += 1
      })
      return acc
   }, {})
}).map((response) => {
   return Object.keys(response).length //=
}).reduce((acc, val) => {
 return acc + val
}, 0)

resultSum //=