<script lang="ts">
  import { Linentry } from '$lib/linentry.js';

  let arr = ['a', 'b', 'c'];

  let say = Linentry.hello();
</script>

<div id='viewport'>
  <div id='bruh'>
    {#each arr as i}
      <span class='entry'>{i}</span>
    {/each}
  </div>
  <span>{say}</span>
</div>

<style>
  #viewport{
    width: 100vw;
    height: 100vh;
  }

  #bruh{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .entry{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    width: 100%;
    border: 2px solid rgb(11, 62, 7)  }
</style>