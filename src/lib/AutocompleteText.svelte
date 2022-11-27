<script lang="ts">
  export let allowed:string[] = []
  export let value = ''
  export let valueHandler = (s:string)=>{}

  let suggest = ''

  $: value = value.toUpperCase()

  $: {
    let currentChoice:string|undefined

    for(let i of allowed){
      if(i===value){
        currentChoice = i
      }
    }

    if(currentChoice===undefined){
      let mostMatched = 0
      for(let i of allowed){
        let matched = 0
        for(let j=0; j<Math.min(i.length, value.length); j++){
          if(i[j]===value[j]) matched++
        }
        if(matched>mostMatched){
          mostMatched = matched
          currentChoice = i
        }
      }
    }

    suggest = currentChoice?currentChoice:''
  }
</script>

<div id='container'>
  <input id='input' type='text' bind:value 
  on:keydown={(e)=>{
    if(e.key==='Tab'){
      value = suggest
      valueHandler(value)
    } 
  }}
  on:focusout={()=>{value = suggest;valueHandler(value)}}>
  <span id='actual'>{value}</span>
  <span id='suggest'>{suggest.slice(value.length)}</span>
</div>

<style>
  #container{
    width: 80px;
    height: 1em;
  }

  #input{
    width: 80px;
    position: absolute;
    opacity: 0;
  }

  #actual{
    width: 100%;
  }

  #suggest{
    color: #0f0;
  }
</style>