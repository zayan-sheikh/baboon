<script>
  import CodeEditor from "./CodeEditor.svelte";
  import Camera from "./Camera.svelte";
  import Switch from "./Switch.svelte";
  import ErrorToast from "./ErrorToast.svelte";
  import HelpPopup from "./HelpPopup.svelte";
  import { BaboonLanguage } from "$lib/language.js";

  let switchValue = "Text";
  let showHelp = false;
  const language = new BaboonLanguage();
  let code = { program_text: ["..."], program_emojis: ["..."], stack: ["..."], errors: [] };

  function addError(message) {
    code.errors = [...code.errors, { message, id: crypto.randomUUID() }];
  }

  function handlePose(pose) {
    try {
      language.doPose(pose);
      code = { ...code, ...language.getState() };
    } catch (error) {
      addError(error.message);
    }
  }

  function removeToast(event) {
    code.errors = code.errors.filter((item) => item.id !== event.detail.id);
  }

  function clearPage() {
    language.clear();
    code = { program_text: ["..."], program_emojis: ["..."], stack: ["..."], errors: [] };
  }
</script>

<svelte:head>
  <title>Baboon — Programming in motion</title>
  <meta name="description" content="A motion-based programming language that runs entirely in your browser." />
</svelte:head>

<main class="app-shell">
  <div class="ambient ambient-one" aria-hidden="true"></div>
  <div class="ambient ambient-two" aria-hidden="true"></div>

  <div class="overlay">
    <div class="splashscreen-text">
      <div class="splash-logo"><img src="/baboon.svg" alt="" /></div>
      <div class="sstext">
        <h1>baboon</h1>
        <p>Programming, in motion.</p>
      </div>
    </div>
  </div>

  <header class="topbar">
    <div class="brand">
      <div class="brand-mark"><img src="/baboon.svg" alt="" /></div>
      <div><strong>baboon</strong><span>Motion programming studio</span></div>
    </div>
    <div class="topbar-actions">
      <span class="privacy-badge"><i></i>Runs on your device</span>
      <button class="icon-button" on:click={() => showHelp = true} aria-label="Open gesture guide">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.4 9a2.7 2.7 0 1 1 4.7 1.8c-1.15.85-2.1 1.35-2.1 3.2M12 18h.01"/></svg>
      </button>
    </div>
  </header>

  <div class="workspace">
    <section class="camera-panel panel">
      <div class="panel-heading camera-heading">
        <div><span class="eyebrow">Live workspace</span><h1>Motion input</h1><p>Use your camera to turn gestures into executable code.</p></div>
        <span class="gesture-count">9 gestures</span>
      </div>
      <Camera onPose={handlePose} />
    </section>

    <aside class="inspector">
      <section class="panel compact-panel">
        <div class="panel-heading row-heading"><div><span class="eyebrow">Memory</span><h2>Runtime stack</h2></div><span class="count-badge">{code.stack[0] === "..." ? 0 : code.stack.length}</span></div>
        <CodeEditor codeLines={code.stack} emptyLabel="Your values will appear here" />
      </section>

      <section class="panel program-panel">
        <div class="panel-heading row-heading">
          <div><span class="eyebrow">Output</span><h2>Program</h2></div>
          <button class="clear-button" on:click={clearPage}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/></svg>Clear
          </button>
        </div>
        <Switch bind:value={switchValue} options={["Text", "Emoji"]} />
        <CodeEditor codeLines={switchValue === "Text" ? code.program_text : code.program_emojis} emptyLabel="Your program will appear here" />
      </section>

      <div class="tip-card">
        <div class="tip-icon">✦</div><div><strong>Hold steady</strong><p>Pause briefly after each gesture for more reliable recognition.</p></div>
      </div>
    </aside>
  </div>

  <div class="toast-region" aria-live="polite">
    {#each code.errors as error (error.id)}<ErrorToast {error} on:change={removeToast} />{/each}
  </div>
  {#if showHelp}<HelpPopup close={() => showHelp = false} />{/if}
</main>
