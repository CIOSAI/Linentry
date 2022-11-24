<script lang="ts">
  import { COMMANDS, Linentry, receiver } from '$lib/linentry.js';

  let say = ''

  receiver.out = (s:string) => {
    say = s
  }

  let linentry = new Linentry({main: 0, line: [
    {command: COMMANDS.SUM, data: [1, 2, 3, 4, 5]},
    {command: COMMANDS.LOG, data: []},
  ]})
</script>

<div id='viewport'>
  <div id='bruh'>
    {#each linentry.src.line as i}
      <span class='entry'>{i.command.name} operating on {i.data}</span>
    {/each}
  </div>
  <button on:click={()=>{linentry.next()}}>next line</button>
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