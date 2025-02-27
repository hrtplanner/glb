<script lang="ts">
    import type { Writable } from "svelte/store";

    export type Options = [number, string, boolean][];

    let {
        options,
        isMobile,
    }: {
        options: Writable<Options>;
        isMobile?: boolean;
    } = $props();

    let draggedIndex: number | null = null;
    let touchStartY: number | null = null;

    let optionsCopy: Options = $state([]);

    options.subscribe((value) => {
        optionsCopy = value;
    });

    function handleDragStart(e: DragEvent | TouchEvent, index: number) {
        if (e.target instanceof HTMLInputElement) return;
        draggedIndex = index;
        if (e instanceof DragEvent) {
            e.dataTransfer!.effectAllowed = "move";
        } else if (e instanceof TouchEvent) {
            touchStartY = e.touches[0].clientY;
        }
    }

    function handleDragOver(e: DragEvent | TouchEvent, index: number) {
        if (e.target instanceof HTMLInputElement) return;
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const target = e.target as HTMLDivElement;
        const rect = target.getBoundingClientRect();
        const next = index > draggedIndex;
        const clientY =
            e instanceof DragEvent ? e.clientY : e.touches[0].clientY;
        const after = next && clientY > rect.top + rect.height / 2;
        const before = !next && clientY < rect.top + rect.height / 2;

        if (after || before) {
            const newOptions = optionsCopy.slice();
            const [movedItem] = newOptions.splice(draggedIndex, 1);
            newOptions.splice(
                index + (after ? 1 : 0) - (next ? 1 : 0),
                0,
                movedItem,
            );
            options.set(newOptions);
            draggedIndex = index + (after ? 1 : 0) - (next ? 1 : 0);
        }
    }

    function handleDragEnd(e: DragEvent | TouchEvent) {
        if (e.target instanceof HTMLInputElement) return;
        e.preventDefault();
        draggedIndex = null;
        touchStartY = null;
    }

    function handleTouchMove(e: TouchEvent) {
        if (draggedIndex !== null) {
            const touch = e.touches[0];
            const target = document.elementFromPoint(
                touch.clientX,
                touch.clientY,
            ) as HTMLDivElement;
            if (target && target.dataset.index !== undefined) {
                const index = parseInt(target.dataset.index, 10);
                handleDragOver(e, index);
            }
        }
    }

    function handleTouchEnd(e: TouchEvent) {
        if (e.target instanceof HTMLInputElement) return;
        handleDragEnd(e);
    }
</script>

<div role="grid" class="itemgrid {isMobile ? 'mobile' : ''}">
    {#each optionsCopy as x, i (x[0])}
        <div
            tabindex={i}
            role="cell"
            class="option draggable"
            draggable="true"
            ondragstart={(e) => handleDragStart(e, i)}
            ondragover={(e) => handleDragOver(e, i)}
            ondragend={handleDragEnd}
            ontouchstart={(e) => handleDragStart(e, i)}
            ontouchmove={handleTouchMove}
            ontouchend={handleTouchEnd}
            style="user-select: none;"
            data-index={i}
        >
            <div class="handle">☰</div>
            <span>{x[1]}</span>
            <input
                type="checkbox"
                bind:checked={() => x[2],
                (value) => {
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
        justify-content: left;
        width: 100%;
    }

    .handle {
        cursor: grab;
        margin-right: 0.5rem;
    }

    .option {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 10px 0;
        text-align: left;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.2s;
        border: rgba(0, 0, 0, 0.1) solid 1px;
        font-family: "Roboto Flex", sans-serif;
        width: calc(100% - 20px);
        box-sizing: border-box;
    }

    .itemgrid.mobile .option {
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

    input[type="checkbox"] {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 5px;
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
