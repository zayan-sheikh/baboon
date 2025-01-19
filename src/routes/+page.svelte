<script>
    import RuntimeStack from "./RuntimeStack.svelte";
    import CodeEditor from "./CodeEditor.svelte";
    let stack = ["sajhdashd","asdgsagdsd"];
    let codeLines = ["bozo", "touch some grass"];
</script>

<div class="m-4 grid grid-cols-3 gap-4">
    <div>
        <RuntimeStack stack={stack}/>
    </div>
    <div>
        <p>Camera</p>
    </div>
    <div>
        <CodeEditor codeLines={codeLines}/>
    </div>
</div>