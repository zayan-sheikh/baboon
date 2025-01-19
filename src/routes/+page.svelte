<script>
    import CodeEditor from "./CodeEditor.svelte";
    import Camera from "./Camera.svelte";
    import Switch from './Switch.svelte'

    let switchValue;
    let stack = ["sajhdashd","asdgsagdsd"];
    let code = {
        text: ["bozo", "touch some grass"],
        emoji: ["🍕🐘🎨", "🐝🌈📚✨🏖️🎲"]
    };
</script>

<div class="flex">
    <div class="w-full m-4 grid grid-cols-3 gap-4">
        <div>
            <p class="text-lg font-bold">Runtime Stack</p>
            <CodeEditor codeLines={stack}/>
        </div>
        <div>
            <Camera/>
        </div>
        <div>
            <Switch bind:value={switchValue} design="multi" options={['Text', 'Emoji']}/>
            <CodeEditor codeLines={switchValue == "Emoji" ? code.emoji : code.text}/>
        </div>
    </div>
</div>