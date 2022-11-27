<script lang="ts">
  import {type RenderedLine} from '$lib/linentry'
  export let height = 40
  export let width = 40
  export let line:RenderedLine
  export let ind = 0
  export let coord = 0
  export let onDataChanged = (index:number, n:number)=>{}

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
  {#each renderedData as i}
    <td class='unit' style='width: {width}px'><input type='text' value={i?i:''} placeholder="-" maxlength="2" 
      on:change={(e)=>{
        console.log(e)
        onDataChanged(ind+i, Number(0))
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