<script>
    import CodeEditor from "./CodeEditor.svelte";
    import Camera from "./Camera.svelte";
    import Switch from './Switch.svelte'
    import { io } from 'socket.io-client'

    const socket = io.connect('http://localhost:6969');

    socket.on('eventFromServer', (message) => {
        console.log(message);
    })
    // $: {
    //     // send message to server
    //     socket.emit('eventFromClient', $reactiveValue)
    // }

    let switchValue;
    let stack = ["sajhdashd","asdgsagdsd"];
    let code = {
        text: ["bozo", "touch some grass"],
        emoji: ["🍕🐘🎨", "🐝🌈📚✨🏖️🎲"]
    };
</script>

<div class="flex">
    <div class="w-full grid grid-cols-3">
        <div class="p-4 shadow-xl">
            <p class="text-lg font-bold">Runtime Stack</p>
            <CodeEditor codeLines={stack}/>
        </div>
        <div>
            <Camera/>
        </div>
        <div class="p-4 shadow-xl">
            <Switch bind:value={switchValue} design="multi" options={['Text', 'Emoji']}/>
            <CodeEditor codeLines={switchValue === "Text" ? code.text : code.emoji}/>
        </div>
    </div>
</div>