function MakeMemoryAddressSpace() {
   const memory = {
      addrMem: {},
      activeMask: {
         orBitMask: BigInt(68719476735),
         andBitMask: BigInt(68719476735),
      },
      setMask: function(mask) {
         if (mask.length != 36)
            console.error("INVALID MASK")

         //andBitMask (pass through & set to 0)
         // 0 & X(1) == 0
         // 1 & X(1) == 1
         // 0 & 0 == 0
         // 1 & 0 == 0

         //orBitMask (pass through & set to 1)         
         // 0 | X(0) == 0
         // 1 | X(0) == 1
         // 1 | 1 == 1
         // 0 | 1 == 1
         this.activeMask = {
            orBitMask: BigInt(68719476735),
            andBitMask: BigInt(68719476735),
         }

         this.activeMask = mask.split("").reverse().reduce((mask, val, idx) => {
            switch (val) {
               case '0':
                  mask.andBitMask = mask.andBitMask & ~(BigInt(1) << BigInt(idx))
                  mask.orBitMask = mask.orBitMask & ~(BigInt(1) << BigInt(idx))
                  break

               case 'X':
                  mask.orBitMask = mask.orBitMask & ~(BigInt(1) << BigInt(idx))
                  break
            }         

            return mask
         }, this.activeMask)
      },
      getMask: function(mask) {
         return this.activeMask
      },
      writeAddress: function(loc, data) {
         let val = typeof data !== BigInt ? BigInt(data) : data

         val &= this.activeMask.andBitMask
         val |= this.activeMask.orBitMask

         this.addrMem[loc] = val
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
