let receiver = {
  out : (s:string) => {
  console.log('default receiver : ' + s)
}}

const COMMANDS = {
  NOCOMMAND : {trigger: (data: number[], src:Source)=>{
    return {data: [], nextLine: -1}
  }, name: ''},

  SUM :       {trigger: (data: number[], src:Source)=>{
    return {data: [data.reduce((p, c)=>p+c)], nextLine: -1}
  }, name: 'SUM'},

  LOG :       {trigger: (data: number[], src:Source)=>{
    receiver.out(data.toString())
    return {data: [], nextLine: -1}
  }, name: 'LOG'},

  ECHO :      {trigger: (data: number[], src:Source)=>{
    receiver.out(data.map(v=>String.fromCharCode(Math.floor(v))).reduce((p, c)=>p+c))
    return {data: [], nextLine: -1}
  }, name: 'ECHO'},

  READ :      {trigger: (data: number[], src:Source)=>{
    return {data: 
      (Math.floor(data[0]) in src.line)?src.line[Math.floor(data[0])].data:[], 
    nextLine: -1}
  }, name: 'READ'},

  WRITE :     {trigger: (data: number[], src:Source)=>{
    src.line[data[data.length-1]].data = data.slice(0, data.length-1)
    return {data: [], nextLine: -1}
  }, name: 'WRITE'},

  ON :        {trigger: (data: number[], src:Source)=>{
    return {data: [], nextLine: data[0]!==0?data[1]:data[2]}
  }, name: 'ON'},
}

const namesToCommands = new Map([
  ['SUM', COMMANDS.SUM],
  ['LOG', COMMANDS.LOG],
  ['ECHO', COMMANDS.ECHO],
  ['READ', COMMANDS.READ],
  ['WRITE', COMMANDS.WRITE],
  ['ON', COMMANDS.ON],
])

interface Line{
  command : Command,
  data : number[],
}

interface RenderedLine{
  command : string,
  data : number[]
}

interface Source{
  main : number,
  line : Line[],
}

interface Result{
  data : number[],
  nextLine : number
}

interface Command{
  trigger: (data: number[], src:Source) => Result;
  name: string
}

class Linentry{
  src:Source
  currentLine:number = 0
  carry:number[] = []

  constructor(src:Source){
    this.src = src
    this.currentLine = src.main
  }

  getCommand(){
    return (this.currentLine in this.src.line)?this.src.line[this.currentLine].command:COMMANDS.NOCOMMAND
  }

  getData(){
    return (this.currentLine in this.src.line)?this.src.line[this.currentLine].data:[]
  }

  next(){
    let result = this.getCommand().trigger(
      this.carry.concat(this.getData()),
      this.src
    )
    this.carry = result.data
    this.currentLine = result.nextLine==-1?this.currentLine+1:result.nextLine
  }
}

export {COMMANDS, namesToCommands, type RenderedLine, Linentry, receiver}