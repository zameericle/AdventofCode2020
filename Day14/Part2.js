function MakeMemoryAddressSpace() {
   const memory = {
      addrMem: {},
      activeMask: "",
      setMask: function(mask) {
         this.activeMask = mask
      },
      getMask: function(mask) {
         return this.activeMask
      },
      writeAddress: function(loc, data) {

         function calculateAddrLocations(mask, loc) {
            let floatingBitsIdx = []
            mask.split("").reverse().forEach((bit, idx) => {
               switch (bit) {
                  case '1':
                     // overwrite to 1
                     loc |= (BigInt(1n) << BigInt(idx))
                     break
                  case 'X':
                     floatingBitsIdx.push(BigInt(idx))
                     break
               }
            })
            
            let locations = [loc]
            
            floatingBitsIdx.forEach((idx) => {
               locations = locations.map((_loc) => {
                  return [
                      _loc | (BigInt(1n) << BigInt(idx)),
                      _loc & ~(BigInt(1n) << BigInt(idx))
                   ]
                }).flat()
            })

            return locations
         }
         

         let val = typeof data !== BigInt ? BigInt(data) : data
         
         let addrLocs = calculateAddrLocations(this.activeMask, loc)
         
         addrLocs.forEach((loc) => {
            this.addrMem[loc] = val
         })                  
      },
      readAddress: function(loc) {
         return this.addrMem[loc]
      }
   }

   return memory
}

fs = require("fs")

// parse the program
let program = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day14/input.txt", "utf8").split("\n").map((cmd) => {
   let parsedCmd = cmd.split(/(mask) = (.*$)|(mem)\[(\d+)\] = (\d+$)/)
   if (parsedCmd[1] === "mask") {
      return {
         cmd: "mask",
         data: parsedCmd[2]
      }
   } else if (parsedCmd[3] === "mem") {
      return {
         cmd: "mem",
         loc: BigInt(parsedCmd[4]),
         data: BigInt(parsedCmd[5])
      }
   }
})

let memory = MakeMemoryAddressSpace()

//run the program
let cnt = 1
program.forEach((instr) => {
   switch (instr.cmd) {
      case "mask" : {
         memory.setMask(instr.data)
         break
      }

      case "mem" : {
         memory.writeAddress(instr.loc, instr.data)
         break
      }
   }

})

let sum = Object.keys(memory.addrMem).reduce((acc, key) => {
   let val = memory.readAddress(key)
   return acc + val
}, BigInt(0n))

console.log("SUM:" + sum)
