<script>
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  export let error;
  const dispatch = createEventDispatcher();
  const timer = setTimeout(() => dispatch("change", { id: error.id }), 3000);
  onDestroy(() => clearTimeout(timer));
</script>

<div class="error-toast" role="alert" in:fly={{ y: 12, duration: 180 }} out:fly={{ x: 20, duration: 160 }}>
  <div class="error-icon">!</div><div><strong>Couldn’t run that</strong><p>{error.message}</p></div>
  <button on:click={() => dispatch("change", { id: error.id })} aria-label="Dismiss error">×</button>
</div>
