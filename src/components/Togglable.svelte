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

<div role="grid" class="itemgrid">
    {#each optionsCopy as x, i (x[0])}
        <div
            tabindex={i}
            role="cell"
            class="option {isMobile ? 'mobile' : ''} {oneOnly ? '' : 'multiselect'}"
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
                        for (let j = 0; j < newOptions.length; j++) {
                            if (j !== i) {
                                newOptions[j] = [newOptions[j][0], newOptions[j][1], false];
                            }
                        }
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
    .itemgrid {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }

    .option {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        margin: 10px 0;
        text-align: left;
        border-radius: 5px;
        padding: 10px;
        transition: var(--transition-standard);
        border: var(--color-border) 1px solid;
        background-color: var(--color-bg-secondary);
        font-family: var(--font-secondary);
        color: var(--color-fg-secondary);
        width: calc(100% - 22px);
    }

    .option:focus {
        outline: 2px solid var(--color-accent-secondary);
    }

    .option span {
        flex: 1;
        font-size: 0.9em;
        max-width: 70%;
    }

    input[type="checkbox"] {
        cursor: pointer;
        appearance: none;
        width: 20px;
        height: 20px;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg-tertiary);
        transition: var(--transition-standard);
        border-radius: 50%;
        cursor: pointer;
    }

    .option.multiselect input[type="checkbox"] {
        border-radius: 5px;
    }

    input[type="checkbox"]:checked {
        background-color: var(--color-fg);
    }

    input[type="checkbox"]:focus {
        outline: none;
    }
</style>
