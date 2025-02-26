<script lang="ts">
    import type { Writable } from "svelte/store";

    export type Options = [number, string, boolean][];

    let {
        options,
        oneOnly = false,
        isMobile = false,
    }: {
        options: Writable<Options>;
        oneOnly?: boolean;
        isMobile?: boolean;
    } = $props();

    let optionsCopy: Options = $state([]);

    options.subscribe((value) => {
        optionsCopy = value;
    });
</script>

<div role="grid">
    {#each optionsCopy as x, i (x[0])}
        <div
            tabindex={i}
            role="cell"
            class="option {isMobile ? 'mobile' : ''}"
            style="user-select: none;"
            data-index={i}
        >
            <span>{x[1]}</span>
            <input
                type="checkbox"
                bind:checked={() => x[2],
                (value) => {
                    if (oneOnly && value) {
                        const newOptions = optionsCopy.slice();
                        newOptions[i] = [x[0], x[1], value];
                        options.set(newOptions);
                        return;
                    }
                    const newOptions = optionsCopy.slice();
                    newOptions[i] = [x[0], x[1], value];
                    options.set(newOptions);
                }}
            />
        </div>
    {/each}
</div>

<style>
    .option {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 10px;
        text-align: left;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
        border: rgba(0, 0, 0, 0.1) solid 1px;
        font-family: "Roboto Flex", sans-serif;
    }

    .option.mobile {
        flex-direction: column;
        align-items: flex-start;
        margin: 10px;
        box-sizing: border-box;
        width: calc(90vw - 20px);
    }

    .option:focus {
        outline: 2px solid #000;
    }

    .option span {
        flex: 1;
        font-size: 0.9em;
    }

    .option.mobile span {
        margin-bottom: 0.5rem;
    }

    input[type="checkbox"] {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s;
        cursor: pointer;
    }

    input[type="checkbox"]:checked {
        background-color: #000;
    }

    input[type="checkbox"]:focus {
        outline: none;
    }
</style>
