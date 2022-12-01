<script lang="ts">
  export let leftExtend1 = 0;
  export let leftExtend2= 0;
  export let topExtend = 0;
  export let rightBound = 16;
  export let bottomBound = 8;
  export let width = 40;
  export let height = 40;
  export let dragFrom = {x: 0, y: 0};
  export let dragTo = {x: 0, y: 0};
  let left = 1;
  let top = 1;
  let right = 12;
  let bottom = 6;

  function clamp(value:number, mn:number, mx:number) {
    return Math.max(Math.min(value, mx), mn)
  }

  $: {
    let incoord = (Math.min(dragFrom.x, dragTo.x))
    if(incoord<leftExtend1+leftExtend2){
      left = Math.min(dragFrom.x, dragTo.x)>leftExtend1?-1:-2
    }
    else{
      left = Math.floor((Math.min(dragFrom.x, dragTo.x)-leftExtend1-leftExtend2)/width-1)
    }
    left = clamp(left, -2, rightBound)
  }
  $: { 
    right = Math.ceil((Math.max(dragFrom.x, dragTo.x)-leftExtend1-leftExtend2)/width-1) 
    right = clamp(right, -2, rightBound)
  }
  $: { 
    top = Math.floor((Math.min(dragFrom.y, dragTo.y)-topExtend)/height-2) 
    top = clamp(top, -1, bottomBound)
  }
  $: { 
    bottom = Math.ceil((Math.max(dragFrom.y, dragTo.y)-topExtend)/height-2) 
    bottom = clamp(bottom, -1, bottomBound)
  }

</script>

<div id='select-area' 
style='
  left: {left<0?(left==-1?leftExtend1:0):leftExtend1+leftExtend2 + left*width}px; 
  top: {topExtend + top*height}px; 
  width: {right*width-left<0?(left==-1?leftExtend1:0):left*width}px; 
  height: {(bottom-top)*height}px;
'/>

<style>
  #select-area{
    position: absolute;
    pointer-events: none;
    background-color: #00ff0020;
  }
</style>