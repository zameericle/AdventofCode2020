let testData = [
   "light red bags contain 1 bright white bag, 2 muted yellow bags.",
   "dark orange bags contain 3 bright white bags, 4 muted yellow bags.",
   "bright white bags contain 1 shiny gold bag.",
   "muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.",
   "shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.",
   "dark olive bags contain 3 faded blue bags, 4 dotted black bags.",
   "vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.",
   "faded blue bags contain no other bags.",
   "dotted black bags contain no other bags."
]

fs = require('fs');

let rawData = fs.readFileSync(process.env.INPUT_PATH, "utf8")
let samples = rawData.split(/\n/)

/* all the bag info */
let bags = samples.map((sample) => {
   var bag = {}
   let match = sample.match(/(.*) bags contain (.*)\.$/) 
   
   let parent = match[1]
   bag["name"] = match[1].trim()
   let bagContentsRaw = match[2].split(/bag[s]?[,.]?/)
   
   let bagContents = bagContentsRaw.filter((bagInfo) => {
      return (bagInfo === "" || bagInfo.match(/no other/)) ? false : true
   }).map((bagContent) => {
      var bag  = {}
      let match = bagContent.match(/(\d)+ (.*)$/) 
      bag["name"] = match[2].trim()
      bag["max"] = match[1]
      return bag
   })

   bag["contains"] = bagContents
   return bag
})

/* walk the bags structure and build a structure that maps child to parent */
let childParentRelationships = bags.reduce((acc, bag) => {
   let bagName = bag["name"]
   
   bag["contains"].forEach((bag) => {
      acc[bag["name"]] === undefined ? acc[bag["name"]] = [bagName] : acc[bag["name"]].push(bagName)
   })
   return acc
},{})

/* start with the bagName in the list and then start walking capturing all visted nodes */
function parentsOf(bagName, list) {
   /* walk the list until you find that there is no more parents */
   var queue = []
   var visited = []
   queue = list[bagName] 
   
   var length = queue.length
   var i = 0
   while (queue.length > 0) {
      let bagName = queue.pop()
      visited[bagName] = (visited[bagName] === undefined) ? 1 : ++visited[bagName]

      if (list[bagName] !== undefined) {
         list[bagName].forEach((bag) => {
            queue.push(bag)
         })
      }
   }   

   return visited
}

let parents = parentsOf("shiny gold", childParentRelationships) 
console.log(Object.keys(parents).length)

