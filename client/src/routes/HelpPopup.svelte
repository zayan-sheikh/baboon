<script>
    export let close;
    let commandList = [
        { name: "0", pose: "big O with your arms" },
        { name: "1", pose: "right hand straight up in the air" },
        { name: "+", pose: "make a T-pose" },
        { name: "dup2", pose: "raise both your arms at 90 degrees" },
        { name: "start", pose: "make an F with your arms to the right" },
        { name: "end", pose: "put both your hands in front of you as if you're stopping an evil force" },
        { name: "run", pose: "make a running pose to the right" },
        { name: "undo", pose: "dab." },
        { name: "none", pose: "arms by your sides" }
    ];
</script>

<div id="default-modal" tabindex="-1" class="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-black bg-opacity-50">
    <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Command List
                </h3>
                <button on:click={close} type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            <!-- Modal body -->
            <div class="p-4 md:p-5 space-y-4">
                <table>
                    <tbody>
                    {#each commandList as command}
                        <tr>
                            <td class="text-gray-500 w-7 font-mono pr-4">{command.name}</td>
                            <td class="text-gray-500 flex-1">{command.pose}</td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>