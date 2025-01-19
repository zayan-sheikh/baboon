<script>
    export let codeLines;
</script>

<div class="mb-4 flex gap-2">
    <button class="bg-transparent hover:bg-gray-500 font-semibold hover:text-white py-1 px-2 border border-gray-300 hover:border-transparent rounded">
        ▶︎   Run
    </button>
    <button class="bg-transparent hover:bg-gray-500 font-semibold hover:text-white py-1 px-2 border border-gray-300 hover:border-transparent rounded">
        𝚃   Text View
    </button>
</div>

<div class="bg-gray-900 px-2 py-1 rounded-md">
    <table>
        <tbody>
        {#each codeLines as codeLine, i}
            <tr>
                <td class="text-gray-400 w-8 font-mono">{i+1}</td>
                <td class="flex-1 font-mono">{codeLine}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

