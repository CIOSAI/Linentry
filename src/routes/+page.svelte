<script lang="ts">
  import { COMMANDS, Linentry, receiver } from '$lib/linentry.js';
  import Entry from '$lib/Entry.svelte';

  let say:string[] = []

  receiver.out = (s:string) => {
    say.push(s)
  }

  let linentry = new Linentry({main: 1, line: [
    {command: COMMANDS.NOCOMMAND, data: []},
    {command: COMMANDS.WRITE, data: [1, 0]},
    {command: COMMANDS.WRITE, data: [2, 0]},
    {command: COMMANDS.ON, data: [1, 1, 4]},
  ]})

  let renderedLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
  let currentLine = linentry.src.main
  
  function rerender(){
    renderedLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
    currentLine = linentry.currentLine
    say = say
  }
</script>

<div id='viewport'>
  <table class='table'>
    {#each renderedLines as i, ind}
      <Entry line={i} isMain={ind==linentry.src.main} isRunning={ind==currentLine}/>
    {/each}
  </table>
  <button on:click={()=>{linentry.next(); rerender()}}>next line</button>
  <span>linentry says :</span>
  <div class='messages'>
    {#each say as i}
      <p>{i}</p>
    {/each}
  </div>
</div>

<style>
  #viewport{
    width: 100vw;
    height: 100vh;
  }
</style>