<script>
  import CodeEditor from "./CodeEditor.svelte";
  import Camera from "./Camera.svelte";
  import Switch from "./Switch.svelte";
  import { io } from "socket.io-client";
  import ErrorToast from "./ErrorToast.svelte";
  import HelpPopup from "./HelpPopup.svelte";

  // variables
  let switchValue;
  let showHelp = false;
  let code = {
    program_text: ["..."],
    program_emojis: ["..."],
    stack: ["..."],
    errors: [],
  };

  // socket stuff
  const socket = io.connect("http://localhost:6969");
  socket.on("connect", () => {
    console.log(socket.id);
  });

  socket.on("state", (message) => {
    console.log(message);
    let data = JSON.parse(message);
    code = { ...code, ...data };
  });

  socket.on("error", (message) => {
    const id = Math.floor(Math.random() * 999);
    code.errors = [...code.errors, { message, id }];
    console.log(code.errors);
  });

  // functions
  function removeToast(event) {
    code.errors = code.errors.filter((arr) => arr.id !== event.detail.id);
  }

  function toggleHelp() {
    showHelp = !showHelp;
  }

  function clearPage() {
    socket.emit("clear");
    code = {
      program_text: ["..."],
      program_emojis: ["..."],
      stack: ["..."],
      errors: [],
    };
  }
</script>

<div class="flex">
  <!--3 Main Columns-->
  <div class="w-full grid grid-cols-3">
    <div class="overlay">
      <div class="splashscreen-text">
        <img src="baboon.svg" alt="Baboon" width="25%" />
        <div class="sstext">
          <h1>baboon</h1>
          <div class="text-wrapper">
            <p>The world's first motion-based programming language. </p>
          </div>
        </div>
      </div>
    </div>
    <div class="px-6 py-4 shadow-xl">
      <p class="text-lg font-bold">Runtime Stack</p>
      <CodeEditor codeLines={code.stack} />
    </div>
    <div>
      <Camera {socket} />
    </div>
    <div class="px-6 py-4 shadow-xl">
      <div class="flex justify-between align-center">
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
    </div>
  </div>

  <!--Error Toast and Help Popup-->
  <div class="fixed inset-x-4 bottom-0">
    {#each code.errors as error (error.id)}
      <ErrorToast {error} on:change={removeToast} />
    {/each}
  </div>
  <div class="fixed end-8 bottom-6">
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
</div>
