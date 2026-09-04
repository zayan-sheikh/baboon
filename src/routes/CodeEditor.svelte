<script>
    export let codeLines;
</script>

<div class="mt-2 overflow-x-auto rounded-md bg-gray-900 px-2 py-1">
    <table class="w-full">
        <tbody>
        {#each codeLines as codeLine, i}
            <tr>
                <td class="w-7 font-mono text-gray-400">{i+1}</td>
                <td class="whitespace-nowrap font-mono">{codeLine}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
