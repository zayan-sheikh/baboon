<script>
    import CodeEditor from "./CodeEditor.svelte";
    import Camera from "./Camera.svelte";
    import Switch from './Switch.svelte'
    import { io } from 'socket.io-client'
    import ErrorToast from "./ErrorToast.svelte";

    let switchValue;
    let code = {
        program_text: ["..."],
        program_emojis: ["..."],
        stack: ["..."],
        error: ""
    };


    const socket = io.connect('http://localhost:6969');
    socket.on("connect", () => {
        console.log(socket.id);
    });

    socket.on('state', (message) => {
        console.log(message);
        code = JSON.parse(message);
    })

    socket.on('error', (message) => {
        console.log(message);
        code.error = message;
    })

    function removeToast() {
        code.error = ""
    }
</script>

<div class="flex">
    <div class="w-full grid grid-cols-3">
        <div class="px-6 py-4 shadow-xl">
            <p class="text-lg font-bold">Runtime Stack</p>
            <CodeEditor codeLines={code.stack}/>
        </div>
        <div>
            <Camera/>
        </div>
        <div class="px-6 py-4 shadow-xl">
            <Switch bind:value={switchValue} design="multi" options={['Text', 'Emoji']}/>
            <CodeEditor codeLines={switchValue === "Text" ? code.program_text : code.program_emojis}/>
        </div>
    </div>
    <div class="fixed end-4 bottom-0">
        {#if code.error && code.error.length > 0}
            <ErrorToast error={code.error} on:change={removeToast} />
        {/if}
    </div>
</div>