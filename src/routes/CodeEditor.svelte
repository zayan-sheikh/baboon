<script>
  export let codeLines;
  export let emptyLabel = "Nothing here yet";
  $: isEmpty = codeLines.length === 1 && codeLines[0] === "...";
</script>

<div class="code-surface">
  {#if isEmpty}
    <div class="code-empty"><span>›_</span><p>{emptyLabel}</p></div>
  {:else}
    <table><tbody>{#each codeLines as codeLine, i}<tr><td>{String(i + 1).padStart(2, "0")}</td><td>{codeLine}</td></tr>{/each}</tbody></table>
  {/if}
</div>
