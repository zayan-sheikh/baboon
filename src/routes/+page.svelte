<script>
    import RuntimeStack from "./RuntimeStack.svelte";
    import CodeEditor from "./CodeEditor.svelte";
    import Camera from "./Camera.svelte";
    let stack = ["sajhdashd","asdgsagdsd"];
    let codeLines = ["bozo", "touch some grass"];
</script>

<div class="flex">
    <div class="w-full m-4 grid grid-cols-3 gap-4">
        <div>
            <RuntimeStack stack={stack}/>
        </div>
        <div>
            <Camera/>
        </div>
        <div>
            <CodeEditor codeLines={codeLines}/>
        </div>
    </div>
</div>