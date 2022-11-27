<script lang="ts">
  import {type RenderedLine} from '$lib/linentry'
	import { text } from 'svelte/internal';
  export let height = 40
  export let width = 40
  export let line:RenderedLine
  export let ind = 0
  export let coord = 0
  export let onDataChanged = (row:number, column:number, n:number)=>{}

  let lineData = [...line.data]
  let renderedData = [...lineData]

  $: lineData = [...line.data]?[...line.data]:[]

  $: {
    renderedData = []
    for(let i=0; i<8; i++){
      renderedData.push(
        (coord+i) in lineData ?
        lineData[coord+i] :
        NaN
      )
    }
  }
</script>

<tr class='entry' style='height: {height}px'>
  {#each renderedData as i, column}
    <td class='unit' style='width: {width}px'><input type='text' value={isNaN(i)?'':i} placeholder="-" 
      on:change={(e)=>{
        // @ts-ignore
        let sourceVal = e.target.value
        
        if(!new RegExp(/((^|, )(|(-?[0-9]+([.,][0-9]+)?)|[^\\]|\\[0-9\\]))+$/).test(sourceVal)){
          return
        }

        if(sourceVal==='') sourceVal=NaN
        else if(new RegExp(/\\[0-9\\]/).test(sourceVal)) sourceVal=sourceVal.charCodeAt(1)
        else if(new RegExp(/-?[0-9]+([.,][0-9]+)?/).test(sourceVal)) sourceVal=Number(sourceVal.replace(',', '.'))
        else sourceVal=sourceVal.charCodeAt(0)
        
        onDataChanged(ind, coord+column, sourceVal)
      }}></td>
  {/each}
</tr>

<style>
  .unit{
    padding: 0 .5em;
  }
  .unit input{
    width: 100%;
    border: none;
  }
</style>