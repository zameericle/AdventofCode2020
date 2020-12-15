const { nextTick } = require("process")

fs = require("fs")


let rawDirections = fs.readFileSync(process.env.INPUT_PATH, "utf8").split("\n")

function MakeDirectionsIterator(directionsInput) {
   let directions = [...directionsInput]
   let idx = 0
   let numDirections = directions.length
   const directionIterator = {      
      next: function() {
         let currentDir = directions[idx]

         let result = {
            done: idx >= numDirections,
            idx: idx >= numDirections ? -1 : idx,
            action: {
               cmd: currentDir !== undefined ? currentDir.match(/[NSEWLRF]/)[0] : "",
               value: currentDir !== undefined ? parseInt(directions[idx++].match(/\d+/)) : ""
            }
         }
         
         return result;
      },
   }

   return directionIterator
}

function MakeActionStateMachine() {
   let cmds = {
      N: (action, state) => {
         
         let newState = {...state}

         state.coord.N += action.value
         return newState
      },
      S: (action, state) => {
         
         let newState = {...state}

         newState.coord.N -= action.value
         return newState
      },
      E: (action, state) => {
         
         let newState = {...state}

         newState.coord.E += action.value
         return newState
      },
      W: (action, state) => {         
         
         let newState = {...state}

         newState.coord.E -= action.value
         return newState
      },
      L: (action, state) => {
         let rotations = {
            E: ["E", "N", "W", "S"],
            S: ["S", "E", "N", "W"],
            N: ["N", "W", "S", "E"],
            W: ["W", "S", "E", "N"]
         }

         let newState = {...state}
         newState.heading = rotations[state.heading][(action.value / 90) % 4]
         return newState
      },
      R: (action, state) => {
         let rotations = {
            E: ["E", "S", "W", "N"],
            S: ["S", "W", "N", "E"],
            N: ["N", "E", "S", "W"],
            W: ["W", "N", "E", "S"]
         }

         let newState = {...state}
         newState.heading = rotations[state.heading][(action.value / 90) % 4]
         return newState
      },
      F: (action, state) => {         
         let mult = 1
         switch (state.heading) {
            case "W":
               mult = -1
            case "E":
               state.coord.E += (action.value * mult)
               break;
            
            case "S":
               mult = -1
            case "N":
               state.coord.N += (action.value * mult)
               break;
         }
         
         let newState = {...state}
      }, 
   }
   
   const stateMachine = {
      execute: function(action, state) {
         newState = cmds[action.cmd](action, state)
         return newState
      }
   }

   return stateMachine
}

function MakeShip(actionStateMachine) {
   const ship  = {
      shipLog: [],
      currState: {
         heading: "E",
         coord: {
            E: 0,
            N: 0
         }  /* east-west, north-south */
      },   

      performAction: function(action) {
         let state = {...this.currState}
         this.shipLog.push(action)          
         let newState = actionStateMachine.execute(action, this.currState)
         Object.assign(this.currState, newState)
      },

      log() {
         return this.shipLog
      },
   }

   return ship
}


let itenaryIter = MakeDirectionsIterator(rawDirections)
let ship = MakeShip(MakeActionStateMachine())
let step = itenaryIter.next()

while(!step.done) {
   ship.performAction(step.action)
   step = itenaryIter.next()
}

let manhattanDistance =  Math.abs(ship.currState.coord.E) + Math.abs(ship.currState.coord.N)
console.log(ship)
console.log("Manhattan Distance: " + manhattanDistance)
