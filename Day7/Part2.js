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

let testData2 = [
   "shiny gold bags contain 2 dark red bags.",
   "dark red bags contain 2 dark orange bags.",
   "dark orange bags contain 2 dark yellow bags.",
   "dark yellow bags contain 2 dark green bags.",
   "dark green bags contain 2 dark blue bags.",
   "dark blue bags contain 2 dark violet bags.",
   "dark violet bags contain no other bags."   
]

fs = require('fs');

let rawData = fs.readFileSync(process.env.INPUT_PATH, "utf8")
let samples = rawData.split(/\n/)

/* all the bag info as a map */
let bags = samples.reduce((acc, sample) => {
   var bag = {}
   let match = sample.match(/(.*) bags contain (.*)\.$/) 
   
   let parent = match[1].trim()

   let bagContentsRaw = match[2].split(/bag[s]?[,.]?/)
   
   let bagContents = bagContentsRaw.filter((bagInfo) => {
      return (bagInfo === "" || bagInfo.match(/no other/)) ? false : true
   }).map((bagContent) => {
      var bag  = {}
      let match = bagContent.match(/(\d)+ (.*)$/) 
      // bag["name"] = match[2].trim()
      bag["name"] = match[2].trim()
      bag["max"] = parseInt(match[1])

      return bag
   })

   acc[parent] = bagContents
   return acc
}, {})

/* TODO: attempt to solve this without using recursion */
function countBags(bagName, bags) {
   return bags[bagName].reduce((acc, val) => {
      return acc + val.max + val.max * countBags(val.name, bags)
   }, 0)
}

let count = countBags("shiny gold", bags) 
console.log(count)

