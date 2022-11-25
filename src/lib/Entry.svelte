<script lang="ts">
  import {type RenderedLine, namesToCommands} from '$lib/linentry'
  import AutocompleteText from './AutocompleteText.svelte';
  export let line:RenderedLine
  export let ind = 0
  export let isRunning = false
  export let isMain = false
</script>

<tr class='entry'>
  <td>{ind}</td>
  <td class='tick' style='color: {isRunning?'#0f0':(isMain?'#f00':'#00000000')}'>{'>'}</td>
  <td class='command'><AutocompleteText allowed={Array.from(namesToCommands.keys())} value={line.command}/></td>
  {#each line.data as i}
    <td class='unit'>{i}</td>
  {/each}
</tr>

<style>
  .unit{
    padding: 0 .5em;
  }
</style>