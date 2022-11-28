let receiver = {
  out : (s:string) => {
  console.log('default receiver : ' + s)
}}

const COMMANDS = {
  NOCOMMAND : {trigger: (data: number[], src:Source)=>{
    return {data: [], nextLine: -1}
  }, name: ''},

  SUM :       {trigger: (data: number[], src:Source)=>{
    return {data: [data.filter(v=>v).reduce((p, c)=>p+c)], nextLine: -1}
  }, name: 'SUM'},

  AVG :       {trigger: (data: number[], src:Source)=>{
    return {data: [data.filter(v=>v).reduce((p, c)=>p+c)/data.filter(v=>v).length], nextLine: -1}
  }, name: 'AVG'},

  PROD :   {trigger: (data: number[], src:Source)=>{
    return {data: [data.filter(v=>v).reduce((p, c)=>p*c, 1)], nextLine: -1}
  }, name: 'PROD'},

  COUNT :     {trigger: (data: number[], src:Source)=>{
    return {data: [data.filter(v=>!isNaN(v)).length], nextLine: -1}
  }, name: 'COUNT'},

  CARRY :     {trigger: (data: number[], src:Source)=>{
    return {data: [...data], nextLine: -1}
  }, name: 'CARRY'},

  MOD :       {trigger: (data: number[], src:Source)=>{
    return {data: [...data].slice(0, data.length-1).map(v=>v%data[data.length-1]), nextLine: -1}
  }, name: 'MOD'},

  MIN :       {trigger: (data: number[], src:Source)=>{
    return {data: [data.filter(v=>!isNaN(v)).reduce((p, c)=>Math.min(p, c))], nextLine: -1}
  }, name: 'MIN'},

  MAX :       {trigger: (data: number[], src:Source)=>{
    return {data: [data.filter(v=>!isNaN(v)).reduce((p, c)=>Math.max(p, c))], nextLine: -1}
  }, name: 'MAX'},

  PICK :      {trigger: (data: number[], src:Source)=>{
    return {data: [data[data.length-1] in data?data[data[data.length-1]]:NaN], nextLine: -1}
  }, name: 'PICK'},

  SECT :      {trigger: (data: number[], src:Source)=>{
    return {data: data.slice(data[data.length-2], data[data.length-1]), nextLine: -1}
  }, name: 'SECT'},

  INVERSE :   {trigger: (data: number[], src:Source)=>{
    return {data: data.map(v=>v===0?0:1/v), nextLine: -1}
  }, name: 'INVERSE'},

  SCALE :     {trigger: (data: number[], src:Source)=>{
    return {data: [...data].slice(0, data.length-1).map(v=>v*data[data.length-1]), nextLine: -1}
  }, name: 'SCALE'},

  POW :       {trigger: (data: number[], src:Source)=>{
    return {data: [...data].slice(0, data.length-1).map(v=>Math.pow(v, data[data.length-1])), nextLine: -1}
  }, name: 'POW'},

  LOG :       {trigger: (data: number[], src:Source)=>{
    receiver.out(data.toString().replaceAll('NaN', ' ').replaceAll(',', ', '))
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
    let check = !(0 in data) || isNaN(data[0]) || data[0]===0
    return {data: [], nextLine: check?data[2]:data[1]}
  }, name: 'ON'},
}

const namesToCommands = new Map([
  ['SUM', COMMANDS.SUM],
  ['AVG', COMMANDS.AVG],
  ['PROD', COMMANDS.PROD],
  ['COUNT', COMMANDS.COUNT],
  ['MIN', COMMANDS.MIN],
  ['MAX', COMMANDS.MAX],
  ['PICK', COMMANDS.PICK],
  ['SECT', COMMANDS.SECT],
  ['INVERSE', COMMANDS.INVERSE],
  ['SCALE', COMMANDS.SCALE],
  ['POW', COMMANDS.POW],
  ['CARRY', COMMANDS.CARRY],
  ['MOD', COMMANDS.MOD],
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