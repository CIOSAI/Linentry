<script lang="ts">
  import {type RenderedLine, namesToCommands} from '$lib/linentry'
  import AutocompleteText from './AutocompleteText.svelte';
  export let width = 40;
  export let height = 40
  export let line:RenderedLine
  export let ind = 0
  export let isRunning = false
  export let isMain = false
  export let onCommandChanged = (index:number, str:string)=>{}
  export let onMainChanged = (index:number)=>{}
</script>

<tr class='entry' style='height: {height}px'>
  <td class='index' style='border: {isMain?'2px':'0'} solid #000; width: {width}px'>{ind}</td>
  <td class='tick'>
    <button 
      style='color: {isRunning?'#0f0':'#00000000'}' 
      on:click={()=>{onMainChanged(ind)}}
    >{'>'}</button>
  </td>
  <td class='command'>
    <AutocompleteText 
      allowed={Array.from(namesToCommands.keys())} 
      value={line.command}
      valueHandler={(str)=>{onCommandChanged(ind, str)}}
    />
  </td>
</tr>

<style>
  .index{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
</style>