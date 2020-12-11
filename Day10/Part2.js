function parse(input) {
   return input
     .split("\n")
     .map((x) => x.trim())
     .map((x) => parseInt(x))
     .filter((x) => x);
 }
 
 // See, I knew this problem wasn't about programming, but math :/
 // https://brilliant.org/wiki/tribonacci-sequence/
 const tribonacciSequence = [1, 1, 2, 4, 7, 13, 24, 44, 81, 149];
 function getTribonacci(num) {
   if (num > tribonacciSequence.length)
     throw `Can't calculate tribonacci number for ${num}`;
 
   return tribonacciSequence[num - 1];
 }
 
 function solvePartB(adapters) {
   const maxJoltage = adapters.sort((x, y) => x - y)[adapters.length - 1];
   const a = adapters.concat([0, maxJoltage + 3]).sort((x, y) => x - y);
 
   let multiplier = 1;
   let currentRun = 1;
   for (let joltage of a) {
     if (adapters.includes(joltage + 1)) {
       currentRun++;
     } else {
       multiplier *= getTribonacci(currentRun);
       currentRun = 1;
     }
   }
   return multiplier;
 }

let fs = require("fs");
let realData = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day10/input.txt", "utf8");

// Arrange
const adapters = parse(realData);

// Act
const result = solvePartB(adapters);

console.log(result) 
