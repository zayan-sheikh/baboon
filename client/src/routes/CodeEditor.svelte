<script>
    export let codeLines;
</script>

<div class="bg-gray-900 px-2 py-1 rounded-md mt-2">
    <table>
        <tbody>
        {#each codeLines as codeLine, i}
            <tr>
                <td class="text-gray-400 w-7 font-mono">{i+1}</td>
                <td class="flex-1 font-mono">{codeLine}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

