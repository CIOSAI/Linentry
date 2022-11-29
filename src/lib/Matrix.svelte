<script lang="ts">
  import {type RenderedLine} from '$lib/linentry'
  export let height = 40
  export let width = 40
  export let line:RenderedLine
  export let ind = 0
  export let coord = 0
  export let onDataChanged = (row:number, column:number, n:number)=>{}

  let lineData = [...line.data]
  let renderedData = [...lineData]
  let dataUnusable = [...lineData].map(()=>false)

  $: lineData = [...line.data]?[...line.data]:[]

  $: {
    renderedData = []
    for(let i=0; i<16; i++){
      renderedData.push(
        (coord+i) in lineData ?
        lineData[coord+i] :
        NaN
      )
    }
  }

  $: dataUnusable = dataUnusable
</script>

<tr class='entry' style='height: {height}px'>
  {#each renderedData as i, column}
    <td class='unit' style='width: {width}px; color: {dataUnusable[i]?'#f00':'#000'}'>
      <input type='text' value={isNaN(i)?'':i} placeholder="-" 
      on:change={(e)=>{
        // @ts-ignore
        let sourceVal = e.target.value
        
        if(!new RegExp(/((^|, )(|(-?[0-9]+([.,][0-9]+)?)|[^\\]|\\[0-9\\]))+$/).test(sourceVal)){
          dataUnusable[i] = true
          alert(`'${sourceVal}' is not usable, the data will not update to it.`)
          return
        }
        dataUnusable[i] = false

        if(sourceVal==='') sourceVal=NaN
        else if(new RegExp(/\\[0-9\\]/).test(sourceVal)) sourceVal=sourceVal.charCodeAt(1)
        else if(new RegExp(/-?[0-9]+([.,][0-9]+)?/).test(sourceVal)) sourceVal=Number(sourceVal.replace(',', '.'))
        else sourceVal=sourceVal.charCodeAt(0)

        onDataChanged(ind, coord+column, sourceVal)

        lineData = lineData
      }}></td>
  {/each}
</tr>

<style>
  .unit input{
    width: 100%;
    border: none;
    color: inherit;
  }
</style>