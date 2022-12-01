<script lang="ts">
  import { COMMANDS, Linentry, namesToCommands, type RenderedLine } from '$lib/linentry.js';
  import Entry from '$lib/Entry.svelte';
  import Matrix from '$lib/Matrix.svelte';
	import SelectArea from '$lib/SelectArea.svelte';
	import { onMount } from 'svelte';

  export let linentry:Linentry
  export let linentryLines:RenderedLine[]
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
  let matrixHead = Array(16).fill(0).map((v, ind)=>ind)
  let domEntryHead:undefined|HTMLElement
  let selectAreaOffsets = {leftExtend1: 0, leftExtend2: 0, topExtend: 0}
  let selectFrom = {x: 0, y: 0}
  let selectTo = {x: 0, y: 0}
  let dragFrom = {x: 0, y: 0}
  let dragTo = {x: 0, y: 0}
  let selecting = false

  onMount(()=>{
    selectAreaOffsets.leftExtend1 = width
    selectAreaOffsets.leftExtend2 = domEntryHead?.getBoundingClientRect().width as number - width
    selectAreaOffsets.topExtend = domEntryHead?.getBoundingClientRect().height as number
  })

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
  $: matrixHead = Array(16).fill(0).map((v, ind)=>ind)
</script>

<svelte:window 
  on:mousedown={(e)=>{
    if(e.button==0){
      selecting = true
      dragFrom = {x: e.clientX, y: e.clientY}
    }
  }}
  on:mouseup={(e)=>{
    if(e.button==1){
      scrolling = false
    }
    else if(e.button==0){
      selecting = false
      dragTo = {x: e.clientX, y: e.clientY}
    }
  }}
  on:mousemove={(e)=>{
    if(scrolling){
      scrollX += e.movementX
      scrollY += e.movementY
    }
    if(e.button==0 && selecting){
      dragTo = {x: e.clientX, y: e.clientY}
    }
  }}/>
<div id='wrap'
  on:wheel={(e)=>{
  // @ts-ignore
    scrollY += e.wheelDeltaY/10;
  }}>
  <div id='entry-panel'>
    <div id='entry-head' style='height: 2em'
    bind:this={domEntryHead}/>
    <table id='entries' 
    style='top: {scrollY%height}px'>
      {#each renderedLines as i, ind}
        <Entry width={width} height={height} line={i}
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
  </div>
  
  <div id='matrix-panel'>
    <table id='matrix-head'
      style='height: 2em; left: {scrollX%width}px'
    ><tr>
      {#each matrixHead as i}
        <th style='min-width: {width}px'>{x+i}</th>
      {/each}
    </tr></table>
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
      style='left: {scrollX%width}px; top: {scrollY%height}px'
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
                    data: Array(column+1).fill(0).map((v, k)=>k===column?data:NaN)
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

  <SelectArea 
    leftExtend1={selectAreaOffsets.leftExtend1}
    leftExtend2={selectAreaOffsets.leftExtend2}
    topExtend={selectAreaOffsets.topExtend}
    width={width}
    height={height}
    bind:dragFrom
    bind:dragTo
  />
</div>

<style>
  #wrap{
    z-index: -1;
    position: relative;
    display: flex;
  }
  #entries{
    position: relative;
    border-spacing: 0;
    border-collapse: collapse;
  }
  #matrix-head{
    position: relative;
    border-spacing: 0;
    border-collapse: collapse;
    z-index: 1;
  }
  #matrix{
    position: relative;
    border-spacing: 0;
    border-collapse: collapse;
  }
</style>