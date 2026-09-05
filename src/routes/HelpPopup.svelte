<script>
  export let close;
  const commands = [
    { name: "0", pose: "Make a large O with your arms" },
    { name: "1", pose: "Raise your right hand straight up" },
    { name: "+", pose: "Hold a T-pose" },
    { name: "dup2", pose: "Raise both arms at 90 degrees" },
    { name: "start", pose: "Make an F with your arms to the right" },
    { name: "end", pose: "Hold both hands forward in a stop pose" },
    { name: "run", pose: "Make a running pose to the right" },
    { name: "undo", pose: "Dab" },
    { name: "none", pose: "Rest your arms by your sides" }
  ];
</script>

<div class="modal-backdrop" role="presentation">
  <section class="help-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title">
    <header><div><span class="eyebrow">Reference</span><h2 id="guide-title">Gesture guide</h2><p>Hold each pose briefly and keep your full upper body in frame.</p></div>
      <button class="icon-button" on:click={close} aria-label="Close gesture guide"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </header>
    <div class="command-list">{#each commands as command}<div class="command-row"><code>{command.name}</code><span>{command.pose}</span></div>{/each}</div>
    <footer><span><i></i>Camera processing stays on this device</span><button on:click={close}>Got it</button></footer>
  </section>
</div>
