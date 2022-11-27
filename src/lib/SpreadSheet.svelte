<script lang="ts">
  import { COMMANDS, Linentry, namesToCommands } from '$lib/linentry.js';
  import Entry from '$lib/Entry.svelte';

  export let linentry:Linentry
  export let linentryLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
  export let currentLine = linentry.src.main

  const height = 30

  let renderedLines = linentryLines
  let scrollY = 0
  let y = 0

  $: {
    renderedLines = []
    for(let i=0; i<8; i++){
      renderedLines.push(
        (y+i) in linentryLines ?
        linentryLines[y+i] :
        {command: COMMANDS.NOCOMMAND.name, data: []}
      )
    }
  }

  $: y = Math.max(0, Math.floor(-scrollY/height))
</script>

<table 
  on:wheel={(e)=>{
  // @ts-ignore
  scrollY += e.wheelDeltaY/10
  scrollY = scrollY>0?0:scrollY
  }}
  style='top: {scrollY%height}px'
>
  {#each renderedLines as i, ind}
    <Entry height={height} line={i}
      ind={ind+y} isMain={ind+y==linentry.src.main} isRunning={ind+y==currentLine}
      onCommandChanged={(index, str)=>{
        let commandToAdd = namesToCommands.has(str)?namesToCommands.get(str):COMMANDS.NOCOMMAND
        if(index in linentry.src.line){
          // @ts-ignore
          linentry.src.line[index].command = commandToAdd
        }
        else{
          for(let j=linentry.src.line.length; j<=index; j++){
            if(j===index){
              // @ts-ignore
              linentry.src.line.push({command: commandToAdd, data: []})
            }
            else{
              linentry.src.line.push({command: COMMANDS.NOCOMMAND, data: []})
            }
          }
        }
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