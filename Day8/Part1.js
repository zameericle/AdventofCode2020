fs = require('fs');

class AOCCompiler {
   constructor() {

   }

   compile(program) {
      var instructions = program.split(/\n/).map((stmt, idx) => {
         let parsedStmt = stmt.match(/^(\w*) ([\+\-]\d*)*$/)
         return {
            lineNo: idx,
            command: parsedStmt[1],
            param: parseInt(parsedStmt[2])
         }
      })

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
      while((state.index != -1) && this.debugger(state))
   }
}

let visitedState = {}
function logger(state) {
   let key = state.index.toString()
   if (visitedState[key] === undefined) {
      visitedState[key] = state.acc
      return true
   } else {
      console.log(state)
      return false
   }


}

var testProgram = 
"nop +0\nacc +1\njmp +4\nacc +3\njmp -3\nacc -99\nacc +1\njmp -4\nacc +6" 

let program = fs.readFileSync(process.env.INPUT_PATH, "utf8")

new AOCCompiler().compile(program).attachDebugger(logger).run()
