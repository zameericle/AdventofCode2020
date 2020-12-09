fs = require('fs');

class AOCCompiler {
   constructor() {

   }

   compile(program, postProcessor) {
      var instructions = program.split(/\n/).map((stmt, idx) => {
         let parsedStmt = stmt.match(/^(\w*) ([\+\-]\d*)*$/)

         return {
            lineNo: idx+1,
            command: parsedStmt[1],
            param: parseInt(parsedStmt[2])
         }
      })

      instructions = postProcessor(instructions)
      return new AOCProgram(instructions)
   }
}

class AOCExecutor {
   commands = {
      nop: (param, state) => {
         let newState = Object.assign({}, state)
         newState.index++
         return newState
      },
      acc: (param, state) => {
         let newState = Object.assign({}, state)
         newState.acc += param
         newState.index++
         return newState
      },
      jmp: (param, state) => {
         let newState = Object.assign({}, state)
         newState.index += param
         return newState
      }
   }

   constructor(program) {
      this.state = {
         instructions: program,
         index: 0,
         acc: 0
      }      
   }

   execute() {
      let oldState = Object.assign({}, this.state)
      let instr = this.state.instructions[this.state.index]
      this.state = (instr !== undefined) ? this.commands[instr.command](instr.param, this.state) : Object.assign(this.state, {index: -1})
      return Object.assign({}, oldState)
   }
}

class AOCProgram {
   constructor(program) {
      this.debugger = () => {}
      this.program = program
   }

   attachDebugger(debug) {
      this.debugger = debug
      return this
   }

   run() {
      let executor = new AOCExecutor(this.program)

      var state = {}
      do {
         state = executor.execute() //start         
      }
      while(this.debugger(state) && (state.index != -1))
   }
}


var instructionIdx = 0
var visitedState = {}
var instructionOrder = []
var done = false

function logger(state) {
   
   if(state.index === -1) {
      console.log("#### DONE ####")
      console.log(state)
      done = true
      return false
   }

   let key = state.index.toString()
   if (visitedState[key] === undefined) {
      visitedState[key] = state.instructions[state.index]
      instructionOrder.push(state.instructions[state.index])
      return true
   } else {
      console.log("#### LOOP FOUND ###")
      console.log(instructionOrder)
      console.log(state.instructions[state.index])
      return false
   }
}

function postProcessor(instructions) {

   while (instructionIdx < instructions.length) {
      if (instructions[instructionIdx].command === "nop") {
         instructions[instructionIdx].command = "jmp"
         instructionIdx++
         break
      } else if (instructions[instructionIdx].command == "jmp") {
         instructions[instructionIdx].command = "nop"
         instructionIdx++
         break
      }

      instructionIdx++
   }

   return instructions
}

var testProgram = 
"nop +0\nacc +1\njmp +4\nacc +3\njmp -3\nacc -99\nacc +1\njmp -4\nacc +6" 


let program = fs.readFileSync(process.env.INPUT_PATH", "utf8")

while(!done) {
   visitedState = {}
   instructionOrder = []
   new AOCCompiler().compile(program,postProcessor).attachDebugger(logger).run()
}
