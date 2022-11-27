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


  function rerender(){
    linentryLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
    currentLine = linentry.currentLine
    say = say
  }
</script>

<div id='viewport'>
  <div id='spreadsheetContainer'>
    <SpreadSheet bind:linentry bind:linentryLines bind:currentLine/>
  </div>
  <div id='temp'>
    <button on:click={()=>{linentry.next(); rerender()}}>next line</button>
    <span>linentry says :</span>
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
    background-color: #ff0000;
  }
</style>