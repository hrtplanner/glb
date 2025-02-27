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
        background-color: #dddddd;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        color: black;
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