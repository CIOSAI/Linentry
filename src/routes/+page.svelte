<script lang="ts">
  import { COMMANDS, Linentry, receiver } from '$lib/linentry.js';
  import SpreadSheet from "$lib/SpreadSheet.svelte";
  
  let say:string[] = []
  receiver.out = (s:string) => {
    say.push(s)
  }

  let linentry = new Linentry({main: 1, line: [
    {command: COMMANDS.NOCOMMAND, data: [0]},
    {command: COMMANDS.READ, data: [0]},
    {command: COMMANDS.ON, data: [3, 5]},
    {command: COMMANDS.LOG, data: [1]},
    {command: COMMANDS.ON, data: [1, 3, 5]},
    {command: COMMANDS.LOG, data: [0]},
  ]})

  let linentryLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
  let currentLine = linentry.src.main
  let playing = false
  let intervalHash:NodeJS.Timer

  function rerender(){
    linentry.src.line = linentry.src.line.map(v=>{
      let cleansed:number[] = []
      v.data.forEach((elm2, ind2)=>{if(v.data.slice(ind2).some((elm3)=>!isNaN(elm3))) cleansed.push(elm2)})
      return {command: v.command, data: cleansed}
    })
    linentryLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
    currentLine = linentry.currentLine
    say = say
  }

  function clearConsole(){
    say = []
  }

  function next(){
    linentry.next()
    rerender()
  }
</script>

<div id='viewport'>
  <div id='spreadsheetContainer'>
    <SpreadSheet bind:linentry bind:linentryLines bind:currentLine update={rerender}/>
  </div>
  <div id='temp'>
    <button on:click={next}>next line</button>
    {#if playing}
      <button on:click={()=>{clearInterval(intervalHash); playing = false}}>pause</button>
    {:else}
      <button on:click={()=>{intervalHash = setInterval(next, 1000); playing = true}}>auto play</button>
    {/if}
    <button on:click={()=>{linentry = new Linentry(linentry.src); rerender(); clearConsole()}}>reset</button>
    <span>from last line: {linentry.carry}</span>
    <div class='messages'>
      {#each say as i}
        <p>{i}</p>
      {/each}
    </div>
  </div>
</div>

<style>
  #viewport{
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
  }

  #spreadsheetContainer{
    position: relative;
    z-index: inherit;
    height: 30%;
    padding: 2em;
  }

  #temp{
    position: relative;
    z-index: inherit;
  }
</style>