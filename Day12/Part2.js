const { i, sqrt } = require("mathjs")

math = require("mathjs")

fs = require("fs")

let rawDirections = fs.readFileSync("/Users/zameericle/Development/AdventofCode2020/Day12/input.txt", "utf8").split("\n")

let noop = (action, state) => {         
   let newState = {...state}
   return newState
}

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

function MakeShipStateMachine() {
   let cmds = {
      F: (action, state) => {        
         let mult = 1
         let newState = {...state}

         newState.shipState.coord.E += (action.value * mult) * newState.waypointState.coord.E
         newState.shipState.coord.N += (action.value * mult) * newState.waypointState.coord.N
         
         return newState
      }, 
      L: noop,
      R: noop,
      N: noop,
      E: noop,
      W: noop,
      S: noop 
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

      performAction: function(action, state) {
         let stateCopy = {...state}
         this.shipLog.push(action)          
         return actionStateMachine.execute(action, stateCopy)
      },

      log() {
         return this.shipLog
      },
   }

   return ship
}

function MakeWaypointStateMachine() {
   let cmds = {
      N: (action, state) => {         
         let newState = {...state}

         newState.waypointState.coord.N += action.value
         return newState
      },
      S: (action, state) => {         
         let newState = {...state}

         newState.waypointState.coord.N -= action.value
         return newState
      },
      E: (action, state) => {         
         let newState = {...state}

         newState.waypointState.coord.E += action.value
         return newState
      },
      W: (action, state) => {         
         let newState = {...state}

         newState.waypointState.coord.E -= action.value
         return newState
      },
      L: (action, state) => {
         let newState = {...state}

         /* CCW Rotation around the ship */
         let rotations = {
            90: math.complex(0,1),
            180: math.complex(-1,0),
            270: math.complex(0,-1),            
            360: math.complex(1,0)
         }

         /* CCW Rotation around the ship */
         let cmplx = math.complex(newState.waypointState.coord.E, newState.waypointState.coord.N)

         let rotatedValue = math.multiply(cmplx, rotations[action.value])
         newState.waypointState.coord.E = rotatedValue.re
         newState.waypointState.coord.N = rotatedValue.im
         return newState
      },
      R: (action, state) => {
         let newState = {...state}

         let rotations = {
            90: math.complex(0,-1),            
            180: math.complex(-1,0),
            270: math.complex(0,1),
            360: math.complex(1,0)
         }

         /* CW Rotation around the ship */
         let cmplx = math.complex(newState.waypointState.coord.E, newState.waypointState.coord.N)

         let rotatedValue = math.multiply(cmplx, rotations[action.value])
         newState.waypointState.coord.E = rotatedValue.re
         newState.waypointState.coord.N = rotatedValue.im
         return newState
      },
      F: noop
   }
   
   const stateMachine = {
      execute: function(action, state) {
         newState = cmds[action.cmd](action, state)
         return newState
      }
   }

   return stateMachine
}

function MakeWaypoint(actionStateMachine) {
   const waypoint  = {
      waypointLog: [],

      performAction: function(action, state) {
         let stateCopy = {...state}
         this.waypointLog.push(action)          
         return actionStateMachine.execute(action, state)
      },

      log() {
         return this.shipLog
      },
   }

   return waypoint
}

let itenaryIter = MakeDirectionsIterator(rawDirections)
let ship = MakeShip(MakeShipStateMachine())
let waypoint = MakeWaypoint(MakeWaypointStateMachine())

let step = itenaryIter.next()
let state = {
   shipState: {
      heading: "E",
      coord: {
         E: 0,
         N: 0
      } 
   },
   waypointState: {
      /* relative to the ship */
      coord: {
         E: 10,
         N: 1
      }       
   }
}

while(!step.done) {
   state = {...ship.performAction(step.action, state)}
   state - {...waypoint.performAction(step.action, state)}
   step = itenaryIter.next()
}

let manhattanDistance =  Math.abs(state.shipState.coord.E) + Math.abs(state.shipState.coord.N)
console.log(state)
console.log("Manhattan Distance: " + manhattanDistance)
