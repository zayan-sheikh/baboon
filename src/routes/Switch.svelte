<script>
  export let options = [];
  export let value = options[0];
</script>

<fieldset class="segmented-control" aria-label="Program display">
  {#each options as option}
    <label class:active={value === option}>
      <input type="radio" name="program-display" value={option} bind:group={value} />
      <span>{option === "Text" ? "Aa" : "✦"}</span>{option}
    </label>
  {/each}
</fieldset>
