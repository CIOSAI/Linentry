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
      (Math.floor(data[0]) in src.data)?src.data[Math.floor(data[0])]:[], 
    nextLine: -1}
  }, name: 'READ'},

  WRITE :     {trigger: (data: number[], src:Source)=>{
    src.data[data[data.length-1]] = data.slice(0, data.length-1)
    return {data: [], nextLine: -1}
  }, name: 'WRITE'},

  ON :        {trigger: (data: number[], src:Source)=>{
    return {data: [], nextLine: data[0]!==0?data[1]:data[2]}
  }, name: 'ON'},
}

interface Source{
  main : number,
  commands : Command[],
  data : number[][],
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
    return (this.currentLine in this.src.commands)?this.src.commands[this.currentLine]:COMMANDS.NOCOMMAND
  }

  getData(){
    return (this.currentLine in this.src.data)?this.src.data[this.currentLine]:[]
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

export {COMMANDS, Linentry, receiver}