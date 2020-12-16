let depTime = 1000510
let schedule = "19,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17,13,x,x,x,x,x,x,x,x,x,x,29,x,853,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23"

let busIds = schedule.match(/\d+/g).map((val) => {
   return parseInt(val)
})

let earliestDeparture = busIds.reduce((acc, busId) => {
   
   let time = busId - (depTime % busId)
   
   if (time < acc.depTime) {
      acc.depTime = time
      acc.busId = busId
   }
   return acc
}, {busId: undefined, depTime: Number.MAX_SAFE_INTEGER})

console.log(earliestDeparture)


