<script>
    import Switch from './Switch.svelte'

    export let codeLines;
    let switchValue;
</script>

<div class="mb-4">
    <Switch bind:value={switchValue} design="multi" options={['Emoji', 'Text']}/>
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

