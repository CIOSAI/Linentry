<script lang="ts">
  export let leftExtend1 = 0;
  export let leftExtend2= 0;
  export let topExtend = 0;
  export let rightBound = 16;
  export let bottomBound = 8;
  export let width = 40;
  export let height = 40;
  export let left = 1;
  export let top = 1;
  export let right = 12;
  export let bottom = 6;
</script>

<div id='select-area' 
  style='
    top: {topExtend + top*height}px; 
    left: {leftExtend1+leftExtend2 + left*width}px; 
    width: {Math.abs(right-left)*width}px; 
    height: {Math.abs(bottom-top)*height}px;
  '>
</div>

<style>
  #select-area{
    position: absolute;
    background-color: #00ff0080;
  }
</style>