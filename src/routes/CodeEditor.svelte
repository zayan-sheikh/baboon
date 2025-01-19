<script>
    export let codeLines;
</script>

<button class="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-1 px-2 border border-gray-300 hover:border-transparent rounded">
    Run
</button>
<button class="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-1 px-2 border border-gray-300 hover:border-transparent rounded">
    Text View
</button>
<table>
    <tbody>
        {#each codeLines as codeLine, i}
            <tr>
                <td>{i+1}</td>
                <td>{codeLine}</td>
            </tr>
        {/each}
    </tbody>
</table>