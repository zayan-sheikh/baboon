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
        errors: []
    };


    const socket = io.connect('http://localhost:6969');
    socket.on("connect", () => {
        console.log(socket.id);
    });

    socket.on('state', (message) => {
        let data = JSON.parse(message);
        code = {...code, data};
    })

    socket.on('error', (message) => {
        const id = Math.floor(Math.random() * 999);
        code.errors = [...code.errors, {message, id}];
        console.log(code.errors);
    })

    function removeToast(event) {
        code.errors = code.errors.filter( arr =>  arr.id !== event.detail.id )
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
        {#each code.errors as error (error.id)}
            <ErrorToast {error} on:change={removeToast} />
        {/each}
    </div>
</div>