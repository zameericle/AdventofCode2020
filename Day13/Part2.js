let schedule = "19,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,523,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,17,13,x,x,x,x,x,x,x,x,x,x,29,x,853,x,x,x,x,x,37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,23"
// let schedule = "7,13,x,x,59,x,31,19"
/* Each bus can be represented as follows: 
 * X % BusId = R
 * for example: X % 41 = 32 
 * 
 * Now it should be a matter of applying the chinese remainder theorem to solve for X:
 * https://en.wikipedia.org/wiki/Chinese_remainder_theorem 
 * 
 * and referred to https://stackoverflow.com/questions/65275951/implementing-chinese-remainder-theorem-in-javascript
 * for how to implement CRT
 */
let crtInput = schedule.match(/\d+|x/g)
.map((val,idx) => {
   let result = {}
   if (val === "x") {
      return undefined
   } else {
      result.val = parseInt(val)
      result.timeOffset = idx
   }
   
   return result
})
.filter((val) => {
   return val !== undefined
})
.map((busInfo,idx) => {
   return {
      module: BigInt(busInfo.val),
      /* busses need to leave t + timeOffset */
      remainder: (idx === 0) ? BigInt(0) : BigInt(busInfo.val - busInfo.timeOffset)
   }
})

console.log(crtInput.length)
console.log(crtInput)
const modularMultiplicativeInverse = (a, modulus) => {
   // Calculate current value of a mod modulus
   const b = BigInt(a % modulus);
     
     // We brute force the search for the smaller hipothesis, 
     // as we know that the number must exist between the current given modulus and 1
     for (let hipothesis = 1n; hipothesis <= modulus; hipothesis++) {
         if ((b * hipothesis) % modulus == 1n) return hipothesis;
     }
       // If we do not find it, we return 1
     return 1n;
 }

function CRT(input) {
   product = input.reduce((acc, el) => {
      return acc * el.module
   }, 1n)

   let X = input.reduce((acc, entry, idx) => {
      let partialProduct = product / entry.module
      return acc + (input[idx].remainder * modularMultiplicativeInverse(partialProduct, entry.module) * partialProduct)
   }, 0n) % product


   return X
}

let X = CRT(crtInput);

console.log("X: " + X)