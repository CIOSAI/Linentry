<script lang="ts">
  import {type RenderedLine, namesToCommands} from '$lib/linentry'
  import AutocompleteText from './AutocompleteText.svelte';
  export let height = 40
  export let line:RenderedLine
  export let ind = 0
  export let isRunning = false
  export let isMain = false
  export let onCommandChanged = (index:number, str:string)=>{}

  let lineData = line.data
  $: for(let i=lineData.length; i<8; i++) lineData.push(NaN)
</script>

<tr class='entry' style='height: {height}px'>
  <td class='index' style='border: {isMain?'2px':'0'} solid #000'>{ind}</td>
  <td class='tick' style='color: {isRunning?'#0f0':'#00000000'}'>{'>'}</td>
  <td class='command'>
    <AutocompleteText 
      allowed={Array.from(namesToCommands.keys())} 
      value={line.command}
      valueHandler={(str)=>{onCommandChanged(ind, str)}}
    />
  </td>
  {#each lineData as i}
    <td class='unit'><input type='text' value={i?i:''} maxlength="2"></td>
  {/each}
</tr>

<style>
  .index{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .unit{
    padding: 0 .5em;
  }
  .unit input{
    width: 2em;
  }
</style>