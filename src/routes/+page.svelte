<script lang="ts">
  import { COMMANDS, Linentry, receiver } from '$lib/linentry.js';

  let say = ''

  receiver.out = (s:string) => {
    say = s
  }

  let linentry = new Linentry({main: 0, line: [
    {command: COMMANDS.LOG, data: [1]},
    {command: COMMANDS.LOG, data: [2]},
    {command: COMMANDS.ON, data: [1, 0, 3]},
  ]})

  let renderedLines = linentry.src.line.map(v=>{ return {name: v.command.name, data: v.data} });
  function rerender(){
    renderedLines = linentry.src.line.map(v=>{ return {name: v.command.name, data: v.data} });
  }
</script>

<div id='viewport'>
  <div id='bruh'>
    {#each renderedLines as i}
      <span class='entry'>{i.name} operating on {i.data}</span>
    {/each}
  </div>
  <button on:click={()=>{linentry.next(); rerender()}}>next line</button>
  <span>linentry says : {say}</span>
</div>

<style>
  #viewport{
    width: 100vw;
    height: 100vh;
  }

  #bruh{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .entry{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    width: 100%;
    border: 2px solid rgb(11, 62, 7)  }
</style>