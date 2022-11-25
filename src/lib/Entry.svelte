<script lang="ts">
  import {type RenderedLine} from '$lib/linentry'
  export let line:RenderedLine
  export let isRunning = false
  export let isMain = false
</script>

<tr class='entry'>
  <td class='tick' style='color: {isRunning?'#0f0':(isMain?'#f00':'#00000000')}'>{'>'}</td>
  <td class='command'><input type='text' value={line.command}></td>
  <td class='data'>
    {#each line.data as i}
      <span class='unit'>{i}</span>
    {/each}
  </td>
</tr>

<style>
  .unit{
    padding: 0 .5em;
  }
</style>