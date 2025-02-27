<script lang="ts">
    import { getContext } from 'svelte';

    import Popup from './Popup.svelte';
    import type { Context } from 'svelte-simple-modal';

    const { open } = getContext<Context>('simple-modal');

    const showSurprise = () => open(Popup);
</script>

<p><button onclick={showSurprise}>Huh?</button></p>

<style>
    button {
        background-color: var(--color-bg-secondary);
        border: 1px solid var(--color-accent);
        box-sizing: border-box;
        color: var(--color-fg-secondary);
        padding: 10px 10px;
        border-radius: 2px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
    }
</style>