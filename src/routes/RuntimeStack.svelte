<script>
    export let stack;
</script>

<p class="font-bold">Runtime Stack</p>
<table>
    <tbody>
        {#each stack as stackLine, i}
            <tr>
                <td>{i+1}</td>
                <td>{stackLine}</td>
            </tr>
        {/each}
    </tbody>
</table>