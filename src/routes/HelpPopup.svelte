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

<div id="default-modal" tabindex="-1" class="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
    <div class="relative w-full max-w-2xl p-3 sm:p-4">
        <!-- Modal content -->
        <div class="relative max-h-[85svh] overflow-y-auto rounded-lg bg-white shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="sticky top-0 flex items-center justify-between rounded-t border-b bg-white p-4 dark:border-gray-600 dark:bg-gray-700 md:p-5">
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
            <div class="space-y-4 p-4 md:p-5">
                <table class="w-full text-sm sm:text-base">
                    <tbody>
                    {#each commandList as command}
                        <tr class="align-top">
                            <td class="w-7 py-2 pr-4 font-mono text-gray-500">{command.name}</td>
                            <td class="py-2 text-gray-500">{command.pose}</td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
