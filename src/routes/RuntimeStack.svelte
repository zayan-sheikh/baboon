<script>
    export let stack;
</script>

<p class="text-lg font-bold mb-2">Runtime Stack</p>
<div class="bg-gray-900 px-2 py-1 rounded-md">
    <table>
        <tbody>
            {#each stack as stackLine, i}
                <tr>
                    <td class="text-gray-400 w-8 font-mono">{i+1}</td>
                    <td class="flex-1 font-mono">{stackLine}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>