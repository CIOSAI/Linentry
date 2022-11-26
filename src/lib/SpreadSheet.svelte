<script lang="ts">
  import { COMMANDS, Linentry, namesToCommands } from '$lib/linentry.js';
  import Entry from '$lib/Entry.svelte';

  export let linentry:Linentry
  export let renderedLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
  export let currentLine = linentry.src.main

  let scrollY = 0;
</script>

<table 
  on:wheel={(e)=>{
  // @ts-ignore
  scrollY += e.wheelDeltaY
  }}
  style='top: {scrollY/10}px'
>
  {#each renderedLines as i, ind}
    <Entry line={i} ind={ind} isMain={ind==linentry.src.main} isRunning={ind==currentLine}
      onCommandChanged={(index, str)=>{
        // @ts-ignore
        linentry.src.line[index].command = namesToCommands.has(str)?namesToCommands.get(str):COMMANDS.NOCOMMAND
      }}
    />
  {/each}
</table>

<style>
  table{
    z-index: -1;
    position: absolute;
  }
</style>