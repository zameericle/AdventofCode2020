fs = require('fs');

var passports = []

data = fs.readFileSync("/Users/zameericle/Desktop/AdventCode/day4_input.txt", "utf8")
data.split(/\n\n/).forEach((rawPassport) => {
   var passport = {}
   rawPassport.split(/\s|\n/).forEach((passportEntry) => {
      entry = passportEntry.split(/:/) 
      passport[entry[0]] = entry[1].trim()
   })
   passports.push(passport)
})

var mandatoryKeys = [
   ["byr", (val) => {
      let intVal = parseInt(val)  
      return ((intVal >= 1920) && (intVal <= 2002))
   }],
   ["iyr", (val) => {
      let intVal = parseInt(val) 
      return ((intVal >= 2010) && (intVal <= 2020))
   }],
   ["eyr", (val) => {
      let intVal = parseInt(val) 
      return ((intVal >= 2020) && (intVal <= 2030)) 
   }],
   ["hgt", (val) => {
      var isValid = false
      let re = /(\d+)(cm|in)/
      let match = val.match(re) 

      if (match !== null) {
         let height = parseInt(match[1]) 
         match[2] 
         switch(match[2]) {
            case "cm":
               isValid = (height >= 150 && height <= 193)
               break
            case "in":
               isValid = (height >= 59 && height <= 76)
               break
            default:
               isValid = false
               break
         }
      } 
      
      return isValid
   }],
   ["hcl", (val) => {
      if (val.length != 7) {
         return false
      }

      let re = /#[0-9a-f]{6}/
      let match = val.match(re) 

      return match !== null 
   }],
   ["ecl", (val) => {
      let re = /amb|blu|brn|gry|grn|hzl|oth/
      let match = val.match(re) 

      return match !== null
   }],
   ["pid", (val) => {
      let re = /^\d{9}$/
      let match = val.match(re) 
      return match !== null 
   }]];

passports.map((passport, idx) => { //=
   
   //compare remaining with mandatory set
   valid = mandatoryKeys.map((key) => {
      return (passport[key[0]] !== undefined) ? key[1](passport[key[0]]) : false 
   }) 
   
   valid = valid.reduce((acc, val) => {
      return acc && val
   }, true) 
   
   return valid 
}).filter((val) => {
   return val
}).length //=