<script lang="ts">
  import { COMMANDS, Linentry, namesToCommands } from '$lib/linentry.js';
  import Entry from '$lib/Entry.svelte';
  import Matrix from './Matrix.svelte';

  export let linentry:Linentry
  export let linentryLines = linentry.src.line.map(v=>{ return {command: v.command.name, data: v.data} })
  export let currentLine = linentry.src.main
  export let update = ()=>{}

  const height = 30
  const width = 30

  let renderedLines = linentryLines
  let scrolling = false
  let scrollX = 0
  let scrollY = 0
  let x = 0
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

  $: scrollY = scrollY>0?0:scrollY
  $: scrollX = scrollX>0?0:scrollX
  $: y = Math.max(0, Math.floor(-scrollY/height))
  $: x = Math.max(0, Math.floor(-scrollX/width))
</script>

<svelte:window 
  on:mouseup={(e)=>{
    if(e.button==1){
      scrolling = false
    }
  }}
  on:mousemove={(e)=>{
    if(scrolling){
      scrollX += e.movementX
      scrollY += e.movementY
    }
  }}/>
<div id='wrap'
  on:wheel={(e)=>{
  // @ts-ignore
    scrollY += e.wheelDeltaY/10;
  }}
  style='top: {scrollY%height}px'>
  <table id='entries'>
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
          update()
        }}
        onMainChanged={(index)=>{
          linentry.src.main = index
          update()
        }}
      />
    {/each}
  </table>
  <table id='matrix'
    on:wheel={(e)=>{
    // @ts-ignore
      scrollX += e.wheelDeltaX/10
    }}
    on:mousedown={(e)=>{
      if(e.button==1){
        scrolling = true
      }
    }}
    style='left: {scrollX%width}px'
  >
    {#each renderedLines as i, ind}
      <Matrix height={height} width={width} line={i} ind={ind+y} coord={x}
        onDataChanged={(row, column, data)=>{
          if(row in linentry.src.line){
            if(column in linentry.src.line[row].data){
              linentry.src.line[row].data[column] = data
            }
            else{
              for(let j = linentry.src.line[row].data.length; j<=column; j++) {
                linentry.src.line[row].data.push(
                  j===column?
                  data:
                  NaN
                )
              }
            }
          }
          else{
            for(let j=linentry.src.line.length; j<=row; j++){
              if(j===row){
                linentry.src.line.push({command: COMMANDS.NOCOMMAND, 
                  data: Array(row+1).fill(0).map((v, k)=>k===row?data:NaN)
                })
              }
              else{
                linentry.src.line.push({command: COMMANDS.NOCOMMAND, data: []})
              }
            }
          }
          update()
        }}
      />
    {/each}
  </table>
</div>

<style>
  #wrap{
    z-index: -1;
    position: relative;
    display: flex;
  }
  #entries{
    position: relative;
  }
  #matrix{
    position: relative;
  }
</style>