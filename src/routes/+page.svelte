<script>
  import CodeEditor from "./CodeEditor.svelte";
  import Camera from "./Camera.svelte";
  import Switch from "./Switch.svelte";
  import ErrorToast from "./ErrorToast.svelte";
  import HelpPopup from "./HelpPopup.svelte";
  import { BaboonLanguage } from "$lib/language.js";

  // variables
  let switchValue;
  let showHelp = false;
  const language = new BaboonLanguage();
  let code = {
    program_text: ["..."],
    program_emojis: ["..."],
    stack: ["..."],
    errors: [],
  };

  function addError(message) {
    const id = crypto.randomUUID();
    code.errors = [...code.errors, { message, id }];
    console.log(code.errors);
  }

  function handlePose(pose) {
    try {
      language.doPose(pose);
      code = { ...code, ...language.getState() };
    } catch (error) {
      addError(error.message);
    }
  }

  // functions
  function removeToast(event) {
    code.errors = code.errors.filter((arr) => arr.id !== event.detail.id);
  }

  function toggleHelp() {
    showHelp = !showHelp;
  }

  function clearPage() {
    language.clear();
    code = {
      program_text: ["..."],
      program_emojis: ["..."],
      stack: ["..."],
      errors: [],
    };
  }
</script>

<main class="min-h-screen">
  <!--3 Main Columns-->
  <div class="grid w-full grid-cols-1 lg:grid-cols-3">
    <div class="overlay">
      <div class="splashscreen-text px-6">
        <img src="baboon.svg" alt="Baboon" class="w-24 sm:w-1/4 sm:max-w-xs" />
        <div class="sstext text-center sm:text-left">
          <h1>baboon</h1>
          <div class="text-wrapper">
            <p>The world's first motion-based programming language. </p>
          </div>
        </div>
      </div>
    </div>
    <section class="order-2 px-4 py-5 shadow-xl sm:px-6 lg:order-1 lg:min-h-screen lg:py-4">
      <p class="text-lg font-bold">Runtime Stack</p>
      <CodeEditor codeLines={code.stack} />
    </section>
    <div class="order-1 lg:order-2">
      <Camera onPose={handlePose} />
    </div>
    <section class="order-3 px-4 py-5 shadow-xl sm:px-6 lg:min-h-screen lg:py-4">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <Switch
          bind:value={switchValue}
          design="multi"
          options={["Text", "Emoji"]}
        />
        <button
          on:click={clearPage}
          class="bg-gray-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
        >
          Clear
        </button>
      </div>
      <CodeEditor
        codeLines={switchValue === "Text"
          ? code.program_text
          : code.program_emojis}
      />
    </section>
  </div>

  <!--Error Toast and Help Popup-->
  <div class="fixed inset-x-4 bottom-0 z-50">
    {#each code.errors as error (error.id)}
      <ErrorToast {error} on:change={removeToast} />
    {/each}
  </div>
  <div class="fixed end-4 bottom-4 sm:end-8 sm:bottom-6">
    <button
      on:click={toggleHelp}
      class="bg-white hover:bg-gray-200 rounded-full w-12 h-12"
    >
      <span class="text-black text-xl">?</span>
    </button>
  </div>
  <div>
    {#if showHelp}
      <HelpPopup close={toggleHelp} />
    {/if}
  </div>
</main>
